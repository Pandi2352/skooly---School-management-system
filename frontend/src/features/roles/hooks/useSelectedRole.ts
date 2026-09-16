import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

/** The role being edited lives in the URL (?role=teacher), so a reload or shared link opens it. */
export function useSelectedRole() {
  const [params, setParams] = useSearchParams()

  const setRoleId = useCallback(
    (id: string | null) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          if (id === null) next.delete('role')
          else next.set('role', id)
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  return { roleId: params.get('role'), setRoleId }
}
