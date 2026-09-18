import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { AdmissionsEnrollmentPage } from './AdmissionsEnrollmentPage'

describe('AdmissionsEnrollmentPage', () => {
  it('renders heading, kpi stats cards, and sample applicants', async () => {
    renderWithProviders(<AdmissionsEnrollmentPage />)

    expect(
      screen.getByRole('heading', { name: /admissions & enrollment/i }),
    ).toBeInTheDocument()

    // Verify stats region once loaded
    await waitFor(() => {
      expect(
        screen.getByRole('region', { name: /admissions pipeline metrics/i }),
      ).toBeInTheDocument()
      expect(screen.getByText('APP-2026-001')).toBeInTheDocument()
      expect(screen.getByText('Rohan Verma')).toBeInTheDocument()
    })
  })

  it('filters applications when searching by applicant name', async () => {
    const user = userEvent.setup()
    renderWithProviders(<AdmissionsEnrollmentPage />)

    await waitFor(() => {
      expect(screen.getByText('Rohan Verma')).toBeInTheDocument()
    })

    const searchInput = screen.getByPlaceholderText(/search by name/i)
    await user.type(searchInput, 'Ananya')

    await waitFor(() => {
      expect(screen.getByText('Ananya Sharma')).toBeInTheDocument()
      expect(screen.queryByText('Rohan Verma')).not.toBeInTheDocument()
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
