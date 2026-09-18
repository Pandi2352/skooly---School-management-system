import { CheckIcon, CopyIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'

export type Handover = {
  title: string
  description: string
  /** What the administrator has to pass on: a temporary password, or a link to open. */
  secretLabel: string
  secretValue: string
  /** Why it won't be shown again, or what the person should do with it. */
  note: string
}

type CredentialHandoverDialogProps = {
  handover: Handover | null
  onClose: () => void
}

/**
 * Shows the one thing an administrator has to pass on by hand — a temporary password, or an
 * invitation link when email couldn't send it. It is shown once, because the server keeps only a
 * hash of it, so the dialog says so plainly and makes copying easy.
 */
export function CredentialHandoverDialog({ handover, onClose }: CredentialHandoverDialogProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!handover) return
    try {
      await navigator.clipboard.writeText(handover.secretValue)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be refused; the value is on screen to read or select by hand.
      setCopied(false)
    }
  }

  return (
    <Dialog
      open={handover !== null}
      onOpenChange={(open) => {
        if (!open) {
          setCopied(false)
          onClose()
        }
      }}
      title={handover?.title ?? ''}
      description={handover?.description}
    >
      {handover && (
        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <span className="text-sm font-medium text-ink">{handover.secretLabel}</span>
            <div className="flex items-stretch gap-2">
              <code className="min-w-0 flex-1 rounded-md border border-line bg-canvas px-3 py-2 font-mono text-sm wrap-anywhere text-ink">
                {handover.secretValue}
              </code>
              <Button variant="secondary" onClick={copy}>
                {copied ? (
                  <CheckIcon className="size-4.5 text-success" aria-hidden="true" />
                ) : (
                  <CopyIcon className="size-4.5" aria-hidden="true" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <Alert tone="warning" title="This is shown only once">
            {handover.note}
          </Alert>

          <div className="flex justify-end">
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      )}
    </Dialog>
  )
}
