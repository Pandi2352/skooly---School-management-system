import { describe, expect, it } from 'vitest'
import type { Module } from '@/config/navigation'
import type { Role } from '../types/role.types'
import {
  buildPermissionCatalog,
  countGranted,
  filterCatalog,
  isRoleNameTaken,
  permissionKey,
  samePermissions,
  selectionState,
  resolvePermissionDependencies,
  setFeatures,
  setPermission,
  summarizeRole,
} from './permissions'


const feature = (label: string, extra: object = {}) => ({
  label,
  shortLabel: label,
  slug: label.toLowerCase().replace(/\s+/g, '-'),
  capabilities: [],
  ...extra,
})

const modules: Module[] = [
  { label: 'Fees', shortLabel: 'Fees', slug: 'fees', section: 'Modules', features: [feature('Fee Collection'), feature('Expenses')] },
  {
    label: 'Admin',
    shortLabel: 'Admin',
    slug: 'admin',
    section: 'Modules',
    features: [feature('Roles', { route: '/settings/roles' }), feature('Driver App', { alias: { module: 'x', feature: 'y' } })],
  },
  { label: 'Settings', shortLabel: 'Settings', slug: 'settings', section: 'System', features: [feature('Roles Again', { route: '/settings/roles' })] },
  { label: 'Backups', shortLabel: 'Backups', slug: 'backups', section: 'System', features: [] },
]

describe('buildPermissionCatalog', () => {
  it('lists each page once and treats single-page modules as one row', () => {
    const catalog = buildPermissionCatalog(modules)
    expect(catalog.map((module) => [module.slug, module.features.map((item) => item.id)])).toEqual([
      ['fees', ['fees.fee-collection', 'fees.expenses']],
      ['admin', ['admin.roles']],
      ['backups', ['backups']],
    ])
  })
})

describe('permission changes', () => {
  it('adds View with any other action and removes everything with View', () => {
    const withEdit = setPermission([], 'fees.expenses', 'edit', true)
    expect(new Set(withEdit)).toEqual(new Set(['fees.expenses:edit', 'fees.expenses:view']))
    expect(setPermission(withEdit, 'fees.expenses', 'view', false)).toEqual([])
    expect(setPermission(withEdit, 'fees.expenses', 'edit', false)).toEqual(['fees.expenses:view'])
  })

  it('resolves missing view dependencies for create/edit/delete actions', () => {
    const isolatedActions = ['fees.expenses:edit', 'fees.expenses:delete', 'students.list:create']
    const resolved = resolvePermissionDependencies(isolatedActions)
    expect(resolved).toContain('fees.expenses:view')
    expect(resolved).toContain('students.list:view')
    expect(resolved).toContain('fees.expenses:edit')
  })

  it('grants whole groups and reports tri-state selection', () => {

    const ids = ['fees.fee-collection', 'fees.expenses']
    expect(selectionState([], ids)).toBe('none')
    expect(selectionState([permissionKey('fees.expenses', 'view')], ids)).toBe('some')
    const all = setFeatures([], ids, true)
    expect(countGranted(all, ids)).toBe(8)
    expect(selectionState(all, ids)).toBe('all')
    expect(setFeatures(all, ids, false)).toEqual([])
  })
})

describe('role helpers', () => {
  const catalog = buildPermissionCatalog(modules)
  const role: Role = {
    id: 'r1',
    name: 'Accountant',
    description: '',
    kind: 'system',
    fullAccess: false,
    permissions: ['fees.expenses:view', 'removed.page:view'],
  }

  it('summarizes granted permissions, ignoring unknown pages', () => {
    expect(summarizeRole(role, catalog)).toEqual({ granted: 1, total: 16, modules: 1 })
    expect(summarizeRole({ ...role, fullAccess: true }, catalog)).toEqual({ granted: 16, total: 16, modules: 3 })
  })

  it('filters by module or page name', () => {
    expect(filterCatalog(catalog, 'expen').map((module) => module.features.length)).toEqual([1])
    expect(filterCatalog(catalog, 'fees')[0]?.features).toHaveLength(2)
  })

  it('compares permission sets and checks names', () => {
    expect(samePermissions(['a', 'b'], ['b', 'a'])).toBe(true)
    expect(samePermissions(['a'], ['a', 'b'])).toBe(false)
    expect(isRoleNameTaken([role], ' accountant ')).toBe(true)
    expect(isRoleNameTaken([role], 'Accountant', 'r1')).toBe(false)
  })
})
