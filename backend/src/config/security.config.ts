import type { Logger } from '@nestjs/common'
import type { ConfigService } from '@nestjs/config'
import type { AppEnvConfig, MailEnvConfig } from './env.config'

/**
 * The settings that are fine on a laptop and dangerous on a real server. In development they are a
 * warning; in production the app refuses to start, because a school that is running with sign-in
 * switched off has no way of knowing it.
 */
export function assertProductionIsSafe(configService: ConfigService, logger: Logger): void {
  const app = configService.getOrThrow<AppEnvConfig>('app')
  const mail = configService.get<MailEnvConfig>('mail')
  const isProduction = app.nodeEnv === 'production'
  const problems: string[] = []

  if (!app.authEnabled) {
    problems.push('AUTH_ENABLED is false, so nobody has to sign in and no permission is checked.')
  }
  if (app.corsOrigins.includes('*')) {
    problems.push(
      'CORS_ORIGINS contains "*". With cookie sign-in that lets any website make requests as a signed-in person. List the school\'s own addresses instead.',
    )
  }
  if (!app.publicBaseUrl.startsWith('https://')) {
    problems.push('PUBLIC_BASE_URL is not https, so the session cookie would travel in the clear.')
  }
  if (!app.appUrl.startsWith('https://')) {
    problems.push('APP_URL is not https, so emailed sign-in links would travel in the clear.')
  }

  if (problems.length === 0) {
    if (!mail?.enabled) {
      logger.warn('SMTP_HOST is empty: invitations and password resets will be logged, not sent.')
    }
    return
  }

  if (isProduction) {
    for (const problem of problems) logger.error(problem)
    throw new Error(
      `Refusing to start in production: ${problems.length} unsafe setting${problems.length === 1 ? '' : 's'}. Fix the values above in the environment.`,
    )
  }

  logger.warn(`Development mode with ${problems.length} setting(s) that must change before production:`)
  for (const problem of problems) logger.warn(`  • ${problem}`)
}
