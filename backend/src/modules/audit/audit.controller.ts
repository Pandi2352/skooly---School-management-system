import { Controller, Get, HttpStatus, Query } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiErrors, ApiSuccess } from '../../common/decorators/api-envelope.decorator'
import { RequirePermissions } from '../../common/decorators/permissions.decorator'
import { ResponseMessage } from '../../common/decorators/response-message.decorator'
import { ResponseWithMeta } from '../../common/utils/response-with-meta.util'
import { AUDIT_PERMISSIONS } from './audit.constants'
import { AuditService } from './audit.service'
import { AuditListMetaDto } from './dto/audit-list-meta.dto'
import { AuditEventResponseDto } from './dto/audit-response.dto'
import { ListAuditQueryDto } from './dto/list-audit-query.dto'

/**
 * Reading the trail only. Nothing here writes or changes an event: an audit trail that can be
 * edited answers nothing, so events are written by the modules that cause them and never by a
 * request from outside.
 */
@ApiTags('Audit Trail')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermissions(AUDIT_PERMISSIONS.view)
  @ResponseMessage('Audit trail fetched successfully.')
  @ApiOperation({
    summary: 'List recorded events',
    description: 'Sign-ins, lockouts and account changes, newest first. Filter by kind, account, period or text.',
  })
  @ApiSuccess(AuditEventResponseDto, {
    description: 'Matching events, with paging and the retention period in meta',
    isArray: true,
    meta: AuditListMetaDto,
  })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN)
  async list(@Query() query: ListAuditQueryDto): Promise<ResponseWithMeta<AuditEventResponseDto[]>> {
    const { events, meta } = await this.auditService.list(query)
    return new ResponseWithMeta(events, { ...meta })
  }
}
