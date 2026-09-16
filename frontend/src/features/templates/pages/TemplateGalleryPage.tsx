import { PageContainer } from '@/components/page/PageContainer'
import { TemplateGallery } from '../components/TemplateGallery'
import { TemplateGalleryActions } from '../components/TemplateGalleryActions'

export function TemplateGalleryPage() {
  return (
    <PageContainer
      title="Template Gallery"
      description="Pick a ready-made design, or start fresh"
      actions={<TemplateGalleryActions />}
      fullWidth
    >
      <TemplateGallery />
    </PageContainer>
  )
}
