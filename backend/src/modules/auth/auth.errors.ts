import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from '../../common/constants/error-codes.constant'
import { AppException } from '../../common/exceptions/app.exception'
import { AuthErrorCode } from './constants/auth.constants'

// One place for every sign-in error, so status codes, codes and wording stay consistent.

/**
 * The same message whether the email is unknown or the password is wrong. Saying which would let
 * anyone check who works at the school.
 */
export const invalidCredentials = () =>
  new AppException(
    HttpStatus.UNAUTHORIZED,
    AuthErrorCode.INVALID_CREDENTIALS,
    'That email and password don’t match. Check both and try again.',
  )

export const accountLocked = (minutesLeft: number) =>
  new AppException(
    HttpStatus.TOO_MANY_REQUESTS,
    AuthErrorCode.ACCOUNT_LOCKED,
    `Too many wrong passwords. Try again in ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}, or ask an administrator to reset your password.`,
  )

export const accountSuspended = () =>
  new AppException(
    HttpStatus.FORBIDDEN,
    AuthErrorCode.ACCOUNT_SUSPENDED,
    'This account is suspended. An administrator at your school can switch it back on.',
  )

export const accountArchived = () =>
  new AppException(
    HttpStatus.FORBIDDEN,
    AuthErrorCode.ACCOUNT_ARCHIVED,
    'This account is no longer in use. Contact an administrator at your school.',
  )

export const notSignedIn = () =>
  new AppException(HttpStatus.UNAUTHORIZED, ErrorCode.UNAUTHORIZED, 'Sign in to continue.')

export const sessionExpired = () =>
  new AppException(HttpStatus.UNAUTHORIZED, AuthErrorCode.SESSION_EXPIRED, 'You were signed out. Sign in again to continue.')

export const sessionNotFound = () =>
  new AppException(HttpStatus.NOT_FOUND, AuthErrorCode.SESSION_NOT_FOUND, 'That session has already ended.')

export const setupAlreadyDone = () =>
  new AppException(
    HttpStatus.CONFLICT,
    AuthErrorCode.SETUP_ALREADY_DONE,
    'This school is already set up. Sign in, or ask an administrator to add your account.',
  )

export const administratorRoleMissing = () =>
  new AppException(
    HttpStatus.SERVICE_UNAVAILABLE,
    AuthErrorCode.SETUP_ROLE_MISSING,
    'The Administrator role hasn’t been created yet. Restart the server and try again.',
  )

export const tokenInvalid = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    AuthErrorCode.TOKEN_INVALID,
    'This link isn’t valid. Ask an administrator to send a new one.',
    [{ field: 'token', message: 'The link is not valid.' }],
  )

export const tokenExpired = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    AuthErrorCode.TOKEN_EXPIRED,
    'This link has expired. Ask an administrator to send a new one.',
    [{ field: 'token', message: 'The link has expired.' }],
  )

export const tokenAlreadyUsed = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    AuthErrorCode.TOKEN_ALREADY_USED,
    'This link has already been used. Sign in, or ask for a new link.',
    [{ field: 'token', message: 'The link has already been used.' }],
  )

export const currentPasswordWrong = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    AuthErrorCode.CURRENT_PASSWORD_WRONG,
    'Your current password isn’t right.',
    [{ field: 'currentPassword', message: 'Check your current password.' }],
  )

export const passwordUnchanged = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    AuthErrorCode.PASSWORD_UNCHANGED,
    'Choose a password you haven’t used here before.',
    [{ field: 'newPassword', message: 'This is your current password.' }],
  )

export const weakPassword = (reason: string, field = 'newPassword') =>
  new AppException(HttpStatus.BAD_REQUEST, ErrorCode.WEAK_PASSWORD, reason, [{ field, message: reason }])

// Two-step sign-in ----------------------------------------------------------

export const twoFactorUnavailable = () =>
  new AppException(
    HttpStatus.SERVICE_UNAVAILABLE,
    AuthErrorCode.TWO_FACTOR_UNAVAILABLE,
    'Two-step sign-in isn’t available on this server yet. Ask whoever runs it to set TWO_FACTOR_KEY.',
  )

export const twoFactorNotConfigured = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    AuthErrorCode.TWO_FACTOR_NOT_CONFIGURED,
    'Set up two-step sign-in first: scan the QR code, then enter a code from your app.',
  )

export const twoFactorAlreadyOn = () =>
  new AppException(
    HttpStatus.CONFLICT,
    AuthErrorCode.TWO_FACTOR_ALREADY_ON,
    'Two-step sign-in is already on for this account.',
  )

export const twoFactorCodeWrong = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    AuthErrorCode.TWO_FACTOR_CODE_WRONG,
    'That code isn’t right. Codes change every 30 seconds, so check your app for the current one.',
    [{ field: 'code', message: 'Check the current code in your app.' }],
  )

export const twoFactorChallengeExpired = () =>
  new AppException(
    HttpStatus.UNAUTHORIZED,
    AuthErrorCode.TWO_FACTOR_CHALLENGE_EXPIRED,
    'This sign-in took too long. Enter your email and password again.',
  )
