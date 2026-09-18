import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Public } from '../../common/decorators/public.decorator'
import type { EntityType, ExportDatasetType } from './constants/data-transfer.constants'
import { DataTransferService } from './data-transfer.service'
import {
  CommitImportDto,
  CommitImportResponseDto,
  ExportQueryDto,
  ImportPreviewResponseDto,
  PreviewImportDto,
  TemplateResponseDto,
} from './dto/data-transfer.dto'

@ApiTags('Data Transfer')
@Controller('data-transfer')
export class DataTransferController {
  constructor(private readonly dataTransferService: DataTransferService) {}

  @Public()
  @Get('templates/:entityType')
  @ApiOperation({ summary: 'Get sample template schema and column specifications' })
  getTemplate(@Param('entityType') entityType: EntityType): TemplateResponseDto {
    return this.dataTransferService.getTemplate(entityType)
  }

  @Public()
  @Post('import/preview')
  @ApiOperation({ summary: 'Dry-run validate candidate import rows and return error report' })
  async previewImport(@Body() dto: PreviewImportDto): Promise<ImportPreviewResponseDto> {
    return this.dataTransferService.previewImport(dto)
  }

  @Public()
  @Post('import/commit')
  @ApiOperation({ summary: 'Commit validated records into the system database' })
  async commitImport(@Body() dto: CommitImportDto): Promise<CommitImportResponseDto> {
    return this.dataTransferService.commitImport(dto)
  }

  @Public()
  @Get('export/:datasetType')
  @ApiOperation({ summary: 'Fetch structured dataset ready for client Excel / CSV export' })
  async getExportData(
    @Param('datasetType') datasetType: ExportDatasetType,
    @Query() query: ExportQueryDto,
  ): Promise<{ filename: string; headers: string[]; rows: string[][] }> {
    return this.dataTransferService.getExportData(datasetType, query)
  }
}
