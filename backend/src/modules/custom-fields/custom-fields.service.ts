import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import type { AuthenticatedUserContext } from '../../common/guards/permissions.guard'
import { isDuplicateKeyError } from '../../common/utils/mongo-error.util'
import { AuditService } from '../audit/audit.service'
import {
  CUSTOM_FIELD_LIMITS,
  type CustomFieldForm,
} from './constants/custom-field.constants'
import {
  CreateCustomFieldDto,
  CustomFieldListMetaDto,
  CustomFieldResponseDto,
  DeletedCustomFieldDto,
  MoveCustomFieldDto,
  UpdateCustomFieldDto,
} from './dto/custom-field.dto'
import {
  alreadyAtEdge,
  fieldNotFound,
  labelTaken,
  noFieldChanges,
  optionsRequired,
  tooManyFields,
} from './custom-fields.errors'
import { toCustomFieldResponse, summarizeFields } from './custom-fields.mapper'
import {
  CustomFieldChanges,
  CustomFieldRecord,
  CustomFieldsRepository,
} from './custom-fields.repository'
import { cleanOptions, labelKeyOf, uniqueKey } from './utils/custom-field.util'

export type CustomFieldListResult = { fields: CustomFieldResponseDto[]; meta: CustomFieldListMetaDto }

/**
 * The questions a school adds to its own forms.
 *
 * The rule that matters: a field's `key` is derived once and then fixed. Every answer ever given is
 * stored under it, so renaming the question changes what people read and nothing else. Everything
 * else here is about keeping the order of the form sane.
 */
@Injectable()
export class CustomFieldsService implements OnModuleInit {
  private readonly logger = new Logger(CustomFieldsService.name)

