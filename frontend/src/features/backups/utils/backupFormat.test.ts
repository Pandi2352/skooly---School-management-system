import { describe, expect, it } from 'vitest'
import { destinationFormSchema } from '../schemas/backup.schema'
import type { DestinationFormValues } from '../types/backup.types'
import {
  backupFileName,
  formatBackupCount,
  formatBackupDate,
  formatFileSize,
  formatScheduleNotice,
  toDestinationInput,
} from './backupFormat'

const emptyForm: DestinationFormValues = {
  channel: 'telegram',
  label: 'Office',
  botToken: '',
  chatId: '',
  email: '',
}

describe('backup formatting', () => {
  it('formats dates and file names', () => {
    expect(formatBackupDate('2026-08-04T07:48:49')).toBe('2026-08-04 07:48:49')
    expect(backupFileName(new Date(2026, 8, 1, 6, 5, 9))).toBe('backup-2026-09-01-06-05-09.zip')
  })

  it('formats sizes and counts', () => {
    expect(formatFileSize(21_758_771)).toBe('20.75 MB')
    expect(formatFileSize(2048)).toBe('2 KB')
    expect(formatBackupCount(1)).toBe('1 backup')
    expect(formatBackupCount(2)).toBe('2 backups')
  })

  it('describes the backup schedule', () => {
    const schedule = {
      dailySummary: { enabled: false, time: '08:00', channels: [] },
      scheduledBackups: { enabled: true, time: '02:00' },
    }
    expect(formatScheduleNotice(schedule)).toMatch(/every night at 02:00/)
    expect(
      formatScheduleNotice({ ...schedule, scheduledBackups: { enabled: false, time: '02:00' } }),
    ).toMatch(/Scheduled backups are off/)
  })

  it('keeps only the chosen channel’s fields', () => {
    expect(
      toDestinationInput({ ...emptyForm, channel: 'email', email: ' admin@school.in ' }),
    ).toEqual({ channel: 'email', label: 'Office', email: 'admin@school.in' })
  })
})

describe('destinationFormSchema', () => {
  const messages = (values: DestinationFormValues) => {
    const result = destinationFormSchema.safeParse(values)
    return result.success ? [] : result.error.issues.map((issue) => issue.message)
  }

  it('requires a bot token and chat ID for Telegram', () => {
    expect(messages(emptyForm)).toEqual([
      'Paste the bot token from @BotFather, like 123456789:AAH…',
      'Enter the numeric chat ID, like -1001234567890',
    ])
    expect(
      messages({
        ...emptyForm,
        botToken: '123456789:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw',
        chatId: '-1001234567890',
      }),
    ).toEqual([])
  })

  it('requires only an email address for Email', () => {
    expect(messages({ ...emptyForm, channel: 'email', email: 'nope' })).toEqual([
      'Enter a valid email address, like admin@yourschool.in',
    ])
  })
})
