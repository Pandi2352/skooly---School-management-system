import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { templateKeys } from '../api/templateKeys'
import { getTemplate, getTemplates, saveTemplate } from '../api/templates'

export function useTemplates() {
  return useQuery({ queryKey: templateKeys.list(), queryFn: getTemplates })
}

/** Loads one design; does nothing while `id` is null (a blank design). */
export function useTemplate(id: string | null) {
  return useQuery({
    queryKey: templateKeys.detail(id ?? ''),
    queryFn: () => getTemplate(id ?? ''),
    enabled: id !== null,
  })
}

export function useSaveTemplate() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveTemplate,
    onSuccess: (saved) => {
      queryClient.setQueryData(templateKeys.detail(saved.id), saved)
      return queryClient.invalidateQueries({ queryKey: templateKeys.list() })
    },
  })
}
