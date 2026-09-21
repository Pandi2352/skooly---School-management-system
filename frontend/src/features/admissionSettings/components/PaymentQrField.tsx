import { QrCodeIcon, TrashIcon, UploadSimpleIcon } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { PAYMENT_QR_RULE } from '../constants'
import { useRemovePaymentQr, useUploadPaymentQr } from '../hooks/useAdmissionSettings'
import type { AdmissionSettings } from '../types/admissionSettings.types'

const formatSize = (bytes: number) => `${String(Math.max(1, Math.round(bytes / 1024)))} KB`

/**
 * The UPI code families scan to pay. Unlike the rest of the form this saves as soon as a file is
 * chosen: the fee can only be switched on once a code is stored, so it has to be stored first.
 */
export function PaymentQrField({ settings }: { settings: AdmissionSettings }) {
  const uploadQr = useUploadPaymentQr()
  const removeQr = useRemovePaymentQr()
  const { toast } = useToast()
  const fileInput = useRef<HTMLInputElement>(null)
  const [fileError, setFileError] = useState<string>()

  const upload = async (file: File | undefined) => {
    if (!file) return
    setFileError(undefined)
    if (file.size > PAYMENT_QR_RULE.maxBytes) {
      setFileError('Choose an image smaller than 2 MB.')
      return
    }
    try {
      await uploadQr.mutateAsync(file)
      toast.success('Payment QR saved', 'Families scan this to pay the application fee.')
    } catch (error) {
      setFileError(getErrorMessage(error))
    } finally {
      // Clearing lets the same file be chosen again after a failure.
      if (fileInput.current) fileInput.current.value = ''
    }
  }

  const remove = async () => {
    setFileError(undefined)
    try {
      await removeQr.mutateAsync()
      toast.success('Payment QR removed', 'The application fee is off until a new code is uploaded.')
    } catch (error) {
      setFileError(getErrorMessage(error))
    }
  }

  return (
    <div className="grid content-start gap-2">
      <span className="text-sm font-semibold text-ink">Payment QR code (UPI)</span>

      <div className="flex flex-wrap items-start gap-4">
        <div className="grid size-32 flex-none place-items-center overflow-hidden rounded-md border border-line bg-canvas">
          {settings.paymentQr ? (
            <img
              src={settings.paymentQr.url}
              alt="The UPI code families scan to pay the application fee"
              className="size-full object-contain p-1.5"
            />
          ) : (
            <QrCodeIcon className="size-9 text-ink-muted" aria-hidden="true" />
          )}
        </div>

        <div className="grid min-w-0 content-start gap-2">
          <input
            ref={fileInput}
            type="file"
            accept={PAYMENT_QR_RULE.accept}
            hidden
            onChange={(event) => void upload(event.target.files?.[0])}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              loading={uploadQr.isPending}
              onClick={() => fileInput.current?.click()}
            >
              <UploadSimpleIcon className="size-4" aria-hidden="true" />
              {settings.paymentQr ? 'Replace' : 'Upload code'}
            </Button>
            {settings.paymentQr && (
              <Button variant="ghost" size="sm" loading={removeQr.isPending} onClick={() => void remove()}>
                <TrashIcon className="size-4" aria-hidden="true" />
                Remove
              </Button>
            )}
          </div>
          {settings.paymentQr && (
            <p className="max-w-56 truncate text-xs text-ink-muted">
              {settings.paymentQr.originalName} · {formatSize(settings.paymentQr.sizeInBytes)}
            </p>
          )}
          <p className="max-w-56 text-sm text-ink-muted">
            A screenshot from the school’s payment app works. PNG, JPG or WebP, at least{' '}
            {PAYMENT_QR_RULE.minDimension}px so it still scans once printed.
          </p>
          {fileError && (
            <p role="alert" className="max-w-56 text-sm font-medium text-danger">
              {fileError}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
