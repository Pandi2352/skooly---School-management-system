import {
  BooksIcon,
  BusIcon,
  CalculatorIcon,
  ChalkboardTeacherIcon,
  IdentificationCardIcon,
  ShieldCheckIcon,
  UserGearIcon,
  type IconWeight,
} from '@phosphor-icons/react'

type RoleIconProps = {
  roleId: string
  className?: string
  weight?: IconWeight
}

export function RoleIcon({ roleId, className, weight = 'regular' }: RoleIconProps) {
  switch (roleId) {
    case 'administrator':
      return <ShieldCheckIcon className={className} weight={weight} aria-hidden="true" />
    case 'teacher':
      return <ChalkboardTeacherIcon className={className} weight={weight} aria-hidden="true" />
    case 'accountant':
      return <CalculatorIcon className={className} weight={weight} aria-hidden="true" />
    case 'receptionist':
      return <IdentificationCardIcon className={className} weight={weight} aria-hidden="true" />
    case 'librarian':
      return <BooksIcon className={className} weight={weight} aria-hidden="true" />
    case 'transport-manager':
      return <BusIcon className={className} weight={weight} aria-hidden="true" />
    default:
      return <UserGearIcon className={className} weight={weight} aria-hidden="true" />
  }
}
