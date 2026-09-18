import { useMemo } from 'react'
import { navSections } from '@/config/navigation'
import { filterNavSections } from '../utils/navigationAccess'
import { useSession } from './useSession'

/** The menu as this person may see it: pages their role can't open are left out. */
export function useVisibleNavSections() {
  const session = useSession()
  return useMemo(() => filterNavSections(navSections, session.data), [session.data])
}
