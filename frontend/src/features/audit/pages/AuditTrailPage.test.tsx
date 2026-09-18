import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { AuditTrailPage } from './AuditTrailPage'

describe('AuditTrailPage', () => {
  it('lists events with who did them and to which account', async () => {
    renderWithProviders(<AuditTrailPage />, { route: '/settings/audit-trail' })

    const row = (await screen.findByText('Role changed')).closest('tr')
    expect(row).not.toBeNull()
    expect(within(row as HTMLElement).getByText('Sample Accountant')).toBeInTheDocument()
    expect(within(row as HTMLElement).getByText('Sample Administrator')).toBeInTheDocument()
    expect(within(row as HTMLElement).getByText('Teacher to Accountant')).toBeInTheDocument()
  })

  it('marks a failed sign-in as worth attention, and says nobody was signed in', async () => {
    renderWithProviders(<AuditTrailPage />, { route: '/settings/audit-trail' })

    const row = (await screen.findByText('Wrong password')).closest('tr')
    expect(within(row as HTMLElement).getByText('Attention')).toBeInTheDocument()
    expect(within(row as HTMLElement).getByText('Not signed in')).toBeInTheDocument()
  })

  it('filters by event type from the URL', async () => {
    renderWithProviders(<AuditTrailPage />, { route: '/settings/audit-trail?action=user.role_changed' })

    expect(await screen.findByText('Role changed')).toBeInTheDocument()
    expect(screen.queryByText('Signed in')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument()
  })

  it('says how long history is kept, so nobody expects last year', async () => {
    renderWithProviders(<AuditTrailPage />, { route: '/settings/audit-trail' })

    const totals = await screen.findByRole('list', { name: 'Trail totals' })
    expect(within(totals).getByText('Kept for 400 days')).toBeInTheDocument()
  })
})
