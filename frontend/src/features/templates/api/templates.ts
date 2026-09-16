import { templateDraftSchema, templateListSchema, templateSchema } from '../schemas/template.schema'
import type { Template, TemplateDraft } from '../types/template.types'
import { readSampleTemplates, saveSampleTemplate } from './sample/sampleTemplates'

/** TODO(api): `api.get('/templates', templateListSchema)`. */
export async function getTemplates(): Promise<Template[]> {
  await Promise.resolve()
  return templateListSchema.parse(readSampleTemplates())
}

/** TODO(api): `api.get(`/templates/${id}`, templateSchema)`. */
export async function getTemplate(id: string): Promise<Template> {
  await Promise.resolve()
  const template = readSampleTemplates().find((item) => item.id === id)
  if (!template) throw new Error('This design doesn’t exist. It may have been removed.')
  return templateSchema.parse(template)
}

/** TODO(api): POST a new design, or PUT when `id` is a saved custom design. */
export async function saveTemplate({
  id,
  draft,
}: {
  id: string | null
  draft: TemplateDraft
}): Promise<Template> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return templateSchema.parse(saveSampleTemplate(id, templateDraftSchema.parse(draft), new Date()))
}
