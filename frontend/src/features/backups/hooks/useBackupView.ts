import { useSearchParams } from 'react-router-dom'
import type { BackupView } from '../types/backup.types'

/** Table or card layout, kept in the URL (?view=grid) so it survives reloads and shared links. */
export function useBackupView() {
  const [params, setParams] = useSearchParams()
  const view: BackupView = params.get('view') === 'grid' ? 'grid' : 'list'

  const setView = (next: BackupView) => {
    setParams(
      (previous) => {
        const nextParams = new URLSearchParams(previous)
        if (next === 'list') nextParams.delete('view')
        else nextParams.set('view', next)
        return nextParams
      },
      { replace: true },
    )
  }

  return { view, setView }
}
