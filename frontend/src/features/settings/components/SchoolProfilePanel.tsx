import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { useSchoolProfile } from '../hooks/useSchoolProfile'
import { SchoolProfileForm } from './SchoolProfileForm'

export function SchoolProfilePanel() {
  const profile = useSchoolProfile()

  if (profile.isPending) return <LoadingState label="Loading school profile" />
  if (profile.isError) {
    return (
      <ErrorState
        title="Couldn’t load the school profile"
        description={getErrorMessage(profile.error)}
        onRetry={() => void profile.refetch()}
      />
    )
  }
  return <SchoolProfileForm profile={profile.data} />
}
