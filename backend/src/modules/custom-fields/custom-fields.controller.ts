import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ApiErrors, ApiSuccess } from '../../common/decorators/api-envelope.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'
import { RequirePermissions } from '../../common/decorators/permissions.decorator'
import { ResponseMessage } from '../../common/decorators/response-message.decorator'
import type { AuthenticatedUserContext } from '../../common/guards/permissions.guard'
import { UuidParamPipe } from '../../common/pipes/uuid-param.pipe'
import { ResponseWithMeta } from '../../common/utils/response-with-meta.util'
import { CUSTOM_FIELD_PERMISSIONS } from './constants/custom-field.constants'
import {
  CreateCustomFieldDto,
  CustomFieldListMetaDto,
  CustomFieldResponseDto,
  DeletedCustomFieldDto,
  ListCustomFieldsQueryDto,
  MoveCustomFieldDto,
  ReorderCustomFieldsDto,
  UpdateCustomFieldDto,
} from './dto/custom-field.dto'
import { CustomFieldsService } from './custom-fields.service'

const FIELD_ID_PARAM = {
  name: 'id',
  format: 'uuid',
  description: 'Custom field id (UUID v4)',
  example: '6f1d2c3b-4a5e-4f60-9b7a-8c9d0e1f2a3b',
}

/** HTTP only: validation, status codes and messages. Every rule is in CustomFieldsService. */
@ApiTags('Custom Fields')
@Controller('custom-fields')
export class CustomFieldsController {
  constructor(private readonly fieldsService: CustomFieldsService) {}

  @Get()
  @RequirePermissions(CUSTOM_FIELD_PERMISSIONS.view)
  @ResponseMessage('Custom fields fetched successfully.')
  @ApiOperation({
    summary: 'List a form’s questions',
    description: 'In the order the form asks them, hidden ones included, with counts in meta.',
  })
  @ApiSuccess(CustomFieldResponseDto, {
    description: 'Questions in form order',
    isArray: true,
    meta: CustomFieldListMetaDto,
  })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN)
  async list(@Query() query: ListCustomFieldsQueryDto): Promise<ResponseWithMeta<CustomFieldResponseDto[]>> {
    const { fields, meta } = await this.fieldsService.list(query.form)
    return new ResponseWithMeta(fields, { ...meta })
  }

  @Get('active')
  @ResponseMessage('Custom fields fetched successfully.')
  @ApiOperation({
    summary: 'The questions a form should ask',
    description:
      'Hidden questions left out, for the admission form itself. Anyone filling the form needs these, so it asks for no settings permission.',
  })
  @ApiSuccess(CustomFieldResponseDto, { description: 'Questions to ask, in order', isArray: true })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED)
  listActive(@Query() query: ListCustomFieldsQueryDto): Promise<CustomFieldResponseDto[]> {
    return this.fieldsService.listActive(query.form)
  }

  @Post()
  @RequirePermissions(CUSTOM_FIELD_PERMISSIONS.create)
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Question added successfully.')
  @ApiOperation({
    summary: 'Add a question',
    description: 'It goes last on the form. The name answers are saved under is derived from the label and then fixed.',
  })
  @ApiSuccess(CustomFieldResponseDto, { status: HttpStatus.CREATED, description: 'The new question' })
  @ApiErrors(
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.CONFLICT,
    HttpStatus.UNPROCESSABLE_ENTITY,
  )
  create(
    @Body() dto: CreateCustomFieldDto,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<CustomFieldResponseDto> {
    return this.fieldsService.create(dto, actor)
  }

  @Patch(':id')
  @RequirePermissions(CUSTOM_FIELD_PERMISSIONS.edit)
  @ResponseMessage('Question updated successfully.')
  @ApiOperation({
    summary: 'Edit a question',
    description: 'Renaming changes what people read only: past answers stay under the original name.',
  })
  @ApiParam(FIELD_ID_PARAM)
  @ApiSuccess(CustomFieldResponseDto, { description: 'The updated question' })
  @ApiErrors(
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.CONFLICT,
  )
  update(
    @Param('id', UuidParamPipe) id: string,
    @Body() dto: UpdateCustomFieldDto,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<CustomFieldResponseDto> {
    return this.fieldsService.update(id, dto, actor)
  }

  @Put(':id/move')
  @RequirePermissions(CUSTOM_FIELD_PERMISSIONS.edit)
  @ResponseMessage('Question moved successfully.')
  @ApiOperation({ summary: 'Move a question one place', description: 'Returns the whole form in its new order.' })
  @ApiParam(FIELD_ID_PARAM)
  @ApiSuccess(CustomFieldResponseDto, { description: 'The form in its new order', isArray: true, meta: CustomFieldListMetaDto })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND)
  async move(
    @Param('id', UuidParamPipe) id: string,
    @Body() dto: MoveCustomFieldDto,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<ResponseWithMeta<CustomFieldResponseDto[]>> {
    const { fields, meta } = await this.fieldsService.move(id, dto, actor)
    return new ResponseWithMeta(fields, { ...meta })
  }

  @Put('order')
  @RequirePermissions(CUSTOM_FIELD_PERMISSIONS.edit)
  @ResponseMessage('Question order saved successfully.')
  @ApiOperation({
    summary: 'Save a whole order',
    description: 'Ids not sent keep their place at the end, so a stale page can’t drop a question.',
  })
  @ApiSuccess(CustomFieldResponseDto, { description: 'The form in its new order', isArray: true, meta: CustomFieldListMetaDto })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN)
  async reorder(
    @Query() query: ListCustomFieldsQueryDto,
    @Body() dto: ReorderCustomFieldsDto,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<ResponseWithMeta<CustomFieldResponseDto[]>> {
    const { fields, meta } = await this.fieldsService.reorder(query.form, dto.ids, actor)
    return new ResponseWithMeta(fields, { ...meta })
  }

  @Delete(':id')
  @RequirePermissions(CUSTOM_FIELD_PERMISSIONS.delete)
  @ResponseMessage('Question removed successfully.')
  @ApiOperation({
    summary: 'Remove a question',
    description: 'Hiding it is usually better: a removed question leaves past answers with nothing to explain them.',
  })
  @ApiParam(FIELD_ID_PARAM)
  @ApiSuccess(DeletedCustomFieldDto, { description: 'The removed question’s id and label' })
  @ApiErrors(HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_FOUND)
  remove(
    @Param('id', UuidParamPipe) id: string,
    @CurrentUser() actor?: AuthenticatedUserContext,
  ): Promise<DeletedCustomFieldDto> {
    return this.fieldsService.remove(id, actor)
  }
}
