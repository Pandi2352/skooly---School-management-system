import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { AdmissionSettingsPage } from './AdmissionSettingsPage'

const renderPage = () => renderWithProviders(<AdmissionSettingsPage />, { route: '/admissions/settings' })

describe('AdmissionSettingsPage', () => {
  it('shows the saved settings', async () => {
    renderPage()
    expect(await screen.findByRole('textbox', { name: /Academic session/ })).toHaveValue('2026-27')
    expect(screen.getByRole('textbox', { name: /Custom URL/ })).toHaveValue('sample-school')
    expect(screen.getByText('Free to apply')).toBeInTheDocument()
  })

  it('builds the public address from the slug as it is typed', async () => {
    renderPage()
    const slug = await screen.findByRole('textbox', { name: /Custom URL/ })
    await userEvent.clear(slug)
    await userEvent.type(slug, 'green-valley')
    expect(screen.getByText('http://localhost:5173/admission/green-valley')).toBeInTheDocument()
    expect(screen.getByText('Save to reserve this address.')).toBeInTheDocument()
  })

  it('refuses a fee until a payment code is uploaded', async () => {
    renderPage()
    const feeSwitch = await screen.findByRole('switch', { name: /Charge an application fee/ })
    expect(feeSwitch).toBeDisabled()
    expect(
      screen.getByText('Upload a payment QR code first, or families have nowhere to pay.'),
    ).toBeInTheDocument()
  })

  it('rejects a slug with spaces and capitals', async () => {
    renderPage()
    const slug = await screen.findByRole('textbox', { name: /Custom URL/ })
    await userEvent.clear(slug)
    await userEvent.type(slug, 'Green Valley')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(
      await screen.findByText('Use lower case letters, numbers and dashes only, like green-valley'),
    ).toBeInTheDocument()
  })

  it('says the public form is not open to families yet', async () => {
    renderPage()
    expect(await screen.findByText('The form isn’t open to families yet')).toBeInTheDocument()
  })
})
