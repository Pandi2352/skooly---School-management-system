import { LockSimpleIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import type { Role } from '../types/role.types'
import { permissionCatalog } from '../utils/permissionCatalog'
import { summarizeRole } from '../utils/permissions'
import { getRoleIcon } from '../utils/roleIcons'

type RoleListProps = {
  roles: Role[]
  selectedId: string
  onSelect: (id: string) => void
}

export function RoleList({ roles, selectedId, onSelect }: RoleListProps) {
  return (
    <nav aria-label="Roles">
      {/* Visual Role Emblem Header Card */}
      <div className="mb-3 flex items-center gap-3 rounded-md border border-line/70 bg-surface p-2.5">
        <img
          src="/school-role-emblem.jpg"
          alt="School Role Hierarchy Emblem"
          className="size-11 flex-none rounded-md object-cover ring-1 ring-line/50"
        />
        <div className="min-w-0">
          <span className="block text-xs font-bold text-ink">Institutional Roles</span>
          <span className="block truncate text-[11px] text-ink-muted">
            Access matrices & modules
          </span>
        </div>
      </div>

      <ul className="grid gap-2">
        {roles.map((role) => {
          const summary = summarizeRole(role, permissionCatalog)
          const current = role.id === selectedId
          const share = summary.total === 0 ? 0 : Math.round((summary.granted / summary.total) * 100)
          const RoleIcon = getRoleIcon(role)

          return (
            <li key={role.id}>
              <button
                type="button"
                aria-current={current ? 'true' : undefined}
                onClick={() => onSelect(role.id)}
                className={cn(
                  'group flex w-full cursor-pointer items-start gap-3 rounded-md border p-3 text-start transition-colors motion-reduce:transition-none',
                  current
                    ? 'border-primary bg-primary/[0.04]'
                    : 'border-line/70 bg-surface hover:border-primary/40 hover:bg-primary/[0.02]',
                )}
              >
                {/* Role Icon */}
                <span
                  className={cn(
                    'mt-0.5 flex size-8.5 flex-none items-center justify-center rounded-md transition-colors',
                    current
                      ? 'bg-primary text-surface'
                      : 'bg-canvas text-ink-muted group-hover:bg-primary/10 group-hover:text-primary',
                  )}
                >
                  <RoleIcon
                    className="size-4.5"
                    weight={current ? 'bold' : 'regular'}
                    aria-hidden="true"
                  />
                </span>

                <div className="grid min-w-0 flex-1 gap-1.5">
                  <span className="flex items-center justify-between gap-2">
                    <span className="min-w-0 truncate font-semibold text-ink">{role.name}</span>
                    {role.kind === 'system' ? (
                      <Badge tone="info" className="gap-1">
                        <LockSimpleIcon className="size-3" weight="fill" aria-hidden="true" />
                        System
                      </Badge>
                    ) : (
                      <Badge>Custom</Badge>
                    )}
                  </span>
                  <span className="text-xs text-ink-muted">
                    {role.fullAccess
                      ? 'Full access to everything'
                      : `${String(summary.granted)} permissions · ${String(summary.modules)} ${summary.modules === 1 ? 'module' : 'modules'}`}
                  </span>
                  {/* Decorative progress indicator */}
                  <span aria-hidden="true" className="h-1 overflow-hidden rounded-full bg-line/70">
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${String(share)}%` }}
                    />
                  </span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

