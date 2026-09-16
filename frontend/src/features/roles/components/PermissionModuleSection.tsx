import { CaretDownIcon, SquaresFourIcon } from '@phosphor-icons/react'
import { useId } from 'react'
import { Checkbox } from '@/components/ui/Checkbox'
import { moduleIcons } from '@/config/moduleIcons'
import { cn } from '@/lib/cn'
import { PERMISSION_ACTION_LABELS, PERMISSION_ACTIONS } from '../constants'
import type { PermissionModule } from '../types/role.types'
import {
  countGranted,
  permissionKey,
  selectionState,
  setFeatures,
  setPermission,
  toCheckedState,
} from '../utils/permissions'

type PermissionModuleSectionProps = {
  module: PermissionModule
  permissions: string[]
  /** Full-access roles show everything ticked and can't change it. */
  locked: boolean
  open: boolean
  onToggleOpen: () => void
  onChange: (permissions: string[]) => void
}

export function PermissionModuleSection({
  module,
  permissions,
  locked,
  open,
  onToggleOpen,
  onChange,
}: PermissionModuleSectionProps) {
  const panelId = useId()
  const featureIds = module.features.map((feature) => feature.id)
  const total = featureIds.length * PERMISSION_ACTIONS.length
  const granted = locked ? total : countGranted(permissions, featureIds)
  const state = locked ? 'all' : selectionState(permissions, featureIds)
  const ModuleIcon = moduleIcons[module.slug] ?? SquaresFourIcon

  return (
    <section className="rounded-md border border-line bg-surface">
      <div className="flex items-center gap-3 ps-3 pe-2">
        <Checkbox
          label={`Allow everything in ${module.label}`}
          hideLabel
          checked={toCheckedState(state)}
          disabled={locked}
          onCheckedChange={() => onChange(setFeatures(permissions, featureIds, state !== 'all'))}
        />
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggleOpen}
          className="flex min-h-12 min-w-0 flex-1 cursor-pointer items-center gap-2.5 text-start"
        >
          <ModuleIcon className="size-5 flex-none text-primary" weight="fill" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate font-semibold text-ink">{module.label}</span>
          <span className={cn('text-sm tabular-nums', granted > 0 ? 'text-ink' : 'text-ink-muted')}>
            {granted}/{total}
          </span>
          <CaretDownIcon
            className={cn('size-4 flex-none text-ink-muted transition-transform motion-reduce:transition-none', open && 'rotate-180')}
            aria-hidden="true"
          />
        </button>
      </div>

      {open && (
        // Wide permission grids scroll inside the section on narrow screens.
        <div id={panelId} className="overflow-x-auto border-t border-line">
          <table className="w-full min-w-[32rem] border-collapse text-sm">
            <caption className="sr-only">{module.label} permissions</caption>
            <thead className="bg-table-head">
              <tr>
                <th scope="col" className="px-3 py-2 text-start text-xs font-bold tracking-wide text-primary uppercase">
                  Page
                </th>
                {PERMISSION_ACTIONS.map((action) => (
                  <th key={action} scope="col" className="w-20 px-2 py-2 text-center text-xs font-bold tracking-wide text-primary uppercase">
                    {PERMISSION_ACTION_LABELS[action]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {module.features.map((feature) => (
                <tr key={feature.id} className="border-t border-line hover:bg-primary/5">
                  <th scope="row" className="px-3 py-1 text-start font-normal text-ink">
                    {feature.label}
                  </th>
                  {PERMISSION_ACTIONS.map((action) => (
                    <td key={action} className="px-2 py-0.5 text-center">
                      <div className="inline-flex">
                        <Checkbox
                          label={`${PERMISSION_ACTION_LABELS[action]}: ${feature.label}`}
                          hideLabel
                          disabled={locked}
                          checked={locked || permissions.includes(permissionKey(feature.id, action))}
                          onCheckedChange={(checked) => onChange(setPermission(permissions, feature.id, action, checked === true))}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
