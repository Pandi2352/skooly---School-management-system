import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { StudentAdmissionPage } from './StudentAdmissionPage'

const renderPage = () => renderWithProviders(<StudentAdmissionPage />, { route: '/students/new' })

describe('StudentAdmissionPage', () => {
  it('starts on the Academic step', () => {
    renderPage()
    expect(screen.getByRole('button', { name: /1\. Academic/ })).toHaveAttribute(
      'aria-current',
      'step',
    )
    expect(screen.getByRole('progressbar', { name: 'Admission progress' })).toHaveAttribute(
      'aria-valuenow',
      '14',
    )
  })

  it('opens any step from the step list', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /4\. Health/ }))
    expect(screen.getByRole('button', { name: /4\. Health/ })).toHaveAttribute(
      'aria-current',
      'step',
    )
    expect(screen.getByRole('heading', { name: 'Health details' })).toBeInTheDocument()
  })

  it('shows the school’s custom fields on the Documents step', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /7\. Documents/ }))
    expect(await screen.findByRole('heading', { name: 'Additional details' })).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Birth marks' })).toBeInTheDocument()
  })

  it('selects fee groups and counts them', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /6\. Fees/ }))
    await userEvent.click(await screen.findByRole('checkbox', { name: 'Tuition Fees 2026-2027' }))
    expect(screen.getByText('1 of 8 fee groups selected')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Select All/ }))
    expect(screen.getByText('8 of 8 fee groups selected')).toBeInTheDocument()
  })

  it('stays on the step and explains what’s missing', async () => {
    renderPage()
    await userEvent.click(screen.getByRole('button', { name: /Next Step/ }))
    expect(await screen.findByText('Enter the admission number, or press Auto')).toBeInTheDocument()
    expect(screen.getByText('Choose a class')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /1\. Academic/ })).toHaveAttribute(
      'aria-current',
      'step',
    )
  })

  it('fills the admission number with Auto, using the saved format', async () => {
    renderPage()
    const auto = screen.getByRole('button', { name: /Auto: fill the next admission number/ })
    await waitFor(() => expect(auto).toBeEnabled())
    await userEvent.click(auto)
    const input = screen.getByRole('textbox', { name: /Admission No/ })
    expect(input).toBeInstanceOf(HTMLInputElement)
    if (input instanceof HTMLInputElement) {
      expect(input.value).toMatch(/0001$/)
    }
  })
})
