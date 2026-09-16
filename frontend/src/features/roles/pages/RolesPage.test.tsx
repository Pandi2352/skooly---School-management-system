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
    renderWithProviders(<RolesPage />, { route: '/settings/roles?role=teacher' })
    expect(await screen.findByRole('heading', { name: 'Teacher', level: 2 })).toBeInTheDocument()
    const save = screen.getByRole('button', { name: 'Save permissions' })
    expect(save).toBeDisabled()

    const view = screen.getByRole('checkbox', { name: 'View: Online Exams' })
    expect(view).toBeChecked()
    await userEvent.click(view)
    expect(screen.getByRole('checkbox', { name: 'Edit: Online Exams' })).not.toBeChecked()
    expect(screen.getByText(/Unsaved changes/)).toBeInTheDocument()
    expect(save).toBeEnabled()

    await userEvent.click(screen.getByRole('button', { name: 'Discard' }))
    expect(screen.getByRole('checkbox', { name: 'View: Online Exams' })).toBeChecked()
  }, 60000)

  it('asks for a role name before adding a role', async () => {
    renderWithProviders(<RolesPage />, { route: '/settings/roles' })
    await userEvent.click(await screen.findByRole('button', { name: /Add Role/ }))
    const dialog = await screen.findByRole('dialog', { name: 'Add role' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Add role' }))
    expect(await within(dialog).findByText('Enter a role name, like Transport Manager')).toBeInTheDocument()
  }, 20000)
})
