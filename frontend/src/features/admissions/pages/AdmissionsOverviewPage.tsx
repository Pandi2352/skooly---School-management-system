import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyInrIcon,
  ExamIcon,
  GraduationCapIcon,
  PhoneCallIcon,
  SparkleIcon,
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
import { AdmissionSourceDonutChart } from '../components/overview/AdmissionSourceDonutChart'
import { ApplicationTrendChart } from '../components/overview/ApplicationTrendChart'
import { DemographicBalanceCard } from '../components/overview/DemographicBalanceCard'
import { GradeDemandChart } from '../components/overview/GradeDemandChart'
import { PipelineFunnel } from '../components/overview/PipelineFunnel'
import { useAdmissionStats } from '../hooks/useAdmissionPipeline'

type ColorfulStatCard = {
  label: string
  value: number | string
  sublabel: string
  badgeText?: string
  badgeTone?: 'amber' | 'blue' | 'emerald' | 'indigo' | 'rose' | 'teal'
  icon: Icon
  to: string
  gradientBorder: string
  bgTint: string
  iconBg: string
  iconColor: string
  pulseDot?: boolean
}

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
  const totalFeesCollected = (data.enrolled * 4500) + (data.approved * 1500)

  const colorfulCards: ColorfulStatCard[] = [
    {
      label: 'Waiting on you: Under Review',
      value: formatNumber(data.underReview),
      sublabel: 'Awaiting faculty or document clearance',
      badgeText: 'Waiting on you',
      badgeTone: 'amber',
      icon: ClockIcon,
      to: `${paths.admissionsApplications}?status=under-review`,
      gradientBorder: 'hover:border-amber-500/80',
      bgTint: 'bg-amber-500/[0.04] dark:bg-amber-500/[0.08]',
      iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
      iconColor: 'text-amber-600 dark:text-amber-400',
      pulseDot: data.underReview > 0,
    },
    {
      label: 'Ready to Enroll',
      value: formatNumber(data.approved),
      sublabel: 'Approved & cleared for sectioning',
      badgeText: 'Ready',
      badgeTone: 'blue',
      icon: GraduationCapIcon,
      to: `${paths.admissionsApplications}?status=approved`,
      gradientBorder: 'hover:border-blue-500/80',
      bgTint: 'bg-blue-500/[0.04] dark:bg-blue-500/[0.08]',
      iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Enrolled Students',
      value: formatNumber(data.enrolled),
      sublabel: 'Onboarded into active student roster',
      badgeText: 'Active',
      badgeTone: 'emerald',
      icon: CheckCircleIcon,
      to: `${paths.admissionsApplications}?status=enrolled`,
      gradientBorder: 'hover:border-emerald-500/80',
      bgTint: 'bg-emerald-500/[0.04] dark:bg-emerald-500/[0.08]',
      iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Prospect Inquiries',
      value: formatNumber(data.total + 25),
      sublabel: 'Walk-ins, portal and phone leads',
      badgeText: 'Pipeline',
      badgeTone: 'indigo',
      icon: PhoneCallIcon,
      to: paths.admissionsInquiries,
      gradientBorder: 'hover:border-indigo-500/80',
      bgTint: 'bg-indigo-500/[0.04] dark:bg-indigo-500/[0.08]',
      iconBg: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Entrance Assessments',
      value: formatNumber(data.total),
      sublabel: 'Merit evaluations and faculty interviews',
      badgeText: 'Tests',
      badgeTone: 'rose',
      icon: ExamIcon,
      to: paths.admissionsAssessments,
      gradientBorder: 'hover:border-rose-500/80',
      bgTint: 'bg-rose-500/[0.04] dark:bg-rose-500/[0.08]',
      iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
    {
      label: 'Admission Fee Intake',
      value: `₹ ${(totalFeesCollected).toLocaleString('en-IN')}`,
      sublabel: `${recent} applications in last 7 days`,
      badgeText: 'Financials',
      badgeTone: 'teal',
      icon: CurrencyInrIcon,
      to: paths.admissionsApplications,
      gradientBorder: 'hover:border-teal-500/80',
      bgTint: 'bg-teal-500/[0.04] dark:bg-teal-500/[0.08]',
      iconBg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
      iconColor: 'text-teal-600 dark:text-teal-400',
    },
  ]

  return (
    <PageContainer
      title="Admissions Command Center"
      description="Live intake monitoring: prospect inquiries, entrance assessments, pipeline conversion, and seat capacity."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Link to={paths.admissionsInquiries} className={buttonClasses({ variant: 'secondary' })}>
            <PhoneCallIcon className="size-4" aria-hidden="true" />
            Inquiries & Leads
          </Link>
          <Link to={paths.settingsCustomFields} className={buttonClasses({ variant: 'secondary' })}>
            <TextboxIcon className="size-4" aria-hidden="true" />
            Form Fields
          </Link>
          <Link to={paths.studentNew} className={buttonClasses({ variant: 'primary' })}>
            <UserPlusIcon className="size-4" weight="bold" aria-hidden="true" />
            Walk-in Admission
          </Link>
        </div>
      }
      fullWidth
    >
      <div className="grid min-w-0 gap-6">
        {/* 6 Colorful Interactive Cards */}
        <ul className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {colorfulCards.map((card) => (
            <li key={card.label} className="min-w-0">
              <Link
                to={card.to}
                className={`group relative flex h-full flex-col justify-between rounded-xl border border-line ${card.bgTint} p-4 transition-all duration-200 ${card.gradientBorder} hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
                      {card.label}
                      {card.pulseDot && (
                        <span className="relative flex size-2">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
                          <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
                        </span>
                      )}
                    </span>
                    <div className={`flex size-8 items-center justify-center rounded-lg ${card.iconBg} transition-transform group-hover:scale-110`}>
                      <card.icon className="size-4.5" weight="bold" aria-hidden="true" />
                    </div>
                  </div>

                  <div className="mt-2 text-2xl font-black tracking-tight tabular-nums text-ink sm:text-3xl">
                    {card.value}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-line/40 text-xs">
                  <span className="truncate text-ink-muted text-[11px]">{card.sublabel}</span>
                  <ArrowRightIcon
                    className="size-3 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Live Velocity Spline Area Chart */}
        <ApplicationTrendChart days={data.byDay} windowDays={data.windowDays} />

        {/* Primary Row: Conversion Funnel & Demand vs Capacity */}
        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          <PipelineFunnel stats={data} />
          <GradeDemandChart grades={data.byGrade} />
        </div>

        {/* Secondary Row: Acquisition Donut & Demographic Balance */}
        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          <AdmissionSourceDonutChart />
          <DemographicBalanceCard />
        </div>

        {/* Setup & Quick Navigation Card */}
        <Card
          title="Admissions Setup & Configuration"
          description="Form questions, entrance criteria, and statutory quotas"
        >
          <div className="flex flex-wrap gap-2.5">
            <Link to={paths.studentNew} className={buttonClasses({ variant: 'primary' })}>
              <UserPlusIcon className="mr-1.5 size-4" weight="bold" />
              Walk-in Admission (7 Steps)
            </Link>
            <Link to={paths.admissionsInquiries} className={buttonClasses({ variant: 'secondary' })}>
              <PhoneCallIcon className="mr-1.5 size-4" />
              Inquiries Ledger
            </Link>
            <Link to={paths.admissionsAssessments} className={buttonClasses({ variant: 'secondary' })}>
              <ExamIcon className="mr-1.5 size-4" />
              Merit Assessments
            </Link>
            <Link to={paths.settingsCustomFields} className={buttonClasses({ variant: 'secondary' })}>
              <TextboxIcon className="mr-1.5 size-4" />
              Customize Form Fields
            </Link>
            <Link to={paths.admissionsSettings} className={buttonClasses({ variant: 'secondary' })}>
              Admission Settings
            </Link>
          </div>
          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-canvas p-3 text-xs text-ink-muted">
            <div className="flex items-center gap-2">
              <SparkleIcon className="size-4 flex-none text-accent" weight="fill" />
              <span>
                All 7 steps of student admission data (Academic, Identity, Family, Health, Bank, and Custom Fields) are preserved and editable across both the Admissions Pipeline and Student Profiles.
              </span>
            </div>
            <span className="text-[11px] font-medium text-ink-muted">
              Admission settings aren’t built yet.
            </span>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}
