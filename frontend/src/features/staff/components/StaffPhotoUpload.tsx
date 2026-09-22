import { useUploadStaffPhoto } from '../hooks/useStaff'
import { ImageUploadField } from '@/components/ui/ImageUploadField'

type StaffPhotoUploadProps = {
  staffId: string
  photoUrl: string | null
  onPhotoChanged?: (url: string | null) => void
}

export function StaffPhotoUpload({
  staffId,
  photoUrl,
  onPhotoChanged,
}: StaffPhotoUploadProps) {
  const uploadMutation = useUploadStaffPhoto()

  const handlePhotoChange = async (newUrl: string | null) => {
    if (newUrl) {
      await uploadMutation.mutateAsync({ id: staffId, photoUrl: newUrl })
    }
    onPhotoChanged?.(newUrl)
  }

  return (
    <ImageUploadField
      label="Staff Photo"
      hint="JPG or PNG up to 2MB. 1:1 aspect ratio recommended."
      accept="image/png,image/jpeg,image/webp"
      maxBytes={2 * 1024 * 1024}
      value={photoUrl}
      onChange={(newUrl) => {
        void handlePhotoChange(newUrl)
      }}
      previewShape="square"
    />
  )
}
