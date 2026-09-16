import { classOptionsSchema } from '../schemas/student.schema'
import type { ClassOption } from '../types/student.types'
import { sampleClasses } from './sample/sampleClasses'

/**
 * Classes and their sections, for the list filters.
 * TODO(api): return `api.get('/classes', classOptionsSchema)` and delete ./sample/sampleClasses.ts.
 */
export async function getClassOptions(): Promise<ClassOption[]> {
  await Promise.resolve()
  return classOptionsSchema.parse(sampleClasses)
}
