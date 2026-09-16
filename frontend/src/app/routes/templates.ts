import type { RouteObject } from 'react-router-dom'

// Template Gallery (System) and Card Designs (ID Cards) share the templates feature.
// The designer route loads the canvas library, so it's its own lazy chunk.
export const templateRoutes: RouteObject[] = [
  {
    path: 'template-gallery',
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('@/features/templates/pages/TemplateGalleryPage'))
            .TemplateGalleryPage,
        }),
      },
      {
        path: 'designer',
        lazy: async () => ({
          Component: (await import('@/features/templates/pages/CanvasDesignerPage'))
            .CanvasDesignerPage,
        }),
      },
    ],
  },
  {
    path: 'id-cards/card-designs',
    lazy: async () => ({
      Component: (await import('@/features/templates/pages/CardDesignsPage')).CardDesignsPage,
    }),
  },
]
