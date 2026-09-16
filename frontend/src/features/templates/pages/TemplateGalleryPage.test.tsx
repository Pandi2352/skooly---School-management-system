import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { CardDesignsPage } from './CardDesignsPage'
import { TemplateGalleryPage } from './TemplateGalleryPage'

describe('TemplateGalleryPage', () => {
  it('lists the starter templates with All selected', async () => {
    renderWithProviders(<TemplateGalleryPage />, { route: '/template-gallery' })
    expect(
      await screen.findByRole('heading', { name: 'Classic Portrait ID Card' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^All/ })).toHaveAttribute('aria-pressed', 'true')
    expect(
      screen.getByRole('link', { name: /Use this template: Bonafide Certificate/ }),
    ).toHaveAttribute('href', '/template-gallery/designer?template=starter-bonafide-certificate')
  })

  it('filters by category', async () => {
    renderWithProviders(<TemplateGalleryPage />, { route: '/template-gallery' })
    await userEvent.click(await screen.findByRole('button', { name: /^Certificate/ }))
    expect(screen.getByRole('heading', { name: 'Bonafide Certificate' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Classic Portrait ID Card' }),
    ).not.toBeInTheDocument()
  })

  it('explains when nothing matches the search', async () => {
    renderWithProviders(<TemplateGalleryPage />, { route: '/template-gallery?search=zzz' })
    expect(await screen.findByText('No templates match')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(await screen.findByRole('heading', { name: 'Fee Receipt' })).toBeInTheDocument()
  })
})

describe('CardDesignsPage', () => {
  it('shows ID card designs only', async () => {
    renderWithProviders(<CardDesignsPage />, { route: '/id-cards/card-designs' })
    expect(await screen.findByRole('heading', { name: 'Staff ID Card' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Bonafide Certificate' })).not.toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'Filter by category' })).not.toBeInTheDocument()
  })
})
