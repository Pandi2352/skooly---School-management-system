import { modules } from '@/config/navigation'
import { buildPermissionCatalog } from './permissions'

/** Every page in the app menu, grouped by module; built once. */
export const permissionCatalog = buildPermissionCatalog(modules)
