import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { formatSequenceNumber, useSystemSettings } from '@/features/settings'
import { admissionKeys } from '../api/admissionKeys'
import { getNextNumbers } from '../api/admissions'

/**
 * The next admission and roll numbers for the Auto buttons: counters from the admissions API,
 * formatted the way School Settings → System & Formats says. Null while unknown.
 */
export function useAdmissionNumbers(grade: number | null, section: string) {
  const [today] = useState(() => new Date())
  const settings = useSystemSettings()
  const counters = useQuery({
    queryKey: admissionKeys.nextNumbers(grade, section),
    queryFn: () => getNextNumbers({ grade, section }),
  })

  const formats = settings.data
  const next = counters.data
  return {
    admissionNo:
      formats && next
        ? formatSequenceNumber({ ...formats.admission, nextNumber: next.admissionCounter }, today)
        : null,
    rollNo:
      formats && next && next.rollCounter !== null
        ? formatSequenceNumber({ ...formats.roll, nextNumber: next.rollCounter }, today)
        : null,
  }
}
