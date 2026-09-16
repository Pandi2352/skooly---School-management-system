import { z } from 'zod'
import { BACKUP_ORIGINS, DESTINATION_CHANNELS } from '../constants'

export const backupSchema = z.object({
  id: z.string(),
  createdAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), 'Invalid date'),
  fileName: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  origin: z.enum(BACKUP_ORIGINS),
})

export const backupListSchema = z.array(backupSchema)

const destinationLabel = z
  .string()
  .trim()
  .min(1, 'Give this destination a name')
  .max(40, 'Use 40 characters or fewer')

/** What the API sends back. The Telegram bot token is never returned. */
export const destinationSchema = z.discriminatedUnion('channel', [
  z.object({
    id: z.string(),
    channel: z.literal('telegram'),
    label: z.string(),
    chatId: z.string(),
  }),
  z.object({ id: z.string(), channel: z.literal('email'), label: z.string(), email: z.string() }),
])

export const destinationListSchema = z.array(destinationSchema)

/** Request body for adding a destination. */
export const destinationInputSchema = z.discriminatedUnion('channel', [
  z.object({
    channel: z.literal('telegram'),
    label: destinationLabel,
    botToken: z.string(),
    chatId: z.string(),
  }),
  z.object({ channel: z.literal('email'), label: destinationLabel, email: z.email() }),
])

const TELEGRAM_BOT_TOKEN = /^\d{6,12}:[\w-]{30,}$/
const TELEGRAM_CHAT_ID = /^-?\d{5,20}$/

/** The Add destination form: one flat shape, with the fields for the chosen channel required. */
export const destinationFormSchema = z
  .object({
    channel: z.enum(DESTINATION_CHANNELS),
    label: destinationLabel,
    botToken: z.string().trim(),
    chatId: z.string().trim(),
    email: z.string().trim(),
  })
  .superRefine((values, ctx) => {
    if (values.channel === 'telegram') {
      if (!TELEGRAM_BOT_TOKEN.test(values.botToken)) {
        ctx.addIssue({
          code: 'custom',
          path: ['botToken'],
          message: 'Paste the bot token from @BotFather, like 123456789:AAH…',
        })
      }
      if (!TELEGRAM_CHAT_ID.test(values.chatId)) {
        ctx.addIssue({
          code: 'custom',
          path: ['chatId'],
          message: 'Enter the numeric chat ID, like -1001234567890',
        })
      }
    } else if (!z.email().safeParse(values.email).success) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: 'Enter a valid email address, like admin@yourschool.in',
      })
    }
  })

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Enter a time, like 08:00')

export const backupScheduleSchema = z.object({
  dailySummary: z
    .object({
      enabled: z.boolean(),
      time,
      channels: z.array(z.enum(DESTINATION_CHANNELS)),
    })
    .refine((summary) => !summary.enabled || summary.channels.length > 0, {
      message: 'Choose at least one channel',
      path: ['channels'],
    }),
  scheduledBackups: z.object({ enabled: z.boolean(), time }),
})
