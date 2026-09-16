export const ROLE_KINDS = ['system', 'custom'] as const
export type RoleKind = (typeof ROLE_KINDS)[number]

export const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete'] as const
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number]

/**
 * A permission key: "<module>.<page>:<action>" or, for single-page modules, "<module>:<action>".
 * Slugs match the frontend menu (frontend/src/config/navigation.ts), e.g.
 * "fees-and-finance.fee-collection:edit" or "backup-management:view".
 */
export const PERMISSION_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)?:(?:view|create|edit|delete)$/

export const ROLE_LIMITS = {
  nameMin: 2,
  nameMax: 40,
  descriptionMax: 160,
  searchMax: 60,
  /** Far above the current menu (about 100 pages × 4 actions), low enough to stop abuse. */
  permissionsMax: 2000,
} as const

/** Letters, numbers and spaces, plus & ' ( ) . / - ; must start with a letter or number. */
export const ROLE_NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} &'()./-]*$/u

/** Codes for role-specific failures; general ones live in common/constants/error-codes.constant.ts. */
export enum RoleErrorCode {
  ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
  ROLE_NAME_TAKEN = 'ROLE_NAME_TAKEN',
  ROLE_NO_CHANGES = 'ROLE_NO_CHANGES',
  COPY_SOURCE_NOT_FOUND = 'ROLE_COPY_SOURCE_NOT_FOUND',
  FULL_ACCESS_NOT_COPYABLE = 'ROLE_FULL_ACCESS_NOT_COPYABLE',
  SYSTEM_ROLE_RENAME = 'SYSTEM_ROLE_RENAME_FORBIDDEN',
  SYSTEM_ROLE_DELETE = 'SYSTEM_ROLE_DELETE_FORBIDDEN',
  FULL_ACCESS_LOCKED = 'FULL_ACCESS_PERMISSIONS_LOCKED',
}
