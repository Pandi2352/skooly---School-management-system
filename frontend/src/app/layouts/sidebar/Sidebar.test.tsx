import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { Sidebar } from './Sidebar'

// The sidebar only lists pages the signed-in role can open, so it needs a session to render at all.
function renderSidebar(path: string, collapsed = false) {
  renderWithProviders(
    <Sidebar
      mode="static"
      open
      collapsed={collapsed}
      closeButtonRef={{ current: null }}
      onClose={vi.fn()}
      onExpand={vi.fn()}
      onNavigate={vi.fn()}
    />,
    { route: path },
  )
}

describe('Sidebar', () => {
  it('opens the current module and marks the current page', () => {
    renderSidebar('/transport-management/route-optimizer')
    expect(screen.getByRole('button', { name: 'Transport' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('link', { name: 'Route Optimizer' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('opens and closes a module', async () => {
    renderSidebar('/dashboard')
    const toggle = screen.getByRole('button', { name: 'Finance' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('link', { name: 'Fee Collection' })).not.toBeInTheDocument()

    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('link', { name: 'Fee Collection' })).toBeInTheDocument()

    await userEvent.click(toggle)
    expect(screen.queryByRole('link', { name: 'Fee Collection' })).not.toBeInTheDocument()
  })

  it('renders Skooly branding in expanded view with link to dashboard', () => {
    renderSidebar('/dashboard', false)
    const brandLink = screen.getByRole('link', { name: 'Skooly · School ERP' })
    expect(brandLink).toBeInTheDocument()
    expect(brandLink).toHaveAttribute('href', '/dashboard')
    expect(screen.getByRole('img', { name: 'Skooly' })).toHaveAttribute('src', '/skooly-logo.jpg')
  })

  it('renders Skooly logo in collapsed icon view', () => {
    renderSidebar('/dashboard', true)
    const brandLink = screen.getByRole('link', { name: 'Skooly · School ERP' })
    expect(brandLink).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Skooly' })).toBeInTheDocument()
  })
})
