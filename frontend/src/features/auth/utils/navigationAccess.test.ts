import { describe, expect, it } from 'vitest'
import type { Module } from '@/config/navigation'
import { SAMPLE_SESSION } from '../api/sample/sampleSession'
import type { SignedInUser } from '../types/auth.types'
import { filterNavSections, type NavSectionGroup } from './navigationAccess'

const studentModule: Module = {
  label: 'Student Information',
  shortLabel: 'Students',
  slug: 'student-information',
  section: 'Modules',
  features: [
    { label: 'Student List', shortLabel: 'Student List', slug: 'student-list', capabilities: [] },
    { label: 'Health Records', shortLabel: 'Health', slug: 'health-records', capabilities: [] },
  ],
}

const singlePageModule: Module = {
  label: 'Backup Management',
  shortLabel: 'Backup Management',
  slug: 'backup-management',
  section: 'System',
  features: [],
}

const sections: NavSectionGroup[] = [
  { label: 'Modules', modules: [studentModule] },
  { label: 'System', modules: [singlePageModule] },
]

const sessionWith = (permissions: string[]): SignedInUser => ({
  ...SAMPLE_SESSION,
  fullAccess: false,
  permissions,
})

describe('filterNavSections', () => {
  it('shows nothing to a visitor who is not signed in', () => {
    expect(filterNavSections(sections, undefined)).toEqual([])
  })

  it('shows everything to a full-access role', () => {
    expect(filterNavSections(sections, SAMPLE_SESSION)).toEqual(sections)
  })

  it('keeps only the pages the role can view', () => {
    const result = filterNavSections(sections, sessionWith(['student-information.student-list:view']))

    expect(result).toHaveLength(1)
    expect(result[0]?.modules[0]?.features.map((feature) => feature.slug)).toEqual(['student-list'])
  })

  it('drops a module whose pages are all closed', () => {
    const result = filterNavSections(sections, sessionWith(['backup-management:view']))

    expect(result.map((section) => section.label)).toEqual(['System'])
    expect(result[0]?.modules[0]?.slug).toBe('backup-management')
  })

  it('needs the view action, not create or edit, to list a page', () => {
    expect(filterNavSections(sections, sessionWith(['student-information.student-list:edit']))).toEqual([])
  })
})
