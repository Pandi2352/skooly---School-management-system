/** Where off-site copies and daily summaries can be sent. More channels can be added later. */
export const DESTINATION_CHANNELS = ['telegram', 'email'] as const

export const CHANNEL_OPTIONS: { value: (typeof DESTINATION_CHANNELS)[number]; label: string }[] = [
  { value: 'telegram', label: 'Telegram' },
  { value: 'email', label: 'Email' },
]

export const BACKUP_ORIGINS = ['scheduled', 'manual'] as const

export const BACKUP_VIEWS = ['list', 'grid'] as const

/** Telegram bots can send files up to 50 MB. */
export const TELEGRAM_FILE_LIMIT_MB = 50
