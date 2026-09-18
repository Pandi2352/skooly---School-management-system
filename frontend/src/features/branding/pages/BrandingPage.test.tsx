import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ThemeProvider } from '@/app/theme/ThemeProvider'
import { renderWithProviders } from '@/test/render'
import { BrandingPage } from './BrandingPage'

const renderPage = () =>
  renderWithProviders(
    <ThemeProvider>
      <BrandingPage />
    </ThemeProvider>,
    { route: '/settings/branding' },
  )

describe('BrandingPage', () => {
  it('shows the saved name, the colour themes and every image slot', async () => {
    renderPage()
    expect(await screen.findByRole('textbox', { name: /Display Name/ })).toHaveValue('Sample Public School')
    expect(screen.getByRole('button', { name: /Navy/ })).toHaveAttribute('aria-pressed', 'true')
    for (const label of ['School Logo', 'Favicon', 'Principal Signature', 'School Seal', 'Login Background']) {
      expect(await screen.findByRole('heading', { name: label })).toBeInTheDocument()
    }
  })

  it('previews unsaved text and blocks an empty name', async () => {
    renderPage()
    const name = await screen.findByRole('textbox', { name: /Display Name/ })
    await userEvent.clear(name)
    await userEvent.type(name, 'Green Valley School')
    expect(screen.getAllByText('Green Valley School').length).toBeGreaterThan(0)
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument()

    await userEvent.clear(name)
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(await screen.findByText('Enter the school’s name, like Green Valley Public School')).toBeInTheDocument()
  })

  it('explains a file that is the wrong type before uploading', async () => {
    renderPage()
    const replace = await screen.findByRole('button', { name: 'Upload: Favicon' })
    const input = replace.closest('section')?.querySelector('input[type="file"]')
    if (!(input instanceof HTMLInputElement)) throw new Error('file input not found')
    await userEvent.upload(input, new File(['x'], 'icon.gif', { type: 'image/gif' }), { applyAccept: false })
    expect(await screen.findByRole('alert')).toHaveTextContent('Favicon must be a PNG, ICO image.')
  })
})
