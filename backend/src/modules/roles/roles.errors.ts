import { HttpStatus } from '@nestjs/common'
import { AppException } from '../../common/exceptions/app.exception'
import { RoleErrorCode } from './constants/role.constants'

// One place for every role error, so status codes, codes and wording stay consistent.

export const roleNotFound = (id: string) =>
  new AppException(HttpStatus.NOT_FOUND, RoleErrorCode.ROLE_NOT_FOUND, `No role found with id "${id}".`)

export const roleNameTaken = (name: string) =>
  new AppException(HttpStatus.CONFLICT, RoleErrorCode.ROLE_NAME_TAKEN, `A role named "${name}" already exists.`, [
    { field: 'name', message: 'Choose a different name.' },
  ])

export const noRoleChanges = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    RoleErrorCode.ROLE_NO_CHANGES,
    'Send a name or description to update the role.',
  )

export const copySourceNotFound = (id: string) =>
  new AppException(
    HttpStatus.NOT_FOUND,
    RoleErrorCode.COPY_SOURCE_NOT_FOUND,
    `The role to copy permissions from ("${id}") doesn't exist.`,
    [{ field: 'copyFromRoleId', message: 'Choose an existing role, or leave it empty.' }],
  )

export const fullAccessNotCopyable = (name: string) =>
  new AppException(
    HttpStatus.UNPROCESSABLE_ENTITY,
    RoleErrorCode.FULL_ACCESS_NOT_COPYABLE,
    `${name} has full access, which can't be copied to another role. Copy a different role or start empty.`,
    [{ field: 'copyFromRoleId', message: 'Full access roles can’t be copied.' }],
  )

export const systemRoleRename = (name: string) =>
  new AppException(
    HttpStatus.UNPROCESSABLE_ENTITY,
    RoleErrorCode.SYSTEM_ROLE_RENAME,
    `${name} is a system role, so it can't be renamed. Its description and permissions can still change.`,
    [{ field: 'name', message: 'System role names can’t be changed.' }],
  )

export const systemRoleDelete = (name: string) =>
  new AppException(
    HttpStatus.UNPROCESSABLE_ENTITY,
    RoleErrorCode.SYSTEM_ROLE_DELETE,
    `${name} is a system role, so it can't be deleted.`,
  )

export const fullAccessLocked = (name: string) =>
  new AppException(
    HttpStatus.UNPROCESSABLE_ENTITY,
    RoleErrorCode.FULL_ACCESS_LOCKED,
    `${name} always has every permission, so its permissions can't be edited.`,
  )
