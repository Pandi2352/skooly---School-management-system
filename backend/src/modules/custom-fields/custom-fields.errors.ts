import { HttpStatus } from '@nestjs/common'
import { AppException } from '../../common/exceptions/app.exception'
import { CUSTOM_FIELD_LIMITS, CustomFieldErrorCode } from './constants/custom-field.constants'

// One place for every custom field error, so codes and wording stay consistent.

export const fieldNotFound = (id: string) =>
  new AppException(HttpStatus.NOT_FOUND, CustomFieldErrorCode.NOT_FOUND, `No custom field found with id "${id}".`)

export const labelTaken = (label: string) =>
  new AppException(HttpStatus.CONFLICT, CustomFieldErrorCode.LABEL_TAKEN, `This form already asks "${label}".`, [
    { field: 'label', message: 'Use a different wording, or edit the existing question.' },
  ])

export const optionsRequired = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    CustomFieldErrorCode.OPTIONS_REQUIRED,
    `A dropdown needs at least ${CUSTOM_FIELD_LIMITS.optionsMin} choices. With one, it isn't a question.`,
    [{ field: 'options', message: `Add at least ${CUSTOM_FIELD_LIMITS.optionsMin} choices.` }],
  )

export const tooManyFields = () =>
  new AppException(
    HttpStatus.UNPROCESSABLE_ENTITY,
    CustomFieldErrorCode.TOO_MANY_FIELDS,
    `This form already has ${CUSTOM_FIELD_LIMITS.fieldsPerForm} extra questions, which is as many as it can carry. Remove one first.`,
  )

export const noFieldChanges = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    CustomFieldErrorCode.NO_CHANGES,
    'Nothing was changed. Edit the question and save again.',
  )

export const alreadyAtEdge = (direction: 'up' | 'down') =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    CustomFieldErrorCode.ALREADY_AT_EDGE,
    `This question is already ${direction === 'up' ? 'first' : 'last'}.`,
  )
