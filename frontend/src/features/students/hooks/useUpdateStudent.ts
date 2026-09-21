import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateStudent } from '../api/updateStudent'
import { studentKeys } from '../api/studentKeys'
import type { StudentDetail } from '../types/student.types'

export function useUpdateStudent(studentId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: Partial<StudentDetail>) => updateStudent(studentId, updates),
    onSuccess: (updated) => {
      queryClient.setQueryData(studentKeys.detail(studentId), updated)
      void queryClient.invalidateQueries({ queryKey: studentKeys.lists() })
    },
  })
}
