import {
  BookBookmarkIcon,
  BookOpenIcon,
  BuildingsIcon,
  BusIcon,
  ClockIcon,
  DotsNineIcon,
  GearSixIcon,
  GraduationCapIcon,
  ReceiptIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react'
import { DropdownMenu } from 'radix-ui'
import { useNavigate } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Tooltip } from '@/components/ui/Tooltip'

const APP_MODULES = [
  { label: 'Students', icon: GraduationCapIcon, route: paths.students, color: 'text-primary' },
  {
    label: 'Academics',
    icon: BookOpenIcon,
    route: '/academic-management',
    color: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    label: 'Fees',
    icon: ReceiptIcon,
    route: '/fees-finance',
    color: 'text-amber-600 dark:text-amber-400',
  },
  {
    label: 'Attendance',
    icon: ClockIcon,
    route: '/students/student-attendance',
    color: 'text-sky-600 dark:text-sky-400',
  },
  {
    label: 'Staff & HR',
    icon: UsersThreeIcon,
    route: '/hr-staff-management',
    color: 'text-violet-600 dark:text-violet-400',
  },
  {
    label: 'Front Office',
    icon: BuildingsIcon,
    route: '/core-setup-administration/front-office-management',
    color: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    label: 'Library',
    icon: BookBookmarkIcon,
    route: '/library-learning',
    color: 'text-teal-600 dark:text-teal-400',
  },
  {
    label: 'Transport',
    icon: BusIcon,
    route: '/transport-management',
    color: 'text-orange-600 dark:text-orange-400',
  },
  {
    label: 'Settings',
    icon: GearSixIcon,
    route: paths.settingsGeneral,
    color: 'text-slate-600 dark:text-slate-300',
  },
] as const

export function AppLauncherMenu() {
  const navigate = useNavigate()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary pointer-coarse:min-h-11 pointer-coarse:min-w-11"
          aria-label="App Launcher"
        >
          <Tooltip content="All modules">
            <span className="flex items-center justify-center">
              <DotsNineIcon className="size-5.5 text-ink-muted" weight="bold" aria-hidden="true" />
            </span>
          </Tooltip>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-50 w-72 rounded-md border border-line bg-surface p-3 text-ink shadow-lg"
        >
          <div className="mb-2 px-1 text-xs font-semibold tracking-wider text-ink-muted uppercase">
            Modules & Tools
          </div>
          <div className="grid grid-cols-3 gap-2">
            {APP_MODULES.map((item) => {
              const ItemIcon = item.icon
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    void navigate(item.route)
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 rounded-md p-2 text-center transition-colors hover:bg-canvas focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span
                    className={`flex size-9 items-center justify-center rounded-lg bg-canvas ${item.color}`}
                  >
                    <ItemIcon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-[11px] leading-tight font-medium text-ink">
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
