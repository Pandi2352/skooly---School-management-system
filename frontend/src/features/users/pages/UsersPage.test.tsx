import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { UsersPage } from './UsersPage'

describe('UsersPage', () => {
  it('lists accounts with their role and status', async () => {
    renderWithProviders(<UsersPage />, { route: '/users' })

    expect(await screen.findByRole('link', { name: 'Sample Administrator' })).toBeInTheDocument()
    const row = screen.getByRole('link', { name: 'Sample Accountant' }).closest('tr')
    expect(row).not.toBeNull()
    expect(within(row as HTMLElement).getByText('Accountant')).toBeInTheDocument()
    expect(within(row as HTMLElement).getByText('Invited')).toBeInTheDocument()
    expect(within(row as HTMLElement).getByText('Never signed in')).toBeInTheDocument()
  })

  it('filters the list by status, and says so in the URL', async () => {
    renderWithProviders(<UsersPage />, { route: '/users?status=suspended' })

    expect(await screen.findByRole('link', { name: 'Sample Teacher' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Sample Administrator' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument()
  })

  it('counts every account in the school under the title, not just the page', async () => {
    renderWithProviders(<UsersPage />, { route: '/users' })

    // Each segment of the rail is a filter: the label names the state, the figure sits above it.
    const totals = await screen.findByRole('list', { name: 'Account totals' })
    for (const state of ['Active', 'Invited', 'Suspended']) {
      const segment = within(totals).getByRole('button', { name: new RegExp(`1\s*${state}`) })
      expect(segment).toBeInTheDocument()
    }
  })

  it('explains why an invited account cannot be sent a password reset', async () => {
    const user = userEvent.setup({ delay: null })
    renderWithProviders(<UsersPage />, { route: '/users' })
    expect(await screen.findByRole('link', { name: 'Sample Accountant' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Actions for Sample Accountant' }))
    const resetItem = await screen.findByRole('menuitem', { name: /Email a password reset/ })

    expect(resetItem).toHaveAttribute('aria-disabled', 'true')
    expect(resetItem).toHaveTextContent('hasn’t accepted their invitation yet')
  })

  it('asks for a name and email before adding an account', async () => {
    const user = userEvent.setup({ delay: null })
    renderWithProviders(<UsersPage />, { route: '/users' })

    await user.click(await screen.findByRole('button', { name: /Add account/ }))
    const dialog = await screen.findByRole('dialog', { name: 'Add an account' })
    await user.click(within(dialog).getByRole('button', { name: 'Add account' }))

    expect(await within(dialog).findByText('Enter the person’s full name')).toBeInTheDocument()
    expect(within(dialog).getByText('Enter an email address')).toBeInTheDocument()
  })
})
