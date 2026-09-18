import { CheckIcon, CopyIcon, DownloadSimpleIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { downloadTextFile } from '@/lib/browserFiles'

type RecoveryCodesDialogProps = {
  /** Null closes the dialog; a list opens it. */
  codes: string[] | null
  onClose: () => void
}

/**
 * The codes that get someone back in when their phone is lost. They are shown once — only their
 * hashes are stored — so the dialog makes copying and saving them easy and says plainly that this
 * is the only viewing.
 */
export function RecoveryCodesDialog({ codes, onClose }: RecoveryCodesDialogProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!codes) return
    try {
      await navigator.clipboard.writeText(codes.join('\n'))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can be refused; the codes are on screen to copy by hand.
      setCopied(false)
    }
  }

  return (
    <Dialog
      open={codes !== null}
      onOpenChange={(open) => {
        if (!open) {
          setCopied(false)
          onClose()
        }
      }}
      title="Your recovery codes"
      description="Keep these somewhere safe and private. Each one signs you in once if you can’t reach your authenticator app."
    >
      {codes && (
        <div className="grid gap-4">
          <ul className="grid grid-cols-2 gap-2 rounded-md border border-line bg-canvas p-3">
            {codes.map((code) => (
              <li key={code} className="font-mono text-sm tracking-wide text-ink">
                {code}
              </li>
            ))}
          </ul>

          <Alert tone="warning" title="This is the only time they are shown">
            Only a hash of each code is stored, so they can’t be shown again. If you lose them, you
            can create a new set from this page.
          </Alert>

          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={() => void copy()}>
              {copied ? (
                <CheckIcon className="size-4.5 text-success" aria-hidden="true" />
              ) : (
                <CopyIcon className="size-4.5" aria-hidden="true" />
              )}
              {copied ? 'Copied' : 'Copy codes'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => downloadTextFile('skooly-recovery-codes.txt', codes.join('\n'), 'text/plain')}
            >
              <DownloadSimpleIcon className="size-4.5" aria-hidden="true" />
              Download
            </Button>
            <Button onClick={onClose}>I’ve saved them</Button>
          </div>
        </div>
      )}
    </Dialog>
  )
}
