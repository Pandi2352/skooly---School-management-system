import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { RolesPage } from './RolesPage'

describe('RolesPage', () => {
  it('opens Administrator first with its permissions locked', async () => {
    renderWithProviders(<RolesPage />, { route: '/settings/roles' })
    expect(await screen.findByRole('heading', { name: 'Administrator', level: 2 })).toBeInTheDocument()
    expect(screen.getByText('This role always has every permission')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Save permissions' })).not.toBeInTheDocument()
  })

  it('tracks unsaved permission changes for a role', async () => {
    const user = userEvent.setup({ delay: null })
    renderWithProviders(<RolesPage />, { route: '/settings/roles?role=teacher' })
    expect(await screen.findByRole('heading', { name: 'Teacher', level: 2 })).toBeInTheDocument()
    const save = screen.getByRole('button', { name: 'Save permissions' })
    expect(save).toBeDisabled()

    const view = screen.getByRole('checkbox', { name: 'View: Online Exams' })
    expect(view).toBeChecked()
    await user.click(view)
    expect(screen.getByRole('checkbox', { name: 'Edit: Online Exams' })).not.toBeChecked()
    expect(screen.getByText(/Unsaved changes/)).toBeInTheDocument()
    expect(save).toBeEnabled()

    await user.click(screen.getByRole('button', { name: 'Discard' }))
    expect(screen.getByRole('checkbox', { name: 'View: Online Exams' })).toBeChecked()
  }, 60000)

  it('asks for a role name before adding a role', async () => {
    const user = userEvent.setup({ delay: null })
    renderWithProviders(<RolesPage />, { route: '/settings/roles' })
    await user.click(await screen.findByRole('button', { name: /Add Role/ }))
    const dialog = await screen.findByRole('dialog', { name: 'Add role' })
    await user.click(within(dialog).getByRole('button', { name: 'Add role' }))
    expect(await within(dialog).findByText('Enter a role name, like Transport Manager')).toBeInTheDocument()
  })

  it('opens duplicate role dialog with prefilled name and permissions template', async () => {
    const user = userEvent.setup({ delay: null })
    renderWithProviders(<RolesPage />, { route: '/settings/roles?role=teacher' })
    expect(await screen.findByRole('heading', { name: 'Teacher', level: 2 })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Duplicate role' }))
    const dialog = await screen.findByRole('dialog', { name: 'Duplicate Teacher' })
    expect(within(dialog).getByLabelText(/Role Name/)).toHaveValue('Teacher (Copy)')
    expect(within(dialog).getByRole('button', { name: 'Duplicate role' })).toBeInTheDocument()
  })
})

