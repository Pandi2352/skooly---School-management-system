import { useId, type ReactNode } from 'react'
import { useToast } from '@/hooks/useToast'
import { ACCEPTED_IMAGE_TYPES, IMAGE_UPLOAD_MAX_BYTES } from '../constants'
import { readFileAsDataUrl, validateImageFile } from '../utils/imageFile'

type ImagePickerProps = {
  onPick: (dataUrl: string) => void
  /** Renders the visible control; call `openPicker` from its click handler. */
  children: (openPicker: () => void) => ReactNode
}

/** A hidden file input for one image. Checks type and size first and explains any problem. */
export function ImagePicker({ onPick, children }: ImagePickerProps) {
  const inputId = useId()
  const { toast } = useToast()

  const openPicker = () => {
    const input = document.getElementById(inputId)
    if (input instanceof HTMLInputElement) input.click()
  }

  const pick = async (file: File | undefined) => {
    if (!file) return
    const problem = validateImageFile(file, IMAGE_UPLOAD_MAX_BYTES)
    if (problem) {
      toast({ tone: 'error', title: 'Couldn’t use that image', description: problem })
      return
    }
    try {
      onPick(await readFileAsDataUrl(file))
    } catch {
      toast({
        tone: 'error',
        title: 'Couldn’t read that image',
        description: 'Try choosing the file again.',
      })
    }
  }

  return (
    <>
      <input
        id={inputId}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        hidden
        onChange={(event) => {
          void pick(event.target.files?.[0])
          // Lets the same file be chosen again.
          event.target.value = ''
        }}
      />
      {children(openPicker)}
    </>
  )
}
