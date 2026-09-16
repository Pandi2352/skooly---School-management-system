import { PageContainer } from '@/components/page/PageContainer'
import { TemplateGallery } from '../components/TemplateGallery'
import { TemplateGalleryActions } from '../components/TemplateGalleryActions'

/** The Template Gallery narrowed to ID cards, listed under the ID Cards module. */
export function CardDesignsPage() {
  return (
    <PageContainer
      title="Card Designs"
      description="ID card designs for students and staff. Open one to edit it in the Canvas Designer."
      actions={<TemplateGalleryActions />}
      fullWidth
    >
      <TemplateGallery lockedCategory="id-card" />
    </PageContainer>
  )
}
