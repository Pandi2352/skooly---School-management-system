import { PageContainer } from '@/components/page/PageContainer'
import { AdmissionForm } from '../components/AdmissionForm'
import { AdmissionPageActions } from '../components/AdmissionPageActions'

export function StudentAdmissionPage() {
  return (
    <PageContainer title="Student Admission" actions={<AdmissionPageActions />} fullWidth>
      <AdmissionForm />
    </PageContainer>
  )
}
