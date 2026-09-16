import { describe, expect, it } from 'vitest'
import { moduleIcons } from './moduleIcons'
import { findFeature, findModule, modules } from './navigation'

// Static routes that a module slug must never shadow.
const RESERVED_SLUGS = ['dashboard', 'students', 'settings', 'login']

describe('navigation', () => {
  it('has unique module slugs that avoid reserved routes', () => {
    const slugs = modules.map((m) => m.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(slugs.filter((slug) => RESERVED_SLUGS.includes(slug))).toEqual([])
  })

  it('has unique page slugs within each module', () => {
    for (const module of modules) {
      const slugs = module.features.map((f) => f.slug)
      expect(new Set(slugs).size, module.label).toBe(slugs.length)
    }
  })

  it('points every duplicate entry at a page that exists', () => {
    for (const module of modules) {
      for (const feature of module.features) {
        if (!feature.alias) continue
        const target = findModule(feature.alias.module)
        expect(target && findFeature(target, feature.alias.feature), feature.label).toBeTruthy()
      }
    }
  })

  it('gives every module an icon', () => {
    expect(modules.filter((m) => !(m.slug in moduleIcons)).map((m) => m.label)).toEqual([])
  })
})
