import { CameraIcon } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { Button } from './Button'
import { Dialog } from './Dialog'

// Captured photos are scaled down to this width: plenty for a profile photo, and a small data URL.
const MAX_PHOTO_WIDTH = 640

type WebcamCaptureProps = {
  /** Receives the photo as a JPEG data URL. */
  onCapture: (dataUrl: string) => void
}

/** "Take with Webcam" button and dialog. The camera runs only while the dialog is open. */
export function WebcamCapture({ onCapture }: WebcamCaptureProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Take a photo"
      description="Centre the student’s face, then press Capture."
      trigger={
        <Button variant="secondary" size="sm">
          <CameraIcon className="size-4" aria-hidden="true" />
          Take with Webcam
        </Button>
      }
    >
      {open && (
        <Camera
          onCancel={() => setOpen(false)}
          onUse={(dataUrl) => {
            onCapture(dataUrl)
            setOpen(false)
          }}
        />
      )}
    </Dialog>
  )
}

function cameraErrorMessage(reason: unknown) {
  const name = reason instanceof DOMException ? reason.name : ''
  if (name === 'NotAllowedError') {
    return 'Camera access is blocked. Allow the camera in your browser’s site settings, then try again.'
  }
  if (name === 'NotFoundError') return 'No camera was found on this device. Upload a photo instead.'
  if (name === 'NotReadableError')
    return 'The camera is in use by another app. Close it and try again.'
  return 'The camera couldn’t start. Try again, or upload a photo instead.'
}

type CameraProps = { onCancel: () => void; onUse: (dataUrl: string) => void }

function Camera({ onCancel, onUse }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const supported = 'mediaDevices' in navigator
  const [status, setStatus] = useState<'starting' | 'live' | 'error'>(
    supported ? 'starting' : 'error',
  )
  const [error, setError] = useState(
    supported ? '' : 'This browser can’t use a camera here. Upload a photo instead.',
  )
  const [shot, setShot] = useState<string | null>(null)

  useEffect(() => {
    if (!supported) return
    let stream: MediaStream | null = null
    let cancelled = false

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((media) => {
        if (cancelled) {
          media.getTracks().forEach((track) => track.stop())
          return
        }
        stream = media
        const video = videoRef.current
        if (video) {
          video.srcObject = media
          void video.play()
        }
        setStatus('live')
      })
      .catch((reason: unknown) => {
        if (cancelled) return
        setStatus('error')
        setError(cameraErrorMessage(reason))
      })

    // Turn the camera off when the dialog closes.
    return () => {
      cancelled = true
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [supported])

  const capture = () => {
    const video = videoRef.current
    if (!video || video.videoWidth === 0) return
    const scale = Math.min(1, MAX_PHOTO_WIDTH / video.videoWidth)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(video.videoWidth * scale)
    canvas.height = Math.round(video.videoHeight * scale)
    const context = canvas.getContext('2d')
    if (!context) return
    context.drawImage(video, 0, 0, canvas.width, canvas.height)
    setShot(canvas.toDataURL('image/jpeg', 0.9))
  }

  return (
    <div className="grid gap-4">
      <div className="relative grid aspect-4/3 place-items-center overflow-hidden rounded-md bg-ink">
        {/* Stays mounted after a capture so Retake can use the same camera stream. */}
        <video
          ref={videoRef}
          playsInline
          muted
          aria-label="Camera preview"
          // Mirrored like a mirror, which is easier to line up; the saved photo isn't mirrored.
          className={cn(
            'size-full -scale-x-100 object-cover',
            (shot !== null || status !== 'live') && 'hidden',
          )}
        />
        {shot && <img src={shot} alt="Captured photo" className="size-full object-contain" />}
        {status === 'starting' && <p className="absolute text-sm text-canvas">Starting camera…</p>}
        {status === 'error' && (
          <p role="alert" className="absolute px-6 text-center text-sm text-canvas">
            {error}
          </p>
        )}
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        {shot ? (
          <>
            <Button variant="secondary" onClick={() => setShot(null)}>
              Retake
            </Button>
            <Button onClick={() => onUse(shot)}>Use this photo</Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button disabled={status !== 'live'} onClick={capture}>
              <CameraIcon className="size-4.5" weight="fill" aria-hidden="true" />
              Capture
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
