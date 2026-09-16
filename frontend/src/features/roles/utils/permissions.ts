import type { Module } from '@/config/navigation'
import { PERMISSION_ACTIONS } from '../constants'
import type {
  PermissionAction,
  PermissionFeature,
  PermissionModule,
  Role,
  SelectionState,
} from '../types/role.types'

/**
 * Permissions follow the app's own menu: one row per page, grouped by module. A module with no
 * sub-pages is one row. Aliases, and a second menu entry for a page already listed, are skipped
 * so each page appears once.
 */
export function buildPermissionCatalog(modules: Module[]): PermissionModule[] {
  const seenRoutes = new Set<string>()
  return modules
    .map((module) => {
      const features: PermissionFeature[] =
        module.features.length === 0
          ? [{ id: module.slug, label: module.label }]
          : module.features
              .filter((feature) => {
                if (feature.alias) return false
                if (feature.route === undefined) return true
                if (seenRoutes.has(feature.route)) return false
                seenRoutes.add(feature.route)
                return true
              })
              .map((feature) => ({ id: `${module.slug}.${feature.slug}`, label: feature.label }))
      return { slug: module.slug, label: module.label, features }
    })
    .filter((module) => module.features.length > 0)
}

export const permissionKey = (featureId: string, action: PermissionAction) => `${featureId}:${action}`

/** Turning on Create, Edit or Delete also turns on View; turning off View turns off the rest. */
export function setPermission(
  permissions: string[],
  featureId: string,
  action: PermissionAction,
  granted: boolean,
) {
  const next = new Set(permissions)
  if (granted) {
    next.add(permissionKey(featureId, action))
    next.add(permissionKey(featureId, 'view'))
  } else if (action === 'view') {
    for (const each of PERMISSION_ACTIONS) next.delete(permissionKey(featureId, each))
  } else {
    next.delete(permissionKey(featureId, action))
  }
  return [...next]
}

/** Ensures that any feature with create, edit, or delete actions also has its view permission granted. */
export function resolvePermissionDependencies(permissions: string[]): string[] {
  const result = new Set(permissions)
  for (const perm of permissions) {
    const lastColon = perm.lastIndexOf(':')
    if (lastColon === -1) continue
    const featureId = perm.slice(0, lastColon)
    const action = perm.slice(lastColon + 1)
    if (action === 'create' || action === 'edit' || action === 'delete') {
      result.add(permissionKey(featureId, 'view'))
    }
  }
  return [...result]
}


/** Grants or removes every action on the given pages. */
export function setFeatures(permissions: string[], featureIds: string[], granted: boolean) {
  const next = new Set(permissions)
  for (const featureId of featureIds) {
    for (const action of PERMISSION_ACTIONS) {
      if (granted) next.add(permissionKey(featureId, action))
      else next.delete(permissionKey(featureId, action))
    }
  }
  return [...next]
}

export function countGranted(permissions: string[], featureIds: string[]) {
  const granted = new Set(permissions)
  return featureIds.reduce(
    (total, featureId) =>
      total + PERMISSION_ACTIONS.filter((action) => granted.has(permissionKey(featureId, action))).length,
    0,
  )
}

export function selectionState(permissions: string[], featureIds: string[]): SelectionState {
  const granted = countGranted(permissions, featureIds)
  if (granted === 0) return 'none'
  return granted === featureIds.length * PERMISSION_ACTIONS.length ? 'all' : 'some'
}

export const toCheckedState = (state: SelectionState) =>
  state === 'all' ? true : state === 'some' ? 'indeterminate' : false

/** Modules whose name or pages match the search; a module name match keeps all its pages. */
export function filterCatalog(catalog: PermissionModule[], query: string) {
  const text = query.trim().toLowerCase()
  if (text === '') return catalog
  return catalog
    .map((module) =>
      module.label.toLowerCase().includes(text)
        ? module
        : { ...module, features: module.features.filter((feature) => feature.label.toLowerCase().includes(text)) },
    )
    .filter((module) => module.features.length > 0)
}

export const catalogFeatureIds = (catalog: PermissionModule[]) =>
  catalog.flatMap((module) => module.features.map((feature) => feature.id))

/** Granted permissions and the number of modules they touch, ignoring keys for removed pages. */
export function summarizeRole(role: Role, catalog: PermissionModule[]) {
  const total = catalogFeatureIds(catalog).length * PERMISSION_ACTIONS.length
  if (role.fullAccess) return { granted: total, total, modules: catalog.length }
  const modules = catalog.filter(
    (module) => countGranted(role.permissions, module.features.map((feature) => feature.id)) > 0,
  ).length
  return { granted: countGranted(role.permissions, catalogFeatureIds(catalog)), total, modules }
}

export function samePermissions(a: string[], b: string[]) {
  const first = new Set(a)
  const second = new Set(b)
  return first.size === second.size && [...first].every((key) => second.has(key))
}

export const isRoleNameTaken = (roles: Role[], name: string, exceptRoleId?: string) =>
  roles.some(
    (role) => role.id !== exceptRoleId && role.name.trim().toLowerCase() === name.trim().toLowerCase(),
  )
