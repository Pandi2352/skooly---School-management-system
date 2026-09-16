import {
  BooksIcon,
  BusIcon,
  CalculatorIcon,
  ChalkboardTeacherIcon,
  IdentificationCardIcon,
  ShieldCheckIcon,
  UserGearIcon,
  type Icon,
} from '@phosphor-icons/react'
import type { Role } from '../types/role.types'

/**
 * Pure mapping of role to an identifying Phosphor icon.
 * Gives each role card an intuitive visual signature.
 */
export function getRoleIcon(role: Pick<Role, 'id'>): Icon {
  switch (role.id) {
    case 'administrator':
      return ShieldCheckIcon
    case 'teacher':
      return ChalkboardTeacherIcon
    case 'accountant':
      return CalculatorIcon
    case 'receptionist':
      return IdentificationCardIcon
    case 'librarian':
      return BooksIcon
    case 'transport-manager':
      return BusIcon
    default:
      return UserGearIcon
  }
}
