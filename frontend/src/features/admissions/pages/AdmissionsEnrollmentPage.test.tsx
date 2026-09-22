import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { AdmissionsEnrollmentPage } from './AdmissionsEnrollmentPage'

describe('AdmissionsEnrollmentPage', () => {
  it('renders the heading, the pipeline counts and the applicants', async () => {
    renderWithProviders(<AdmissionsEnrollmentPage />)

    expect(screen.getByRole('heading', { name: /admissions & enrollment/i })).toBeInTheDocument()

    // Counts sit in the rail above the list, each segment a filter, like every other list page.
    const totals = await screen.findByRole('list', { name: 'Application totals' })
    expect(within(totals).getByText(/Applications$/)).toBeInTheDocument()
    expect(within(totals).getByText(/Under review$/)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('APP-2026-001')).toBeInTheDocument()
      // The name is rendered twice per row: once to read, once for screen readers on the avatar.
      expect(screen.getAllByText('Rohan Verma').length).toBeGreaterThan(0)
    })
  })

  it('filters applications when searching by applicant name', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AdmissionsEnrollmentPage />)

    await waitFor(() => {
      expect(screen.getByText('APP-2026-001')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/search name/i)
    await user.type(searchInput, 'Ananya')

    // Application numbers are unique per row; a name now appears twice, since the avatar also
    // renders it for screen readers.
    await waitFor(() => {
      expect(screen.getByText('APP-2026-002')).toBeInTheDocument()
      expect(screen.queryByText('APP-2026-001')).not.toBeInTheDocument()
    })
  })

  it('opens review drawer when clicking review button', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AdmissionsEnrollmentPage />)

    await waitFor(() => {
      expect(screen.getByText('APP-2026-001')).toBeInTheDocument()
    })

    const reviewButtons = screen.getAllByRole('button', { name: /^Review$/ })
    const targetButton = reviewButtons[0]
    expect(targetButton).toBeDefined()
    if (targetButton) {
      await user.click(targetButton)
    }

    await waitFor(() => {
      expect(screen.getByText(/applicant details/i)).toBeInTheDocument()
      expect(screen.getByText(/reviewer remarks/i)).toBeInTheDocument()
    })
  })
})
