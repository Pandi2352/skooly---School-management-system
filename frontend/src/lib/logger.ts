import { env } from '@/config/env'

type LogContext = Record<string, unknown>

// The only place that writes to the console (ESLint blocks console.log elsewhere).
// Never pass tokens, passwords or personal details of students, guardians or staff.
// TODO(monitoring): send `error` calls to Sentry or similar before the first production release.

export const logger = {
  debug(message: string, context?: LogContext) {
    if (env.isDev) console.warn(`[debug] ${message}`, context ?? '')
  },
  warn(message: string, context?: LogContext) {
    console.warn(message, context ?? '')
  },
  error(message: string, error?: unknown, context?: LogContext) {
    console.error(message, error, context ?? '')
  },
}

/** Logs errors that nothing else caught: uncaught exceptions and unhandled promise rejections. */
export function installGlobalErrorLogging() {
  window.addEventListener('error', (event) => {
    logger.error('Uncaught error', event.error)
  })
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', event.reason)
  })
}
