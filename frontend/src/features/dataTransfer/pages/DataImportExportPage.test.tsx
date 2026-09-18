import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { DataImportExportPage } from './DataImportExportPage'

describe('DataImportExportPage', () => {
  it('renders heading and default import wizard tab', () => {
    renderWithProviders(<DataImportExportPage />)

    expect(
      screen.getByRole('heading', { name: /data import & export center/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: /bulk data import wizard/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/students roster/i)).toBeInTheDocument()
    expect(screen.getByText(/faculty & staff/i)).toBeInTheDocument()
  })

  it('switches to Export Center tab and displays export datasets', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DataImportExportPage />)

    const exportTabButton = screen.getByRole('button', { name: /export center/i })
    await user.click(exportTabButton)

    await waitFor(() => {
      expect(screen.getByText(/school data export center/i)).toBeInTheDocument()
      expect(screen.getByText(/student master rosters/i)).toBeInTheDocument()
      expect(screen.getByText(/fee collection & dues status/i)).toBeInTheDocument()
      expect(screen.getByText(/faculty & staff directory/i)).toBeInTheDocument()
      expect(screen.getByText(/user activity & audit logs/i)).toBeInTheDocument()
    })
  })

  it('switches to Starter CSV Templates tab and displays column definitions', async () => {
    const user = userEvent.setup()
    renderWithProviders(<DataImportExportPage />)

    const templatesTabButton = screen.getByRole('button', { name: /starter csv templates/i })
    await user.click(templatesTabButton)

    await waitFor(() => {
      expect(screen.getByText(/standard import templates/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /download sample csv/i }),
      ).toBeInTheDocument()
    })
  })

  it('processes file upload and moves to Step 2 column mapping', async () => {
    const user = userEvent.setup()
    const fileContent = 'name,grade,section\nAarav Sharma,5,A\n'

    const textSpy = vi.spyOn(File.prototype, 'text').mockResolvedValue(fileContent)

    try {
      renderWithProviders(<DataImportExportPage />)

      const file = new File([fileContent], 'students.csv', { type: 'text/csv' })
      const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]')
      expect(fileInput).toBeInTheDocument()

      if (fileInput) {
        await user.upload(fileInput, file)
      }

      await waitFor(() => {
        expect(screen.getByText(/match columns for: students\.csv/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /verify & preview/i })).toBeInTheDocument()
      })
    } finally {
      textSpy.mockRestore()
    }
  })
})
