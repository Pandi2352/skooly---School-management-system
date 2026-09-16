import { CheckCircleIcon } from '@phosphor-icons/react'
import { DEMO_CREDENTIALS } from '../constants'
import type { ErpRole } from '../types/auth.types'

type RoleQuickSwitchProps = {
  selectedRole: ErpRole
  onSelectRole: (role: ErpRole, email: string) => void
}

export function RoleQuickSwitch({ selectedRole, onSelectRole }: RoleQuickSwitchProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-ink">Select Staff Persona</span>
        <span className="text-[11px] text-ink-muted">Quick 1-click test fill</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {DEMO_CREDENTIALS.map((cred) => {
          const isSelected = selectedRole === cred.role
          return (
            <button
              key={cred.role}
              type="button"
              onClick={() => onSelectRole(cred.role, cred.email)}
              className={`group relative flex flex-col items-start rounded-md border p-2 text-left transition-all ${
                isSelected
                  ? 'border-accent bg-accent/10 ring-1 ring-accent'
                  : 'border-line bg-surface/80 hover:border-ink-muted/40 hover:bg-surface'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span
                  className={`flex size-6 items-center justify-center rounded-md text-[11px] font-bold ${
                    isSelected ? 'bg-accent text-side' : 'bg-canvas text-ink-muted'
                  }`}
                >
                  {cred.avatar}
                </span>
                {isSelected && (
                  <CheckCircleIcon
                    weight="fill"
                    className="size-3.5 text-accent"
                    aria-hidden="true"
                  />
                )}
              </div>
              <span
                className={`mt-1.5 text-xs leading-tight font-semibold ${
                  isSelected ? 'text-ink' : 'text-ink-muted group-hover:text-ink'
                }`}
              >
                {cred.label}
              </span>
              <span className="mt-0.5 max-w-full truncate text-[10px] leading-none text-ink-muted/80">
                {cred.subtitle}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
