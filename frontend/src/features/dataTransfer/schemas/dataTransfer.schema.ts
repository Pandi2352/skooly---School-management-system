import { z } from 'zod'

export const entityTypeSchema = z.enum(['students', 'parents', 'staff'])

export const exportDatasetTypeSchema = z.enum(['students', 'fees', 'staff', 'audit'])

export const templateColumnSchema = z.object({
  key: z.string(),
  label: z.string(),
  required: z.boolean(),
  description: z.string(),
  example: z.string(),
})

export const templateResponseSchema = z.object({
  entityType: entityTypeSchema,
  columns: z.array(templateColumnSchema),
  sampleRows: z.array(z.record(z.string(), z.unknown())),
})

export const importRowErrorSchema = z.object({
  rowNumber: z.number(),
  field: z.string().optional(),
  message: z.string(),
})

export const importPreviewResponseSchema = z.object({
  totalCount: z.number(),
  validCount: z.number(),
  invalidCount: z.number(),
  errors: z.array(importRowErrorSchema),
  previewItems: z.array(z.record(z.string(), z.unknown())),
})

export const commitImportResponseSchema = z.object({
  success: z.boolean(),
  insertedCount: z.number(),
  failedCount: z.number(),
  errors: z.array(importRowErrorSchema),
  message: z.string(),
})

export const exportDataResponseSchema = z.object({
  filename: z.string(),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
})

export type EntityType = z.infer<typeof entityTypeSchema>
export type ExportDatasetType = z.infer<typeof exportDatasetTypeSchema>
export type TemplateColumn = z.infer<typeof templateColumnSchema>
export type TemplateResponse = z.infer<typeof templateResponseSchema>
export type ImportRowError = z.infer<typeof importRowErrorSchema>
export type ImportPreviewResponse = z.infer<typeof importPreviewResponseSchema>
export type CommitImportResponse = z.infer<typeof commitImportResponseSchema>
export type ExportDataResponse = z.infer<typeof exportDataResponseSchema>
