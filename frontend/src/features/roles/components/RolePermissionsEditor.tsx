import { ArrowsInSimpleIcon, ArrowsOutSimpleIcon, CheckIcon, XIcon } from '@phosphor-icons/react'
import { useId, useState } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/SearchInput'
import type { Role } from '../types/role.types'
import { permissionCatalog } from '../utils/permissionCatalog'
import { catalogFeatureIds, countGranted, filterCatalog, setFeatures } from '../utils/permissions'
import { PermissionModuleSection } from './PermissionModuleSection'
import { RoleHeader } from './RoleHeader'

type RolePermissionsEditorProps = {
  role: Role
  /** The permissions as currently edited (saved ones plus unsaved changes). */
  permissions: string[]
  isDirty: boolean
  saving: boolean
  onChange: (permissions: string[]) => void
  onSave: () => void
  onDiscard: () => void
  onEditDetails: () => void
  onDeleted: () => void
}

const allFeatureIds = catalogFeatureIds(permissionCatalog)

export function RolePermissionsEditor({
  role,
  permissions,
  isDirty,
  saving,
  onChange,
  onSave,
  onDiscard,
  onEditDetails,
  onDeleted,
}: RolePermissionsEditorProps) {
  const headingId = useId()
  const locked = role.fullAccess
  const [query, setQuery] = useState('')
  // Modules with something granted start open, so the role's current access is visible at once.
  const [openModules, setOpenModules] = useState<string[]>(() => {
    const granted = permissionCatalog
      .filter((module) => countGranted(role.permissions, module.features.map((feature) => feature.id)) > 0)
      .map((module) => module.slug)
    return granted.length > 0 ? granted : permissionCatalog.slice(0, 1).map((module) => module.slug)
  })

  const searching = query.trim() !== ''
  const visible = filterCatalog(permissionCatalog, query)
  const totalPermissions = allFeatureIds.length * 4
  const grantedPermissions = locked ? totalPermissions : countGranted(permissions, allFeatureIds)
  const allOpen = openModules.length === permissionCatalog.length

  const toggleModule = (slug: string) =>
    setOpenModules((current) => (current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]))

  return (
    <section aria-labelledby={headingId} className="@container min-w-0 rounded-md border border-line bg-surface">
      <RoleHeader role={role} headingId={headingId} onEditDetails={onEditDetails} onDeleted={onDeleted} />

      <div className="grid gap-3 p-4 @xl:p-5">
        {locked && (
          <Alert title="This role always has every permission">
            Administrator keeps full access to every page, including pages added later, so these boxes
            can’t be changed.
          </Alert>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="w-full @xl:w-72">
            <SearchInput label="Search pages" placeholder="Search pages or modules…" value={query} onValueChange={setQuery} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={searching}
              onClick={() => setOpenModules(allOpen ? [] : permissionCatalog.map((module) => module.slug))}
            >
              {allOpen ? (
                <ArrowsInSimpleIcon className="size-4" aria-hidden="true" />
              ) : (
                <ArrowsOutSimpleIcon className="size-4" aria-hidden="true" />
              )}
              {allOpen ? 'Collapse all' : 'Expand all'}
            </Button>
            {!locked && (
              <>
                <Button variant="secondary" size="sm" disabled={grantedPermissions === totalPermissions} onClick={() => onChange(setFeatures(permissions, allFeatureIds, true))}>
                  <CheckIcon className="size-4" weight="bold" aria-hidden="true" />
                  Allow all
                </Button>
                <Button variant="secondary" size="sm" disabled={grantedPermissions === 0} onClick={() => onChange([])}>
                  <XIcon className="size-4" weight="bold" aria-hidden="true" />
                  Clear all
                </Button>
              </>
            )}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-muted">No page or module matches “{query.trim()}”.</p>
        ) : (
          <div className="grid gap-2">
            {visible.map((module) => (
              <PermissionModuleSection
                key={module.slug}
                module={module}
                permissions={permissions}
                locked={locked}
                // While searching, every match is shown open.
                open={searching || openModules.includes(module.slug)}
                onToggleOpen={() => toggleModule(module.slug)}
                onChange={onChange}
              />
            ))}
          </div>
        )}
      </div>

      {/* Stays in view while scrolling a long list of modules. */}
      <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-b-md border-t border-line bg-surface px-4 py-3 @xl:px-5">
        <p className="text-sm text-ink-muted" aria-live="polite">
          <span className="font-semibold text-ink tabular-nums">{grantedPermissions}</span> of {totalPermissions} permissions
          {isDirty && <span className="ms-2 font-semibold text-status-ink">· Unsaved changes</span>}
        </p>
        {!locked && (
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" disabled={!isDirty || saving} onClick={onDiscard}>
              Discard
            </Button>
            <Button loading={saving} disabled={!isDirty} onClick={onSave}>
              Save permissions
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
