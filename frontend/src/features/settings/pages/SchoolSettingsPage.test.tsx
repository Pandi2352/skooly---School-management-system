import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { SchoolSettingsPage } from './SchoolSettingsPage'

describe('SchoolSettingsPage', () => {
  it('loads the school profile into the form', async () => {
    renderWithProviders(<SchoolSettingsPage />, { route: '/settings/school' })
    expect(await screen.findByRole('textbox', { name: /School Name/ })).toHaveValue(
      'Sample Public School',
    )
    expect(screen.getByRole('link', { name: /School Profile/ })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('shows field errors instead of saving invalid values', async () => {
    renderWithProviders(<SchoolSettingsPage />, { route: '/settings/school' })
    const name = await screen.findByRole('textbox', { name: /School Name/ })
    await userEvent.clear(name)
    await userEvent.click(screen.getByRole('button', { name: /Save settings/ }))
    expect(await screen.findByText('Enter the school’s full name')).toBeInTheDocument()
  })

  it('enables save only after a change, then saves', async () => {
    renderWithProviders(<SchoolSettingsPage />, { route: '/settings/school' })
    const principal = await screen.findByRole('textbox', { name: /Principal Name/ })
    const save = screen.getByRole('button', { name: /Save settings/ })
    expect(save).toBeDisabled()
    await userEvent.type(principal, 'Sample Principal')
    expect(save).toBeEnabled()
    expect(screen.getByText('You have unsaved changes')).toBeInTheDocument()
    await userEvent.click(save)
    expect(await screen.findByText('School profile saved')).toBeInTheDocument()
  })

  it('shows System & Formats with live number previews', async () => {
    renderWithProviders(<SchoolSettingsPage />, { route: '/settings/school?tab=system' })
    const prefix = await screen.findByRole('textbox', { name: /Receipt Prefix/ })
    expect(screen.getByText(/^SPS\/\d{4}-\d{4}\/\d{2}\/001$/)).toBeInTheDocument()
    await userEvent.clear(prefix)
    await userEvent.type(prefix, 'FEE')
    expect(screen.getByText(/^FEE\/\d{4}-\d{4}\/\d{2}\/001$/)).toBeInTheDocument()
    expect(screen.getByText(/^ROLL\/\d{2}-\d{2}\/001$/)).toBeInTheDocument()
  })

  it('shows a coming-soon panel for sections that are not built', async () => {
    renderWithProviders(<SchoolSettingsPage />, { route: '/settings/school?tab=security' })
    expect(await screen.findByText('Security is coming soon')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Security/ })).toHaveAttribute('aria-current', 'page')
  })
})
