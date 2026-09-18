import type { EntityType, ExportDatasetType } from '../schemas/dataTransfer.schema'

export const dataTransferKeys = {
  all: ['data-transfer'] as const,
  templates: () => [...dataTransferKeys.all, 'templates'] as const,
  template: (entityType: EntityType) => [...dataTransferKeys.templates(), entityType] as const,
  exports: () => [...dataTransferKeys.all, 'exports'] as const,
  exportData: (datasetType: ExportDatasetType, params?: Record<string, string>) => [
    ...dataTransferKeys.exports(),
    datasetType,
    params,
  ] as const,
}
