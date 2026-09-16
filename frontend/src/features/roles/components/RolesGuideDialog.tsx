import { LockSimpleIcon, QuestionIcon, ShieldCheckIcon, UserGearIcon, type Icon } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'

function GuideSection({ icon: SectionIcon, title, children }: { icon: Icon; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-2 rounded-md border border-line p-4">
      <h3 className="flex items-center gap-2 font-semibold text-ink">
        <SectionIcon className="size-5 text-primary" weight="fill" aria-hidden="true" />
        {title}
      </h3>
      <div className="grid gap-1.5 text-sm text-ink-muted">{children}</div>
    </section>
  )
}

export function RolesGuideDialog() {
  return (
    <Dialog
      title="How roles and permissions work"
      size="lg"
      trigger={
        <Button variant="secondary">
          <QuestionIcon className="size-4.5" aria-hidden="true" />
          How it works
        </Button>
      }
    >
      <div className="grid gap-3">
        <GuideSection icon={LockSimpleIcon} title="System and custom roles">
          <p>
            <strong className="font-semibold text-ink">System roles</strong> (Teacher, Accountant and
            the others marked System) come with the app. You can change their permissions, but not
            their names, and they can’t be deleted.
          </p>
          <p>
            <strong className="font-semibold text-ink">Custom roles</strong> are ones your school adds,
            such as Transport Manager. Rename or delete them whenever you need to.
          </p>
        </GuideSection>

        <GuideSection icon={ShieldCheckIcon} title="What each permission allows">
          <p>
            Permissions are set per page, grouped by module as in the sidebar. <strong className="font-semibold text-ink">View</strong>{' '}
            opens the page; <strong className="font-semibold text-ink">Create</strong>,{' '}
            <strong className="font-semibold text-ink">Edit</strong> and{' '}
            <strong className="font-semibold text-ink">Delete</strong> allow those changes.
          </p>
          <p>Ticking Create, Edit or Delete also ticks View, since the page has to open first. Unticking View clears the rest.</p>
        </GuideSection>

        <GuideSection icon={UserGearIcon} title="Administrator and staff">
          <p>Administrator always has every permission, including pages added later, so its boxes are locked.</p>
          <p>
            Once staff accounts are connected, each staff member gets the permissions of their role. Give a
            role only what the job needs.
          </p>
        </GuideSection>
      </div>
    </Dialog>
  )
}
