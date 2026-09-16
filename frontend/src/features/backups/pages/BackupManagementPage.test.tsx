import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { BackupManagementPage } from './BackupManagementPage'

describe('BackupManagementPage', () => {
  it('lists the sample backups with a count', async () => {
    renderWithProviders(<BackupManagementPage />, { route: '/backup-management' })
    expect(await screen.findByText('backup-2026-09-01-06-57-36.zip')).toBeInTheDocument()
    expect(screen.getByText('2 backups')).toBeInTheDocument()
    expect(screen.getByText('No off-site copies yet')).toBeInTheDocument()
  })

  it('asks for a name and Telegram details before adding a destination', async () => {
    renderWithProviders(<BackupManagementPage />, { route: '/backup-management' })
    await userEvent.click(await screen.findByRole('button', { name: /Add destination/ }))
    const dialog = await screen.findByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: /Add destination/ }))
    expect(await within(dialog).findByText('Give this destination a name')).toBeInTheDocument()
    expect(within(dialog).getByText(/Paste the bot token/)).toBeInTheDocument()
  })

  it('opens the scheduling preferences', async () => {
    renderWithProviders(<BackupManagementPage />, { route: '/backup-management' })
    await userEvent.click(screen.getByRole('button', { name: /Scheduling Settings/ }))
    const dialog = await screen.findByRole('dialog', { name: 'Automation & Scheduling' })
    expect(
      await within(dialog).findByRole('switch', { name: 'Scheduled System Backups' }),
    ).toBeInTheDocument()
    expect(within(dialog).getByRole('checkbox', { name: 'Telegram' })).toBeInTheDocument()
  })
})
