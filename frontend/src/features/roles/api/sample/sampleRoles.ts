import type { NewRoleInput, PermissionAction, Role } from '../../types/role.types'
import { permissionCatalog } from '../../utils/permissionCatalog'
import { isRoleNameTaken, permissionKey } from '../../utils/permissions'

// SAMPLE DATA: starting roles until the roles API exists (antislop R-38). The permission sets are
// reasonable defaults for each job, not a real school's setup. Changes only update this in-memory
// list, which resets on reload; success messages say so.

const grant = (moduleSlugs: string[], actions: PermissionAction[]) =>
  permissionCatalog
    .filter((module) => moduleSlugs.includes(module.slug))
    .flatMap((module) =>
      module.features.flatMap((feature) => actions.map((action) => permissionKey(feature.id, action))),
    )

let roles: Role[] = [
  {
    id: 'administrator',
    name: 'Administrator',
    description: 'Runs the school system, including settings, billing and backups.',
    kind: 'system',
    fullAccess: true,
    permissions: [],
  },
  {
    id: 'teacher',
    name: 'Teacher',
    description: 'Teaches classes: exams, homework, timetables and lesson plans.',
    kind: 'system',
    fullAccess: false,
    permissions: [
      ...grant(['academic-management'], ['view', 'create', 'edit']),
      ...grant(['student-information', 'library-and-learning', 'communication'], ['view']),
    ],
  },
  {
    id: 'accountant',
    name: 'Accountant',
    description: 'Collects fees, records expenses and runs payroll.',
    kind: 'system',
    fullAccess: false,
    permissions: [
      ...grant(['fees-and-finance'], ['view', 'create', 'edit']),
      ...grant(['student-information'], ['view']),
    ],
  },
  {
    id: 'receptionist',
    name: 'Receptionist',
    description: 'Handles enquiries, admissions and visitors at the front office.',
    kind: 'system',
    fullAccess: false,
    permissions: [
      ...grant(['core-setup-and-administration', 'student-information'], ['view', 'create']),
      ...grant(['communication'], ['view']),
    ],
  },
  {
    id: 'librarian',
    name: 'Librarian',
    description: 'Manages books, issues and returns, and the digital library.',
    kind: 'system',
    fullAccess: false,
    permissions: [
      ...grant(['library-and-learning'], ['view', 'create', 'edit', 'delete']),
      ...grant(['student-information'], ['view']),
    ],
  },
  {
    id: 'transport-manager',
    name: 'Transport Manager',
    description: 'Looks after bus routes, stops, drivers and transport fees.',
    kind: 'custom',
    fullAccess: false,
    permissions: [
      ...grant(['transport-management'], ['view', 'create', 'edit', 'delete']),
      ...grant(['student-information'], ['view']),
    ],
  },
]

const findRole = (id: string) => {
  const role = roles.find((item) => item.id === id)
  if (!role) throw new Error('This role doesn’t exist any more. Reload the page.')
  return role
}

export const readSampleRoles = () => roles

export function createSampleRole(input: NewRoleInput, now: Date): Role {
  if (isRoleNameTaken(roles, input.name)) throw new Error(`A role named “${input.name}” already exists.`)
  const source = input.copyFromRoleId === null ? undefined : roles.find((item) => item.id === input.copyFromRoleId)
  const role: Role = {
    id: `role-${String(now.getTime())}`,
    name: input.name,
    description: input.description,
    kind: 'custom',
    fullAccess: false,
    // Copying from Administrator gives every current page, since full access itself can't be copied.
    permissions: source?.fullAccess ? grant(permissionCatalog.map((module) => module.slug), ['view', 'create', 'edit', 'delete']) : [...(source?.permissions ?? [])],
  }
  roles = [...roles, role]
  return role
}

export function updateSampleRoleDetails(id: string, details: { name: string; description: string }): Role {
  const role = findRole(id)
  if (role.kind === 'system' && details.name !== role.name) throw new Error('System roles can’t be renamed.')
  if (isRoleNameTaken(roles, details.name, id)) throw new Error(`A role named “${details.name}” already exists.`)
  const updated = { ...role, ...details }
  roles = roles.map((item) => (item.id === id ? updated : item))
  return updated
}

export function updateSampleRolePermissions(id: string, permissions: string[]): Role {
  const role = findRole(id)
  if (role.fullAccess) throw new Error('Administrator always has every permission.')
  const updated = { ...role, permissions }
  roles = roles.map((item) => (item.id === id ? updated : item))
  return updated
}

export function deleteSampleRole(id: string) {
  if (findRole(id).kind === 'system') throw new Error('System roles can’t be deleted.')
  roles = roles.filter((item) => item.id !== id)
}
