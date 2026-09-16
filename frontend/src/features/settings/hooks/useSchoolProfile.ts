import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSchoolProfile } from '../api/getSchoolProfile'
import { settingsKeys } from '../api/settingsKeys'
import { updateSchoolProfile } from '../api/updateSchoolProfile'

export function useSchoolProfile() {
  return useQuery({ queryKey: settingsKeys.schoolProfile(), queryFn: getSchoolProfile })
}

export function useUpdateSchoolProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSchoolProfile,
    onSuccess: (saved) => {
      queryClient.setQueryData(settingsKeys.schoolProfile(), saved)
    },
  })
}