  constructor(
    private readonly fieldsRepository: CustomFieldsRepository,
    private readonly auditService: AuditService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.fieldsRepository.syncIndexes()
    } catch (error) {
      this.logger.error(`Could not sync custom field indexes: ${error instanceof Error ? error.message : 'unknown error'}`)
    }
  }

  async list(form: CustomFieldForm): Promise<CustomFieldListResult> {
    const records = await this.fieldsRepository.findByForm(form)
    return { fields: records.map(toCustomFieldResponse), meta: summarizeFields(records) }
  }

  /** Only the questions a form should ask, for the form itself rather than the settings page. */
  async listActive(form: CustomFieldForm): Promise<CustomFieldResponseDto[]> {
    const records = await this.fieldsRepository.findByForm(form)
    return records.filter((field) => field.active).map(toCustomFieldResponse)
  }

  async create(dto: CreateCustomFieldDto, actor?: AuthenticatedUserContext): Promise<CustomFieldResponseDto> {
    const form = dto.form
    const existing = await this.fieldsRepository.findByForm(form)
    if (existing.length >= CUSTOM_FIELD_LIMITS.fieldsPerForm) throw tooManyFields()

    const labelKey = labelKeyOf(dto.label)
    if (existing.some((field) => field.labelKey === labelKey)) throw labelTaken(dto.label)

    const options = dto.type === 'select' ? cleanOptions(dto.options ?? []) : []
    if (dto.type === 'select' && options.length < CUSTOM_FIELD_LIMITS.optionsMin) throw optionsRequired()

    try {
      const created = await this.fieldsRepository.create({
        form,
        key: uniqueKey(dto.label, existing.map((field) => field.key)),
        label: dto.label,
        labelKey,
        type: dto.type,
        options,
        // A tick box has no room for grey example text.
        placeholder: dto.type === 'checkbox' ? '' : (dto.placeholder ?? ''),
        helpText: dto.helpText ?? '',
        required: dto.required ?? false,
        active: dto.active ?? true,
        // New questions go last: the order of what a school already asks shouldn't shift.
        position: existing.length,
        createdBy: actor?.id ?? null,
      })

      await this.auditService.record('custom_field.created', {
        actor,
        summary: `${created.label} (${created.type}) added to the ${form} form`,
      })
      return toCustomFieldResponse(created)
    } catch (error) {
      // Two people can pass the checks above at the same moment; the unique index decides.
      if (isDuplicateKeyError(error)) throw labelTaken(dto.label)
      throw error
    }
  }

  async update(
    id: string,
    dto: UpdateCustomFieldDto,
    actor?: AuthenticatedUserContext,
  ): Promise<CustomFieldResponseDto> {
    const field = await this.getFieldOrThrow(id)
    const changes: CustomFieldChanges = {}

    if (dto.label !== undefined && dto.label !== field.label) {
      const labelKey = labelKeyOf(dto.label)
      if (labelKey !== field.labelKey) {
        const siblings = await this.fieldsRepository.findByForm(field.form)
        if (siblings.some((other) => other._id !== id && other.labelKey === labelKey)) throw labelTaken(dto.label)
        changes.labelKey = labelKey
      }
      // The key deliberately stays as it is: past answers are stored under it.
      changes.label = dto.label
    }

    const type = dto.type ?? field.type
    if (dto.type !== undefined && dto.type !== field.type) changes.type = dto.type

    if (dto.options !== undefined || changes.type) {
      const options = type === 'select' ? cleanOptions(dto.options ?? field.options) : []
      if (type === 'select' && options.length < CUSTOM_FIELD_LIMITS.optionsMin) throw optionsRequired()
      changes.options = options
    }

    if (dto.placeholder !== undefined) changes.placeholder = type === 'checkbox' ? '' : dto.placeholder
    if (dto.helpText !== undefined && dto.helpText !== field.helpText) changes.helpText = dto.helpText
    if (dto.required !== undefined && dto.required !== field.required) changes.required = dto.required
    if (dto.active !== undefined && dto.active !== field.active) changes.active = dto.active

    if (Object.keys(changes).length === 0) throw noFieldChanges()
    changes.updatedBy = actor?.id ?? null

    const updated = await this.fieldsRepository.updateById(id, changes)
    if (!updated) throw fieldNotFound(id)

    await this.auditService.record(
      dto.active !== undefined && dto.active !== field.active
        ? dto.active
          ? 'custom_field.shown'
          : 'custom_field.hidden'
        : 'custom_field.updated',
      { actor, summary: this.describeChanges(field, updated) },
    )
    return toCustomFieldResponse(updated)
  }

  /**
   * Removes a question. Hiding is the gentler choice and the page says so: once admissions store
   * answers, a deleted field's past answers have nothing left to explain them.
   */
  async remove(id: string, actor?: AuthenticatedUserContext): Promise<DeletedCustomFieldDto> {
    const field = await this.getFieldOrThrow(id)
    const deleted = await this.fieldsRepository.deleteById(id)
    if (!deleted) throw fieldNotFound(id)

    // Close the gap so positions stay 0..n-1.
    const remaining = await this.fieldsRepository.findByForm(field.form)
    await this.fieldsRepository.applyOrder(remaining.map((item) => item._id))

    await this.auditService.record('custom_field.deleted', {
      actor,
      summary: `${field.label} removed from the ${field.form} form`,
    })
    return { id: deleted._id, label: deleted.label }
  }

  /** Moves one question a single place, which is how the arrows on the page work. */
  async move(id: string, dto: MoveCustomFieldDto, actor?: AuthenticatedUserContext): Promise<CustomFieldListResult> {
    const field = await this.getFieldOrThrow(id)
    const ordered = await this.fieldsRepository.findByForm(field.form)
    const index = ordered.findIndex((item) => item._id === id)
    const target = dto.direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= ordered.length) throw alreadyAtEdge(dto.direction)

    const reordered = [...ordered]
    const [moved] = reordered.splice(index, 1)
    if (moved) reordered.splice(target, 0, moved)

    await this.fieldsRepository.applyOrder(reordered.map((item) => item._id))
    await this.auditService.record('custom_field.reordered', {
      actor,
      summary: `${field.label} moved ${dto.direction} on the ${field.form} form`,
    })
    return this.list(field.form)
  }

  /** Saves a whole order at once, for a page that lets someone rearrange several questions. */
  async reorder(form: CustomFieldForm, ids: string[], actor?: AuthenticatedUserContext): Promise<CustomFieldListResult> {
    const ordered = await this.fieldsRepository.findByForm(form)
    const known = new Set(ordered.map((field) => field._id))
    // Anything the caller left out keeps its place at the end, so a stale page can't drop a field.
    const finalOrder = [...ids.filter((id) => known.has(id)), ...ordered.map((f) => f._id).filter((id) => !ids.includes(id))]

    await this.fieldsRepository.applyOrder(finalOrder)
    await this.auditService.record('custom_field.reordered', {
      actor,
      summary: `Questions on the ${form} form reordered`,
    })
    return this.list(form)
  }

  private async getFieldOrThrow(id: string): Promise<CustomFieldRecord> {
    const field = await this.fieldsRepository.findById(id)
    if (!field) throw fieldNotFound(id)
    return field
  }

  /** A short "what changed" line for the audit trail, rather than a dump of the record. */
  private describeChanges(before: CustomFieldRecord, after: CustomFieldRecord): string {
    const parts: string[] = []
    if (before.label !== after.label) parts.push(`renamed to "${after.label}"`)
    if (before.type !== after.type) parts.push(`changed to ${after.type}`)
    if (before.required !== after.required) parts.push(after.required ? 'made required' : 'made optional')
    if (before.active !== after.active) parts.push(after.active ? 'shown on the form' : 'hidden from the form')
    if (before.options.join('|') !== after.options.join('|')) parts.push('choices changed')
    return parts.length > 0 ? `${before.label}: ${parts.join(', ')}` : before.label
  }
}
