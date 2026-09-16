import { describe, expect, it } from 'vitest'
import { readSampleTemplates } from '../api/sample/sampleTemplates'
import { templateListSchema } from '../schemas/template.schema'
import { resolveFieldText } from './fieldText'
import { validateImageFile } from './imageFile'
import { buildLayout } from './layoutPresets'
import { countTemplatesByCategory, filterTemplates } from './templateFilters'
import { clampZoom, fitZoom } from './templateDraft'

describe('resolveFieldText', () => {
  it('shows field names while designing and sample values in preview', () => {
    const text = 'Name: {{studentName}} ({{unknownField}})'
    expect(resolveFieldText(text, 'design')).toBe('Name: [Student Name] ({{unknownField}})')
    expect(resolveFieldText(text, 'preview')).toBe('Name: Sample Student ({{unknownField}})')
  })
})

describe('template filters', () => {
  const templates = readSampleTemplates()

  it('keeps the starter templates valid', () => {
    expect(templateListSchema.safeParse(templates).success).toBe(true)
  })

  it('filters by category and by search text', () => {
    expect(
      filterTemplates(templates, { search: '', category: 'certificate' }).every(
        (template) => template.category === 'certificate',
      ),
    ).toBe(true)
    expect(filterTemplates(templates, { search: 'bonafide', category: 'all' })).toHaveLength(1)
    expect(
      filterTemplates(templates, { search: 'nothing like this', category: 'all' }),
    ).toHaveLength(0)
  })

  it('counts templates per category', () => {
    const counts = countTemplatesByCategory(templates)
    expect(Object.values(counts).reduce((sum, count) => sum + count, 0)).toBe(templates.length)
  })
})

describe('designer helpers', () => {
  it('checks image type and size', () => {
    expect(validateImageFile({ type: 'image/png', size: 1000 }, 2000)).toBeNull()
    expect(validateImageFile({ type: 'application/pdf', size: 1000 }, 2000)).toMatch(/PNG/)
    expect(
      validateImageFile({ type: 'image/png', size: 3 * 1024 * 1024 }, 2 * 1024 * 1024),
    ).toMatch(/smaller than 2 MB/)
  })

  it('builds layouts that stay inside the card', () => {
    const card = { widthMm: 54, heightMm: 85.6 }
    for (const preset of ['photo-top', 'photo-left', 'coloured-header'] as const) {
      for (const element of buildLayout(preset, card, 'staff')) {
        expect(element.x + element.width).toBeLessThanOrEqual(card.widthMm + 0.1)
        expect(element.y).toBeLessThan(card.heightMm)
      }
    }
  })

  it('fits and clamps the zoom', () => {
    expect(clampZoom(100)).toBe(8)
    expect(fitZoom({ widthMm: 54, heightMm: 85.6 }, { width: 400, height: 400 })).toBeCloseTo(
      1.11,
      1,
    )
  })
})
