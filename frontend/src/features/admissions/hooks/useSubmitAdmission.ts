import { useMutation, useQueryClient } from '@tanstack/react-query'
import { admissionKeys } from '../api/admissionKeys'
import { submitAdmission } from '../api/admissions'

export function useSubmitAdmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submitAdmission,
    // The next admission and roll numbers change once a student is admitted.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: admissionKeys.all }),
  })
}
