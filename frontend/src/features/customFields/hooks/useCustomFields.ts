import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { customFieldKeys } from '../api/customFieldKeys'
import {
  createCustomField,
  deleteCustomField,
  getCustomFields,
  moveCustomField,
  updateCustomField,
} from '../api/customFields'

export function useCustomFields() {
  return useQuery({ queryKey: customFieldKeys.list(), queryFn: getCustomFields })
}

function useInvalidateOnSuccess() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: customFieldKeys.list() })
}

export function useCreateCustomField() {
  const invalidate = useInvalidateOnSuccess()
  return useMutation({ mutationFn: createCustomField, onSuccess: invalidate })
}

export function useUpdateCustomField() {
  const invalidate = useInvalidateOnSuccess()
  return useMutation({ mutationFn: updateCustomField, onSuccess: invalidate })
}

export function useDeleteCustomField() {
  const invalidate = useInvalidateOnSuccess()
  return useMutation({ mutationFn: deleteCustomField, onSuccess: invalidate })
}

export function useMoveCustomField() {
  const invalidate = useInvalidateOnSuccess()
  return useMutation({ mutationFn: moveCustomField, onSuccess: invalidate })
}
