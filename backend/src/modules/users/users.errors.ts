import { HttpStatus } from '@nestjs/common'
import { ErrorCode } from '../../common/constants/error-codes.constant'
import { AppException } from '../../common/exceptions/app.exception'
import { UserErrorCode } from './constants/user.constants'

// One place for every account error, so status codes, codes and wording stay consistent.

export const userNotFound = (id: string) =>
  new AppException(HttpStatus.NOT_FOUND, UserErrorCode.USER_NOT_FOUND, `No account found with id "${id}".`)

export const emailTaken = (email: string) =>
  new AppException(HttpStatus.CONFLICT, UserErrorCode.EMAIL_TAKEN, `${email} already has an account.`, [
    { field: 'email', message: 'Use a different email address.' },
  ])

export const emailBelongsToArchivedAccount = (email: string) =>
  new AppException(
    HttpStatus.CONFLICT,
    UserErrorCode.EMAIL_ARCHIVED,
    `${email} belongs to an archived account. Switch that account back on instead of creating a second one.`,
    [{ field: 'email', message: 'An archived account already uses this address.' }],
  )

export const roleNotFound = (roleId: string) =>
  new AppException(HttpStatus.NOT_FOUND, UserErrorCode.ROLE_NOT_FOUND, `No role found with id "${roleId}".`, [
    { field: 'roleId', message: 'Choose an existing role.' },
  ])

export const lastAdministrator = (action: string) =>
  new AppException(
    HttpStatus.UNPROCESSABLE_ENTITY,
    UserErrorCode.LAST_ADMINISTRATOR,
    `This is the only active administrator, so it can't be ${action}. Give another account an administrator role first.`,
  )

export const cannotModifySelf = (action: string) =>
  new AppException(
    HttpStatus.UNPROCESSABLE_ENTITY,
    UserErrorCode.CANNOT_MODIFY_SELF,
    `You can't ${action} your own account. Ask another administrator to do it.`,
  )

export const cannotGrantFullAccess = (roleName: string) =>
  new AppException(
    HttpStatus.FORBIDDEN,
    UserErrorCode.CANNOT_GRANT_FULL_ACCESS,
    `${roleName} has every permission, so only an administrator can assign it.`,
    [{ field: 'roleId', message: 'Choose a role without full access.' }],
  )

export const statusUnchanged = (status: string) =>
  new AppException(HttpStatus.BAD_REQUEST, UserErrorCode.STATUS_UNCHANGED, `This account is already ${status}.`)

export const roleUnchanged = (roleName: string) =>
  new AppException(HttpStatus.BAD_REQUEST, UserErrorCode.ROLE_UNCHANGED, `This account already has the ${roleName} role.`)

export const noUserChanges = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    UserErrorCode.NO_CHANGES,
    'Send a name, email, phone number or designation to update the account.',
  )

export const alreadyActivated = (name: string) =>
  new AppException(
    HttpStatus.UNPROCESSABLE_ENTITY,
    UserErrorCode.ALREADY_ACTIVATED,
    `${name} has already set a password, so there is no invitation to resend. Send a password reset instead.`,
  )

export const archivedAccount = (action: string) =>
  new AppException(
    HttpStatus.UNPROCESSABLE_ENTITY,
    UserErrorCode.ARCHIVED_ACCOUNT,
    `This account is archived, so it can't ${action}. Switch it back on first.`,
  )

export const weakPassword = (reason: string, field = 'password') =>
  new AppException(HttpStatus.BAD_REQUEST, ErrorCode.WEAK_PASSWORD, reason, [{ field, message: reason }])
