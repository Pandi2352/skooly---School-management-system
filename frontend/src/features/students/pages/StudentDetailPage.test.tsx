import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { StudentDetailPage } from './StudentDetailPage'

function renderPage(studentId = 'sample-01') {
  return renderWithProviders(
    <Routes>
      <Route path="/students/:studentId" element={<StudentDetailPage />} />
    </Routes>,
    { route: `/students/${studentId}` },
  )
}

describe('StudentDetailPage', () => {
  it('loads and displays student profile information', async () => {
    renderPage('sample-01')

    // Initial loading indicator
    expect(screen.getByRole('status')).toHaveTextContent('Loading student profile…')

    // Student profile header loads
    const heading = await screen.findByRole('heading', { level: 1, name: 'Sample Student 01' })
    expect(heading).toBeInTheDocument()

    // Demographic content appears
    expect(screen.getByText('Personal & Admission Information')).toBeInTheDocument()
    expect(screen.getAllByText('SAMPLE-0001').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('button', { name: 'Print Student ID Card' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'View Transfer Certificate' })).toBeInTheDocument()
  })

  it('allows switching between profile tabs', async () => {
    const user = userEvent.setup()
    renderPage('sample-01')

    await screen.findByRole('heading', { level: 1, name: 'Sample Student 01' })

    // Switch to Fees tab
    const feesTab = screen.getByRole('tab', { name: /Fees & Ledger/i })
    await user.click(feesTab)
    expect(await screen.findByText('Fee Invoices & Term Breakdown')).toBeInTheDocument()
    expect(screen.getByText('Total Received')).toBeInTheDocument()

    // Switch to Attendance tab
    const attendanceTab = screen.getByRole('tab', { name: /Attendance/i })
    await user.click(attendanceTab)
    expect(await screen.findByText('Recent Attendance Log')).toBeInTheDocument()
    expect(screen.getByText('Total Working Days')).toBeInTheDocument()

    // Switch to Documents tab
    const docsTab = screen.getByRole('tab', { name: /Documents/i })
    await user.click(docsTab)
    expect(await screen.findByText('Student Document Vault')).toBeInTheDocument()
  })

  it('shows error state when student is not found', async () => {
    renderPage('non-existent-student-999')

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Could not load student profile')).toBeInTheDocument()
    expect(screen.getByText(/was not found/i)).toBeInTheDocument()
  })
})
