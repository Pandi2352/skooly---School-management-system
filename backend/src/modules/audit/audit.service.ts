import { Injectable, Logger } from '@nestjs/common'
import type { AuthenticatedUserContext } from '../../common/guards/permissions.guard'
import { AUDIT_ACTION_LABELS, AUDIT_RETENTION_DAYS, type AuditAction } from './audit.constants'
import type { AuditListMetaDto } from './dto/audit-list-meta.dto'
import type { AuditPeriod, ListAuditQueryDto } from './dto/list-audit-query.dto'
import { AuditRepository, type AuditEventRecord } from './audit.repository'
import type { AuditEventResponseDto } from './dto/audit-response.dto'

/** Who did it. A sign-in attempt has no signed-in actor, so both parts are optional. */
export type AuditActor = { id: string | null; name: string; ip?: string; userAgent?: string }

export type AuditContext = {
  actor?: AuthenticatedUserContext | AuditActor | null
  /** The account it happened to; for sign-in events that is the actor themselves. */
  targetUserId?: string | null
  targetName?: string
  /** What changed, in a few words: "Teacher to Accountant". */
  summary?: string
  ip?: string
  userAgent?: string
}

function asActor(actor: AuditContext['actor']): AuditActor {
  if (!actor) return { id: null, name: '' }
  if ('permissions' in actor) {
    const context = actor as AuthenticatedUserContext
    return {
      id: context.id,
      name: context.fullName ?? context.email ?? '',
      ip: context.ip,
      userAgent: context.userAgent,
    }
  }
  return actor
}

/**
 * The record of who did what to whom. Recording never interferes with the thing being recorded: a
 * failure here is logged, not thrown, because losing an audit line is better than refusing a
 * password reset that has already happened.
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name)

  constructor(private readonly auditRepository: AuditRepository) {}

  async record(action: AuditAction, context: AuditContext = {}): Promise<void> {
    const actor = asActor(context.actor)
    try {
      await this.auditRepository.create({
        action,
        actorId: actor.id,
        actorName: actor.name,
        targetUserId: context.targetUserId ?? null,
        targetName: context.targetName ?? '',
        summary: context.summary ?? '',
        ip: context.ip ?? actor.ip ?? '',
        userAgent: (context.userAgent ?? actor.userAgent ?? '').slice(0, 300),
      })
    } catch (error) {
      this.logger.error(
        `Couldn't record "${action}": ${error instanceof Error ? error.message : 'unknown error'}`,
      )
    }
  }

  /** The whole trail, newest first, for the Audit Trail page. */
  async list(query: ListAuditQueryDto): Promise<{ events: AuditEventResponseDto[]; meta: AuditListMetaDto }> {
    const { events, total } = await this.auditRepository.findPage(
      {
        action: query.action,
        targetUserId: query.userId,
        search: query.search || undefined,
        since: startOfPeriod(query.period),
      },
      { skip: (query.page - 1) * query.limit, limit: query.limit },
    )
    return {
      events: events.map(toAuditResponse),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: query.limit > 0 ? Math.ceil(total / query.limit) : 0,
        retentionDays: AUDIT_RETENTION_DAYS,
      },
    }
  }

  /** The trail for one account, newest first: what was done to it, and what it did. */
  async listForUser(userId: string, limit = 20): Promise<AuditEventResponseDto[]> {
    const { events } = await this.auditRepository.findPage({ targetUserId: userId }, { skip: 0, limit })
    return events.map(toAuditResponse)
  }
}

const DAYS_IN_PERIOD: Record<Exclude<AuditPeriod, 'all'>, number> = { day: 1, week: 7, month: 30 }

/** The oldest moment a period covers, or undefined for everything that is still kept. */
function startOfPeriod(period: AuditPeriod): Date | undefined {
  if (period === 'all') return undefined
  return new Date(Date.now() - DAYS_IN_PERIOD[period] * 24 * 60 * 60 * 1000)
}

export function toAuditResponse(event: AuditEventRecord): AuditEventResponseDto {
  return {
    id: event._id,
    action: event.action,
    label: AUDIT_ACTION_LABELS[event.action] ?? event.action,
    actorName: event.actorName,
    targetName: event.targetName,
    summary: event.summary,
    ip: event.ip,
    at: new Date(event.createdAt).toISOString(),
  }
}
