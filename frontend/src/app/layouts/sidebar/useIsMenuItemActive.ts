import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { featurePath, modules } from '@/config/navigation'
import { paths } from '@/app/paths'

/** Every address the menu can take someone to, so the closest match can be picked. */
const MENU_ROUTES: string[] = modules.flatMap((module) =>
  module.features.length === 0
    ? [paths.module(module.slug)]
    : module.features.map((feature) => featurePath(module, feature)),
)

/**
 * Which menu row counts as current. Marking every row whose path is a prefix of the address lights
 * up Student List when someone is on Student Admission, because "/students/new" starts with
 * "/students". The longest matching route wins instead, so exactly one row is current.
 *
 * A page listed under two menus is current in both, which is correct: it really is both places.
 */
export function useIsMenuItemActive() {
  const { pathname } = useLocation()

  return useCallback(
    (to: string) => {
      const best = [...MENU_ROUTES, to]
        .filter((route) => pathname === route || pathname.startsWith(`${route}/`))
        .sort((left, right) => right.length - left.length)[0]
      return best === to
    },
    [pathname],
  )
}
