import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { Model } from 'mongoose'
import { generateUuid } from '../../common/utils/uuid.util'
import type { CustomFieldForm, CustomFieldType } from './constants/custom-field.constants'
import { CustomField, CustomFieldDocument } from './schemas/custom-field.schema'

/** A field as stored, read with lean() (plain object, no Mongoose document methods). */
export type CustomFieldRecord = {
  _id: string
  form: CustomFieldForm
  key: string
  label: string
  labelKey: string
  type: CustomFieldType
  options: string[]
  placeholder: string
  helpText: string
  required: boolean
  active: boolean
  position: number
  createdBy: string | null
  updatedBy: string | null
  createdAt: Date
  updatedAt: Date
}

export type NewCustomFieldData = Omit<CustomFieldRecord, '_id' | 'createdAt' | 'updatedAt' | 'updatedBy'>

export type CustomFieldChanges = Partial<
  Pick<
    CustomFieldRecord,
    'label' | 'labelKey' | 'type' | 'options' | 'placeholder' | 'helpText' | 'required' | 'active' | 'position' | 'updatedBy'
  >
>

/** All database access for custom fields. No rules here; those live in CustomFieldsService. */
@Injectable()
export class CustomFieldsRepository {
  constructor(@InjectModel(CustomField.name) private readonly fieldModel: Model<CustomFieldDocument>) {}

  /** Every field on a form, in the order it is asked. */
  findByForm(form: CustomFieldForm): Promise<CustomFieldRecord[]> {
    return this.fieldModel.find({ form }).sort({ position: 1 }).lean<CustomFieldRecord[]>().exec()
  }

  findById(id: string): Promise<CustomFieldRecord | null> {
    return this.fieldModel.findById(id).lean<CustomFieldRecord>().exec()
  }

  countByForm(form: CustomFieldForm): Promise<number> {
    return this.fieldModel.countDocuments({ form }).exec()
  }

  async create(data: NewCustomFieldData): Promise<CustomFieldRecord> {
    const created = await this.fieldModel.create({ _id: generateUuid(), ...data, updatedBy: null })
    return created.toObject<CustomFieldRecord>()
  }

  updateById(id: string, changes: CustomFieldChanges): Promise<CustomFieldRecord | null> {
    return this.fieldModel
      .findByIdAndUpdate(id, { $set: changes }, { new: true, runValidators: true })
      .lean<CustomFieldRecord>()
      .exec()
  }

  deleteById(id: string): Promise<CustomFieldRecord | null> {
    return this.fieldModel.findByIdAndDelete(id).lean<CustomFieldRecord>().exec()
  }

  /**
   * Writes the given order in one round trip. Positions are rewritten from 0 every time rather than
   * nudged, so a gap left by a deleted field can't drift the order over time.
   */
  async applyOrder(ids: string[]): Promise<void> {
    if (ids.length === 0) return
    await this.fieldModel.bulkWrite(
      ids.map((id, index) => ({ updateOne: { filter: { _id: id }, update: { $set: { position: index } } } })),
      { ordered: false },
    )
  }

  /** Brings indexes in line with the schema, dropping ones older versions created. */
  async syncIndexes(): Promise<void> {
    await this.fieldModel.syncIndexes()
  }
}
