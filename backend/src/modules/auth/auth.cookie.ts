import type { CookieOptions, Response } from 'express'
import type { AppEnvConfig, AuthEnvConfig } from '../../config/env.config'

/**
 * One place for how the session cookie is named, set and cleared, so a change can't apply to
 * signing in but not to signing out (which would leave a cookie the browser keeps sending).
 */

/**
 * In production the cookie is named with the `__Host-` prefix, which browsers only accept when it
 * is Secure, path `/` and tied to this exact host. A subdomain — or anything that manages to answer
 * on one — then cannot overwrite the school's session cookie. A configured cookie domain rules the
 * prefix out, because sharing across subdomains is the opposite of what it guarantees.
 */
export function sessionCookieName(app: AppEnvConfig, auth: AuthEnvConfig): string {
  const usesHostPrefix = app.nodeEnv === 'production' && auth.cookieDomain === ''
  return usesHostPrefix ? `__Host-${auth.cookieName}` : auth.cookieName
}

function baseOptions(app: AppEnvConfig, auth: AuthEnvConfig): CookieOptions {
  const isProduction = app.nodeEnv === 'production'
  // The API and the web app usually share a domain (school.in and api.school.in), where "lax" keeps
  // the cookie away from other sites' requests. When they are on different domains the browser only
  // sends it with "none", which it accepts over HTTPS alone.
  const crossSite = isProduction && registrableHost(app.publicBaseUrl) !== registrableHost(app.appUrl)
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: crossSite ? 'none' : 'lax',
    path: '/',
    ...(auth.cookieDomain ? { domain: auth.cookieDomain } : {}),
  }
}

function registrableHost(url: string): string {
  try {
    const { hostname } = new URL(url)
    return hostname.split('.').slice(-2).join('.')
  } catch {
    return url
  }
}

export function setSessionCookie(
  response: Response,
  token: string,
  expiresAt: Date,
  app: AppEnvConfig,
  auth: AuthEnvConfig,
): void {
  response.cookie(sessionCookieName(app, auth), token, { ...baseOptions(app, auth), expires: expiresAt })
}

export function clearSessionCookie(response: Response, app: AppEnvConfig, auth: AuthEnvConfig): void {
  // The options have to match the ones it was set with, or the browser keeps the old cookie.
  response.clearCookie(sessionCookieName(app, auth), baseOptions(app, auth))
}

export function readSessionCookie(
  cookies: Record<string, unknown> | undefined,
  app: AppEnvConfig,
  auth: AuthEnvConfig,
): string | null {
  const value = cookies?.[sessionCookieName(app, auth)]
  return typeof value === 'string' && value.length > 0 ? value : null
}
