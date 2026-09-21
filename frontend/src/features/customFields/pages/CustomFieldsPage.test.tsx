import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { CustomFieldsPage } from './CustomFieldsPage'

describe('CustomFieldsPage', () => {
  // Each question appears twice on this page: once in the table, once in the preview beside it.
  const table = () => screen.getByRole('region', { name: 'Extra questions' })

  it('lists the questions in the order the form asks them', async () => {
    renderWithProviders(<CustomFieldsPage />, { route: '/settings/custom-fields' })

    expect(await within(table()).findByText('Birth marks')).toBeInTheDocument()
    expect(within(table()).getByText('Previous school board')).toBeInTheDocument()
    // The first question can't move up, and the last can't move down.
    expect(screen.getByRole('button', { name: 'Move Birth marks up' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Move Hostel required down' })).toBeDisabled()
  })

  it('shows the name answers are saved under, and which questions are hidden', async () => {
    renderWithProviders(<CustomFieldsPage />, { route: '/settings/custom-fields' })

    expect(await screen.findByText('birth_marks')).toBeInTheDocument()
    const hiddenRow = within(table()).getByText('Hostel required').closest('tr')
    expect(within(hiddenRow as HTMLElement).getByText('Hidden')).toBeInTheDocument()
  })

  it('counts what the form asks, not what is merely saved', async () => {
    renderWithProviders(<CustomFieldsPage />, { route: '/settings/custom-fields' })

    const totals = await screen.findByRole('list', { name: 'Question totals' })
    // Three questions exist; one is hidden, so the form asks two, one of them required.
    expect(within(totals).getByText('2 asked on the form')).toBeInTheDocument()
    expect(within(totals).getByText('1 must be answered')).toBeInTheDocument()
    expect(within(totals).getByText('1 hidden')).toBeInTheDocument()
  })

  it('previews only the questions the form will actually ask', async () => {
    renderWithProviders(<CustomFieldsPage />, { route: '/settings/custom-fields' })

    const preview = await screen.findByRole('region', { name: 'How the form will look' })
    expect(await within(preview).findByText('Birth marks')).toBeInTheDocument()
    expect(within(preview).queryByText('Hostel required')).not.toBeInTheDocument()
  })

  it('asks for the question before adding it', async () => {
    const user = userEvent.setup({ delay: null })
    renderWithProviders(<CustomFieldsPage />, { route: '/settings/custom-fields' })

    await user.click(await screen.findByRole('button', { name: /Add question/ }))
    const dialog = await screen.findByRole('dialog', { name: 'Add a question' })
    await user.click(within(dialog).getByRole('button', { name: 'Add question' }))

    expect(await within(dialog).findByText('Enter a label, like Birth Marks')).toBeInTheDocument()
  })
})
