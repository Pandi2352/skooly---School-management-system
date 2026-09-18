import { api } from '@/lib/api/client'
import {
  commitImportResponseSchema,
  exportDataResponseSchema,
  importPreviewResponseSchema,
  templateResponseSchema,
  type CommitImportResponse,
  type EntityType,
  type ExportDataResponse,
  type ExportDatasetType,
  type ImportPreviewResponse,
  type TemplateResponse,
} from '../schemas/dataTransfer.schema'
import {
  getSampleExportData,
  getSampleTemplate,
  sampleCommitImport,
  samplePreviewImport,
} from './sample/sampleDataTransfer'

const isTestMode = import.meta.env.MODE === 'test'

export type ExportFilters = {
  grade?: string
  status?: string
}

export async function fetchImportTemplate(entityType: EntityType): Promise<TemplateResponse> {
  if (isTestMode) {
    return templateResponseSchema.parse(getSampleTemplate(entityType))
  }
  return api.get(`/data-transfer/templates/${entityType}`, templateResponseSchema)
}

export async function previewImportRecords(
  entityType: EntityType,
  records: Record<string, unknown>[],
): Promise<ImportPreviewResponse> {
  if (isTestMode) {
    return importPreviewResponseSchema.parse(samplePreviewImport(entityType, records))
  }
  return api.post('/data-transfer/import/preview', importPreviewResponseSchema, {
    entityType,
    records,
  })
}

export async function commitImportRecords(
  entityType: EntityType,
  records: Record<string, unknown>[],
): Promise<CommitImportResponse> {
  if (isTestMode) {
    return commitImportResponseSchema.parse(sampleCommitImport(entityType, records))
  }
  return api.post('/data-transfer/import/commit', commitImportResponseSchema, {
    entityType,
    records,
  })
}

export async function fetchExportDataset(
  datasetType: ExportDatasetType,
  filters?: ExportFilters,
): Promise<ExportDataResponse> {
  if (isTestMode) {
    return exportDataResponseSchema.parse(getSampleExportData(datasetType))
  }

  const searchParams = new URLSearchParams()
  if (filters?.grade) {
    searchParams.set('grade', filters.grade)
  }
  if (filters?.status) {
    searchParams.set('status', filters.status)
  }

  const query = searchParams.toString()
  const path = query
    ? `/data-transfer/export/${datasetType}?${query}`
    : `/data-transfer/export/${datasetType}`

  return api.get(path, exportDataResponseSchema)
}
