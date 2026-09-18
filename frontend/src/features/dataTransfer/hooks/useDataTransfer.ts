import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  commitImportRecords,
  fetchExportDataset,
  fetchImportTemplate,
  previewImportRecords,
  type ExportFilters,
} from '../api/dataTransfer'
import { dataTransferKeys } from '../api/dataTransferKeys'
import type {
  CommitImportResponse,
  EntityType,
  ExportDataResponse,
  ExportDatasetType,
  ImportPreviewResponse,
  TemplateResponse,
} from '../schemas/dataTransfer.schema'

export function useImportTemplate(entityType: EntityType) {
  return useQuery<TemplateResponse>({
    queryKey: dataTransferKeys.template(entityType),
    queryFn: () => fetchImportTemplate(entityType),
    staleTime: 5 * 60 * 1000,
  })
}

export function usePreviewImport() {
  return useMutation<
    ImportPreviewResponse,
    Error,
    { entityType: EntityType; records: Record<string, unknown>[] }
  >({
    mutationFn: ({ entityType, records }) => previewImportRecords(entityType, records),
  })
}

export function useCommitImport() {
  const queryClient = useQueryClient()

  return useMutation<
    CommitImportResponse,
    Error,
    { entityType: EntityType; records: Record<string, unknown>[] }
  >({
    mutationFn: ({ entityType, records }) => commitImportRecords(entityType, records),
    onSuccess: () => {
      // Invalidate relevant student or user lists so new data is displayed immediately
      void queryClient.invalidateQueries({ queryKey: ['students'] })
      void queryClient.invalidateQueries({ queryKey: ['users'] })
      void queryClient.invalidateQueries({ queryKey: dataTransferKeys.exports() })
    },
  })
}

export function useExportDataset() {
  return useMutation<
    ExportDataResponse,
    Error,
    { datasetType: ExportDatasetType; filters?: ExportFilters }
  >({
    mutationFn: ({ datasetType, filters }) => fetchExportDataset(datasetType, filters),
  })
}
