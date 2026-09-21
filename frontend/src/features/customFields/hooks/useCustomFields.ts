import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { customFieldKeys } from '../api/customFieldKeys'
import {
  createCustomField,
  deleteCustomField,
  getActiveCustomFields,
  getCustomFields,
  moveCustomField,
  updateCustomField,
} from '../api/customFields'

/** The settings view: every question, hidden ones included, with counts. */
export function useCustomFields() {
  return useQuery({ queryKey: customFieldKeys.list(), queryFn: getCustomFields })
}

/**
 * What the admission form asks. A separate endpoint from the settings list, because filling in an
 * admission shouldn't require permission to edit the form.
 */
export function useActiveCustomFields() {
  return useQuery({ queryKey: customFieldKeys.active(), queryFn: getActiveCustomFields })
}

/** Any change can alter what the form asks, so both views are refreshed. */
function useRefreshCustomFields() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: customFieldKeys.all })
}

export function useCreateCustomField() {
  const refresh = useRefreshCustomFields()
  return useMutation({ mutationFn: createCustomField, onSuccess: refresh })
}

export function useUpdateCustomField() {
  const refresh = useRefreshCustomFields()
  return useMutation({ mutationFn: updateCustomField, onSuccess: refresh })
}

export function useDeleteCustomField() {
  const refresh = useRefreshCustomFields()
  return useMutation({ mutationFn: deleteCustomField, onSuccess: refresh })
}

export function useMoveCustomField() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: moveCustomField,
    // The server answers with the whole form in its new order, so the list needs no second trip.
    onSuccess: (result) => {
      queryClient.setQueryData(customFieldKeys.list(), result)
      void queryClient.invalidateQueries({ queryKey: customFieldKeys.active() })
    },
  })
}
