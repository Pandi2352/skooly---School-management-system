import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { StudentListPage } from './StudentListPage'

describe('StudentListPage', () => {
  it('shows a loading state, then the first page of students', async () => {
    renderWithProviders(<StudentListPage />, { route: '/students' })
    expect(screen.getByRole('status')).toHaveTextContent('Loading students')
    expect(await screen.findByRole('link', { name: 'Sample Student 01' })).toBeInTheDocument()
    expect(screen.getByText('Showing 1 to 10 of 26 students')).toBeInTheDocument()
  })

  it('explains an empty search and offers to clear the filters', async () => {
    renderWithProviders(<StudentListPage />, { route: '/students?search=zzzz' })
    expect(await screen.findByText('No students match these filters')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument()
  })

  it('reads the enrollment filter from the URL', async () => {
    renderWithProviders(<StudentListPage />, { route: '/students?status=left' })
    expect(await screen.findAllByText('Left school')).not.toHaveLength(0)
    expect(screen.queryAllByText('Studying')).toHaveLength(0)
    expect(screen.getByRole('combobox', { name: 'Enrollment' })).toHaveTextContent('Left school')
  })

  it('shows plain column headers without sort controls', async () => {
    renderWithProviders(<StudentListPage />, { route: '/students' })
    await screen.findByRole('link', { name: 'Sample Student 01' })
    const nameHeader = screen.getByRole('columnheader', { name: 'Name' })
    expect(nameHeader).not.toHaveAttribute('aria-sort')
    expect(screen.queryByRole('button', { name: 'Name' })).not.toBeInTheDocument()
  })

  it('selects rows and shows the selection count', async () => {
    renderWithProviders(<StudentListPage />, { route: '/students' })
    await screen.findByRole('link', { name: 'Sample Student 01' })
    await userEvent.click(screen.getByRole('checkbox', { name: 'Select Sample Student 01' }))
    expect(screen.getByText('1 selected')).toBeInTheDocument()
    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Select all students on this page' }),
    )
    expect(screen.getByText('10 selected')).toBeInTheDocument()
  })

  it('shows cards in grid view', async () => {
    renderWithProviders(<StudentListPage />, { route: '/students?view=grid' })
    expect(await screen.findByRole('list', { name: 'Students' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Card view' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})
