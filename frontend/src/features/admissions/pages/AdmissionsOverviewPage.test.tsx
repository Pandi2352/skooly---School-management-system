import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { AdmissionsOverviewPage } from './AdmissionsOverviewPage'

describe('AdmissionsOverviewPage', () => {
  it('leads with what is waiting on the reader', async () => {
    renderWithProviders(<AdmissionsOverviewPage />, { route: '/admissions/overview' })

    const waiting = await screen.findByRole('link', { name: /Waiting on you/ })
    expect(waiting).toHaveAttribute('href', '/admissions/applications?status=under-review')
  })

  it('links every pipeline stage to that stage of the list', async () => {
    renderWithProviders(<AdmissionsOverviewPage />, { route: '/admissions/overview' })

    const funnel = await screen.findByRole('region', { name: 'Where applications stand' })
    expect(within(funnel).getByRole('link', { name: /Approved/ })).toHaveAttribute(
      'href',
      '/admissions/applications?status=approved',
    )
  })

  it('describes the trend for anyone who cannot see the chart', async () => {
    renderWithProviders(<AdmissionsOverviewPage />, { route: '/admissions/overview' })

    const chart = await screen.findByRole('img', { name: /Applications received each day/ })
    expect(chart).toBeInTheDocument()
  })

  it('says plainly that admission settings are not built yet', async () => {
    renderWithProviders(<AdmissionsOverviewPage />, { route: '/admissions/overview' })

    expect(await screen.findByText(/aren’t built yet/)).toBeInTheDocument()
  })
})
