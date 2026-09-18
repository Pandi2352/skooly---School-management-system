import type { Feature, Module, NavSection } from '@/config/navigation'
import type { SignedInUser } from '../types/auth.types'
import { canViewPage } from './permissions'

export type NavSectionGroup = { label: NavSection; modules: Module[] }

/**
 * Hides menu entries a role can't open. Permission keys come from the menu itself
 * ("<module>.<page>:view"), so a page added to the menu is covered without anything else changing.
 *
 * A module with sub-pages is listed when at least one of its pages is allowed, and it then lists
 * only those pages: a menu that opens onto nothing but locked pages is worse than no menu entry.
 */
export function filterNavSections(
  sections: NavSectionGroup[],
  session: SignedInUser | undefined,
): NavSectionGroup[] {
  if (!session) return []
  if (session.fullAccess) return sections

  return sections
    .map((section) => ({ label: section.label, modules: section.modules.flatMap((module) => visibleModule(module, session)) }))
    .filter((section) => section.modules.length > 0)
}

function visibleModule(module: Module, session: SignedInUser): Module[] {
  // A module with no sub-pages is one page, so its own key decides.
  if (module.features.length === 0) {
    return canViewPage(session, module.slug, null) ? [module] : []
  }

  const features = module.features.filter((feature) => isFeatureVisible(module, feature, session))
  return features.length > 0 ? [{ ...module, features }] : []
}

function isFeatureVisible(module: Module, feature: Feature, session: SignedInUser): boolean {
  // A feature listed under two modules is granted where it really lives.
  const moduleSlug = feature.alias?.module ?? module.slug
  const featureSlug = feature.alias?.feature ?? feature.slug
  return canViewPage(session, moduleSlug, featureSlug)
}
