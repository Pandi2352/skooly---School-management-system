import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { Navbar } from './Navbar'

function renderNavbar(isDesktop = true, sidebarCollapsed = false) {
  const onMenuClick = vi.fn()
  renderWithProviders(
    <Navbar
      isDesktop={isDesktop}
      sidebarCollapsed={sidebarCollapsed}
      menuOpen={false}
      menuButtonRef={{ current: null }}
      onMenuClick={onMenuClick}
    />,
  )
  return { onMenuClick }
}

describe('Navbar', () => {
  it('renders all navigation items and icons', () => {
    renderNavbar()

    // Left controls
    expect(screen.getByLabelText('Collapse sidebar')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'More navigation options' })).toBeInTheDocument()

    // Right toolbar controls
    expect(screen.getByLabelText(/Academic session/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Language/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Quick search' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Quick create' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Notifications/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Settings and preferences' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'App Launcher' })).toBeInTheDocument()
    expect(screen.getByLabelText(/User account/)).toBeInTheDocument()
  })

  it('displays the notifications badge count of 4', () => {
    renderNavbar()
    expect(screen.getByText('4')).toBeInTheDocument()
  })

  it('displays the active academic session shorthand', () => {
    renderNavbar()
    expect(screen.getByText('26-27')).toBeInTheDocument()
  })

  it('displays the user avatar with SA initials', () => {
    renderNavbar()
    expect(screen.getByText('SA')).toBeInTheDocument()
  })

  it('calls onMenuClick when hamburger button is clicked', async () => {
    const user = userEvent.setup()
    const { onMenuClick } = renderNavbar()

    await user.click(screen.getByLabelText('Collapse sidebar'))
    expect(onMenuClick).toHaveBeenCalledTimes(1)
  })

  it('opens search dialog on quick search button click', async () => {
    const user = userEvent.setup()
    renderNavbar()

    await user.click(screen.getByRole('button', { name: 'Quick search' }))
    expect(screen.getByPlaceholderText('Search students, classes, or pages...')).toBeInTheDocument()
  })
})
