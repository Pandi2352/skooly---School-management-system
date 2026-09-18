import {
  ArrowRightIcon,
  MoonIcon,
  QuotesIcon,
  ShieldCheckIcon,
  SparkleIcon,
  SunIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '@/app/paths'
import { Tooltip } from '@/components/ui/Tooltip'
import { useTheme } from '@/hooks/useTheme'
import { useBranding } from '@/features/branding/hooks/useBranding'
import { LoginForm } from '../components/LoginForm'
import { RoleQuickSwitch } from '../components/RoleQuickSwitch'
import type { ErpRole } from '../types/auth.types'

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<ErpRole>('admin')
  const [email, setEmail] = useState('admin@skooly.edu')
  const { preference, setPreference } = useTheme()
  const branding = useBranding()

  const logoUrl = branding.data?.assets.logo?.url ?? '/skooly-logo.jpg'
  const bgUrl = branding.data?.assets.loginBackground?.url ?? '/school-campus-bg.jpg'
  const schoolName = branding.data?.displayName ?? 'Skooly'
  const shortName = branding.data?.shortName ?? 'School ERP'
  const tagline =
    branding.data?.tagline ??
    'Single-institution school management system for calm administration, student lifecycles, and everyday academic excellence.'
  const footerText =
    branding.data?.documentFooter ?? '© 2026 Skooly ERP · St. Xavier’s Senior Academy. All rights reserved.'

  const handleRoleSelect = (role: ErpRole, selectedEmail: string) => {
    setSelectedRole(role)
    setEmail(selectedEmail)
  }

  const toggleTheme = () => {
    setPreference(preference === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden">
      {/* School campus architectural background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: `url('${bgUrl}')` }}
        aria-hidden="true"
      />

      {/* Atmospheric scrim: soft warm parchment wash in light mode, deep navy in dark mode */}
      <div
        className="fixed inset-0 z-0 bg-gradient-to-t from-canvas/95 via-canvas/80 to-canvas/40 backdrop-blur-[0.5px] transition-colors duration-500 lg:bg-gradient-to-r lg:from-canvas/95 lg:via-canvas/85 lg:to-canvas/30 dark:from-side/95 dark:via-side/85 dark:to-side/60"
        aria-hidden="true"
      />

      {/* Top utility bar */}
      <header className="relative z-10 flex h-16 items-center justify-between px-6 sm:px-10 lg:px-16">
        <Link
          to={paths.dashboard}
          className="group flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-primary dark:focus-visible:outline-accent"
        >
          <img
            src={logoUrl}
            alt={schoolName}
            className="size-9 rounded-md object-cover ring-1 ring-line/50 transition-transform group-hover:scale-105 dark:ring-white/20"
          />
          <div className="flex flex-col">
            <span className="text-lg leading-none font-bold tracking-tight text-ink dark:text-white">
              {schoolName}
            </span>
            <span className="mt-0.5 text-[10px] font-semibold tracking-wider text-primary uppercase dark:text-accent">
              {shortName}
            </span>
          </div>

        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-md border border-line/80 bg-surface/85 px-3 py-1 text-xs text-ink backdrop-blur-sm sm:flex dark:border-white/15 dark:bg-side/80 dark:text-white/90">
            <span className="size-2 animate-pulse rounded-full bg-success" />
            <span>Academic Session 2026–2027</span>
          </div>

          <Tooltip content={preference === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex size-9 cursor-pointer items-center justify-center rounded-md border border-line/80 bg-surface/85 text-ink transition-colors hover:bg-surface hover:text-primary focus-visible:outline-2 focus-visible:outline-primary sm:flex dark:border-white/15 dark:bg-side/80 dark:text-white dark:hover:bg-side-hover dark:focus-visible:outline-accent"
              aria-label="Toggle theme"
            >
              {preference === 'dark' ? (
                <SunIcon className="size-4.5 text-accent" weight="bold" />
              ) : (
                <MoonIcon className="size-4.5 text-ink" weight="bold" />
              )}
            </button>
          </Tooltip>
        </div>
      </header>

      {/* Main hero & auth layout */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8 sm:px-8 lg:px-16">
        <div className="grid w-full max-w-6xl grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left institutional branding column */}
          <section className="space-y-6 lg:col-span-6 xl:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-md border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-xs dark:border-accent/30 dark:bg-accent/15 dark:text-accent">
              <SparkleIcon className="size-3.5" weight="fill" />
              <span>Single-Institution Enterprise Architecture</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-sans text-3xl leading-tight font-bold tracking-tight text-ink sm:text-4xl xl:text-5xl dark:text-white">
                Welcome to <span className="text-primary dark:text-accent">{schoolName}</span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed font-normal text-ink-muted sm:text-lg dark:text-side-ink/90">
                {tagline}
              </p>
            </div>


            {/* Inspiring Educational Quotes */}
            <div className="max-w-xl space-y-3">
              <div className="rounded-md border border-line/80 bg-surface/85 p-5 backdrop-blur-md dark:border-white/10 dark:bg-side/75">
                <div className="flex items-start gap-3">
                  <QuotesIcon
                    weight="fill"
                    className="size-7 flex-none text-primary/60 dark:text-accent/60"
                    aria-hidden="true"
                  />
                  <div className="space-y-2">
                    <blockquote className="text-base leading-relaxed italic text-ink sm:text-lg dark:text-side-ink">
                      &ldquo;Education is the most powerful weapon which you can use to change the world.&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary dark:text-accent">
                      <span className="h-px w-4 bg-primary/40 dark:bg-accent/40" />
                      <span>Nelson Mandela</span>
                    </div>
                  </div>
                </div>
              </div>

              <blockquote className="border-s-2 border-primary/50 bg-surface/60 px-4 py-2.5 text-xs italic text-ink-muted backdrop-blur-xs dark:border-accent/60 dark:bg-side/40 dark:text-side-muted rounded-r-md">
                &ldquo;Inspiring excellence, cultivating integrity, and empowering tomorrow&apos;s
                leaders through thoughtful school leadership.&rdquo;
              </blockquote>
            </div>
          </section>

          {/* Right card: Login Form */}
          <section className="w-full lg:col-span-6 xl:col-span-5">
            <div className="relative rounded-md border border-line/80 bg-surface/95 p-6 backdrop-blur-xl sm:p-8 dark:border-side-line dark:bg-surface/95">
              {/* Card top banner */}
              <div className="mb-6 space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold tracking-tight text-ink">
                    Staff & Faculty Portal
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-2 py-0.5 text-[11px] font-semibold text-accent">
                    <ShieldCheckIcon className="size-3.5" weight="fill" />
                    Secure Login
                  </span>
                </div>
                <p className="text-xs text-ink-muted">
                  Authenticate with your institutional account or select a demo role below.
                </p>
              </div>

              {/* Persona quick switch */}
              <div className="mb-5">
                <RoleQuickSwitch selectedRole={selectedRole} onSelectRole={handleRoleSelect} />
              </div>

              {/* Login form */}
              <LoginForm initialEmail={email} role={selectedRole} />

              {/* Demo skip & security note */}
              <div className="mt-6 space-y-3 border-t border-line pt-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-muted">
                  <ShieldCheckIcon className="size-4 flex-none text-success" weight="fill" />
                  <span>256-bit Encrypted Session · Single Institution Isolated Ledger</span>
                </div>

                <div className="pt-1">
                  <Link
                    to={paths.dashboard}
                    className="inline-flex items-center gap-1 rounded-md text-xs font-semibold text-primary transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <span>Direct Preview: Enter Dashboard</span>
                    <ArrowRightIcon className="size-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex flex-col items-center justify-between gap-2 border-t border-line/80 bg-surface/75 px-6 py-4 text-xs text-ink-muted backdrop-blur-xs sm:flex-row sm:px-10 lg:px-16 dark:border-white/10 dark:bg-side/85 dark:text-side-muted">
        <p>{footerText}</p>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Institutional Support: ext. 104</span>
          <span>•</span>
          <span>support@skooly.edu</span>
          <span>•</span>
          <Link
            to={paths.contactSupport}
            className="transition-colors hover:text-primary dark:hover:text-white"
          >
            Helpdesk Directory
          </Link>
        </div>
      </footer>
    </div>
  )
}
