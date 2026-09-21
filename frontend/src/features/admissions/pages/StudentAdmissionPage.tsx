import { useCallback, useRef } from 'react'
import { PageContainer } from '@/components/page/PageContainer'
import { AdmissionForm } from '../components/AdmissionForm'
import { AdmissionPageActions } from '../components/AdmissionPageActions'

export function StudentAdmissionPage() {
  const fillPresetRef = useRef<((preset: 1 | 2) => void) | null>(null)

  const handleRegisterFill = useCallback((fn: (preset: 1 | 2) => void) => {
    fillPresetRef.current = fn
  }, [])

  return (
    <PageContainer
      title="Student Admission"
      actions={
        <AdmissionPageActions
          onFillMock={(preset) => fillPresetRef.current?.(preset)}
        />
      }
      fullWidth
    >
      <AdmissionForm onRegisterFill={handleRegisterFill} />
    </PageContainer>
  )
}
