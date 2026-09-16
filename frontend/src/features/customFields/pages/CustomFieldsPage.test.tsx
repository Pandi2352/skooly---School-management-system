import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { CustomFieldsPage } from './CustomFieldsPage'

describe('CustomFieldsPage', () => {
  it('lists the fields in form order', async () => {
    renderWithProviders(<CustomFieldsPage />, { route: '/settings/custom-fields' })
    expect(await screen.findByText('Birth Marks')).toBeInTheDocument()
    expect(screen.getByText('Previous School Board')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Move Birth Marks up' })).toBeDisabled()
  })

  it('asks for a label before adding a field', async () => {
    renderWithProviders(<CustomFieldsPage />, { route: '/settings/custom-fields' })
    await userEvent.click(screen.getByRole('button', { name: /Add Field/ }))
    const dialog = await screen.findByRole('dialog', { name: 'Add custom field' })
    await userEvent.click(within(dialog).getByRole('button', { name: 'Add field' }))
    expect(await within(dialog).findByText('Enter a label, like Birth Marks')).toBeInTheDocument()
  })
})
