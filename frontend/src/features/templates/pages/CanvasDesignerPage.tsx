import { MagicWandIcon } from '@phosphor-icons/react'
import { Link, useSearchParams } from 'react-router-dom'
import { paths } from '@/app/paths'
import { EmptyState } from '@/components/page/EmptyState'
import { ErrorState } from '@/components/page/ErrorState'
import { LoadingState } from '@/components/page/LoadingState'
import { PageContainer } from '@/components/page/PageContainer'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { getErrorMessage } from '@/lib/api/getErrorMessage'
import { CanvasDesigner } from '../components/CanvasDesigner'
import { useTemplate } from '../hooks/useTemplates'
import { isPresetSizeId } from '../utils/guards'
import { createBlankDraft, toTemplateDraft } from '../utils/templateDraft'

/**
 * /template-gallery/designer?template=<id> opens a design; ?size=<size id> starts a blank one.
 * The canvas and its libraries load only on this page.
 */
export function CanvasDesignerPage() {
  const [params] = useSearchParams()
  const templateId = params.get('template')
  const sizeParam = params.get('size') ?? ''
  const template = useTemplate(templateId)
  // Matches Tailwind's `lg`: three panels and a canvas don't fit on smaller screens.
  const isDesktop = useMediaQuery('(min-width: 64rem)')

  if (!isDesktop) {
    return (
      <PageContainer title="Canvas Designer">
        <EmptyState
          icon={MagicWandIcon}
          title="Canvas Designer needs a wider screen"
          description="Open it on a laptop or desktop screen at least 1024 pixels wide. You can still browse templates here."
          action={
            <Link to={paths.templateGallery} className={buttonClasses({ variant: 'secondary' })}>
              Back to templates
            </Link>
          }
        />
      </PageContainer>
    )
  }

  if (templateId !== null) {
    if (template.isPending) return <LoadingState label="Opening design" />
    if (template.isError) {
      return (
        <PageContainer title="Canvas Designer">
          <ErrorState
            title="Couldn’t open this design"
            description={getErrorMessage(template.error)}
            onRetry={() => void template.refetch()}
          />
        </PageContainer>
      )
    }
    return (
      <CanvasDesigner
        key={template.data.id}
        initialDraft={toTemplateDraft(template.data)}
        templateId={template.data.source === 'custom' ? template.data.id : null}
      />
    )
  }

  const sizeId = isPresetSizeId(sizeParam) ? sizeParam : 'cr80-portrait'
  return (
    <CanvasDesigner
      key={`new-${sizeId}`}
      initialDraft={createBlankDraft(sizeId)}
      templateId={null}
    />
  )
}
