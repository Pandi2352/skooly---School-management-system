import { Controller, useFormContext } from 'react-hook-form'
import { ImageUploadField } from '@/components/ui/ImageUploadField'
import { WebcamCapture } from '@/components/ui/WebcamCapture'
import { PHOTO_MAX_BYTES } from '../constants'
import type { AdmissionFormValues } from '../types/admission.types'

type PhotoFieldProps = {
  name: 'personal.photo' | 'parents.fatherPhoto' | 'parents.motherPhoto'
  label: string
}

/** A photo panel: upload a file or take one with the webcam. */
export function PhotoField({ name, label }: PhotoFieldProps) {
  const { control } = useFormContext<AdmissionFormValues>()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="rounded-md border border-line bg-canvas p-4 @xl:w-fit @xl:min-w-80">
          <ImageUploadField
            label={label}
            hint="JPG or PNG, up to 1 MB"
            accept="image/png,image/jpeg"
            maxBytes={PHOTO_MAX_BYTES}
            value={field.value}
            onChange={field.onChange}
            actions={<WebcamCapture onCapture={field.onChange} />}
          />
        </div>
      )}
    />
  )
}
