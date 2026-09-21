import {
  ArrowRightIcon,
  ClockIcon,
  FileTextIcon,
  GraduationCapIcon,
  TextboxIcon,
  UserPlusIcon,
} from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { LoadingState } from '@/components/page/LoadingState'
import { PageContainer } from '@/components/page/PageContainer'
import { Alert } from '@/components/ui/Alert'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { Card } from '@/components/ui/Card'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { formatNumber } from '@/lib/format'
import { ApplicationTrendChart } from '../components/overview/ApplicationTrendChart'
import { GradeDemandChart } from '../components/overview/GradeDemandChart'
import { PipelineFunnel } from '../components/overview/PipelineFunnel'
import { useAdmissionStats } from '../hooks/useAdmissionPipeline'

type Headline = {
  label: string
  value: number
  hint: string
  icon: Icon
  to: string
  /** The one number that usually needs acting on, so it reads differently from the rest. */
  emphasis?: boolean
}

/** Admissions at a glance: what is waiting, what is arriving, and where the demand is. */
export function AdmissionsOverviewPage() {
  const stats = useAdmissionStats()

  if (stats.isPending) return <LoadingState label="Loading the admissions overview" />

  if (stats.isError) {
    return (
      <PageContainer title="Admissions Overview">
        <Alert tone="danger" title="Couldn’t load the overview">
          {getErrorMessage(stats.error)}
        </Alert>
      </PageContainer>
    )
  }

  const data = stats.data
  const recent = data.byDay.slice(-7).reduce((sum, entry) => sum + entry.count, 0)

  const headlines: Headline[] = [
    {
      label: 'Waiting on you',
      value: data.underReview,
      hint: 'Applications under review',
      icon: ClockIcon,
      to: `${paths.admissionsApplications}?status=under-review`,
      emphasis: true,
    },
    {
      label: 'Ready to enrol',
      value: data.approved,
      hint: 'Approved, not yet enrolled',
      icon: GraduationCapIcon,
      to: `${paths.admissionsApplications}?status=approved`,
    },
    {
      label: 'This week',
      value: recent,
      hint: 'Applications in the last 7 days',
      icon: FileTextIcon,
      to: paths.admissionsApplications,
    },
    {
      label: 'Enrolled',
      value: data.enrolled,
      hint: 'Became students',
      icon: GraduationCapIcon,
      to: `${paths.admissionsApplications}?status=enrolled`,
    },
  ]

  return (
    <PageContainer
      title="Admissions Overview"
      description="What is waiting, what is arriving, and which grades families are asking for."
      actions={
        <>
          <Link to={paths.settingsCustomFields} className={buttonClasses({ variant: 'secondary' })}>
            <TextboxIcon className="size-4.5" aria-hidden="true" />
            Form questions
          </Link>
          <Link to={paths.studentNew} className={buttonClasses({ variant: 'primary' })}>
            <UserPlusIcon className="size-4.5" weight="bold" aria-hidden="true" />
            Direct walk-in admission
          </Link>
        </>
      }
      fullWidth
    >
      <div className="grid min-w-0 gap-5">
        <ul className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {headlines.map((headline) => (
            <li key={headline.label} className="min-w-0">
              <Link
                to={headline.to}
                className="group grid h-full gap-1 rounded-md border border-line bg-surface p-4 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-ink-muted">{headline.label}</span>
                  <headline.icon
                    className={headline.emphasis ? 'size-5 text-primary' : 'size-5 text-ink-muted'}
                    aria-hidden="true"
                  />
                </span>
                {/* The number is the point, so it is the largest thing in the tile. */}
                <span className="text-3xl font-bold tabular-nums text-ink">{formatNumber(headline.value)}</span>
                <span className="flex items-center gap-1 text-sm text-ink-muted">
                  {headline.hint}
                  <ArrowRightIcon
                    className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <ApplicationTrendChart days={data.byDay} windowDays={data.windowDays} />

        <div className="grid min-w-0 gap-5 xl:grid-cols-2">
          <PipelineFunnel stats={data} />
          <GradeDemandChart grades={data.byGrade} />
        </div>

        <Card
          title="Set up the admission form"
          description="What the form asks, and how families reach it."
        >
          <div className="flex flex-wrap gap-2">
            <Link to={paths.settingsCustomFields} className={buttonClasses({ variant: 'secondary' })}>
              Edit the questions it asks
            </Link>
            <Link to={paths.admissionsApplications} className={buttonClasses({ variant: 'secondary' })}>
              Go to applications
            </Link>
          </div>
          <p className="mt-3 text-sm text-ink-muted">
            Admission settings — the fee, the public link and the shareable card — aren’t built yet.
            They appear under Admissions → Admission Settings once they are.
          </p>
        </Card>
      </div>
    </PageContainer>
  )
}
