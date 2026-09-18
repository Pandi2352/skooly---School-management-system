import { KeyIcon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { LoadingState } from '@/components/page/LoadingState'
import { PageContainer } from '@/components/page/PageContainer'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { describeLastSignIn } from '@/features/users/utils/userRules'
import { SessionList } from '../components/SessionList'
import { useOwnSessions, useRevokeOtherSessions, useRevokeOwnSession, useSession } from '../hooks/useSession'

/** The signed-in person's own account: their details, their password and where they are signed in. */
export function AccountPage() {
  const session = useSession()
  const sessions = useOwnSessions()
  const revokeOne = useRevokeOwnSession()
  const revokeOthers = useRevokeOtherSessions()
  const { toast } = useToast()

  if (session.isPending) return <LoadingState label="Loading your account" />
  if (!session.data) return null

  const { user, fullAccess } = session.data
  const otherSessionCount = (sessions.data ?? []).filter((item) => !item.isCurrent).length

  const details: { label: string; value: string }[] = [
    { label: 'Name', value: user.fullName },
    { label: 'Email', value: user.email },
    { label: 'Phone', value: user.phone || 'Not set' },
    { label: 'Designation', value: user.designation || 'Not set' },
    { label: 'Role', value: user.role?.name ?? 'No role' },
    { label: 'Last sign-in', value: describeLastSignIn(user.lastLoginAt) },
  ]

  return (
    <PageContainer
      title="My account"
      description="Your details, your password, and the devices you are signed in on."
      actions={
        <Link to={paths.accountPassword} className={buttonClasses({ variant: 'secondary' })}>
          <KeyIcon className="size-4.5" aria-hidden="true" />
          Change password
        </Link>
      }
    >
      <div className="grid min-w-0 grid-cols-1 items-start gap-5 xl:grid-cols-2">
        <Card
          title="Your details"
          description="Only an administrator can change these, so the record of who did what stays reliable."
        >
          <dl className="grid gap-3">
            {details.map((detail) => (
              <div key={detail.label} className="grid grid-cols-[9rem_1fr] gap-3 text-sm">
                <dt className="text-ink-muted">{detail.label}</dt>
                <dd className="font-medium wrap-anywhere text-ink">
                  {detail.value}
                  {detail.label === 'Role' && fullAccess && (
                    <Badge tone="info" className="ms-2">
                      Full access
                    </Badge>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card
          title="Signed-in devices"
          description="If you don’t recognise one, sign it out and change your password."
          actions={
            otherSessionCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                loading={revokeOthers.isPending}
                onClick={async () => {
                  try {
                    const message = await revokeOthers.mutateAsync()
                    toast.success('Other devices signed out', message)
                  } catch (error) {
                    toast.error('Couldn’t sign out the other devices', getErrorMessage(error))
                  }
                }}
              >
                Sign out other devices
              </Button>
            )
          }
        >
          <SessionList
            sessions={sessions.data ?? []}
            isLoading={sessions.isPending}
            revokingId={revokeOne.isPending ? revokeOne.variables : undefined}
            emptyMessage="You are not signed in anywhere else."
            onRevoke={async (item) => {
              try {
                await revokeOne.mutateAsync(item.id)
                toast.success('Device signed out', `${item.device} has been signed out.`)
              } catch (error) {
                toast.error('Couldn’t sign out that device', getErrorMessage(error))
              }
            }}
          />
        </Card>
      </div>
    </PageContainer>
  )
}
