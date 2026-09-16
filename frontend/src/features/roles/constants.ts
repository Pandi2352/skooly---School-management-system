/** What a permission allows on one page. Create, Edit and Delete each include View. */
export const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete'] as const

export const PERMISSION_ACTION_LABELS: Record<(typeof PERMISSION_ACTIONS)[number], string> = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  delete: 'Delete',
}

/** System roles come with the app: permissions can change, but they can't be renamed or deleted. */
export const ROLE_KINDS = ['system', 'custom'] as const
