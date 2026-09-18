import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAttendanceSettings } from '../api/getAttendanceSettings'
import { settingsKeys } from '../api/settingsKeys'
import { updateAttendanceSettings } from '../api/updateAttendanceSettings'

export function useAttendanceSettings() {
  return useQuery({ queryKey: settingsKeys.attendanceSettings(), queryFn: getAttendanceSettings })
}

export function useUpdateAttendanceSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateAttendanceSettings,
    onSuccess: (saved) => {
      queryClient.setQueryData(settingsKeys.attendanceSettings(), saved)
    },
  })
}
