import { HttpStatus } from '@nestjs/common'
import { AppException } from '../../common/exceptions/app.exception'

// One place for every admissions error, so codes and wording stay consistent.

export enum AdmissionErrorCode {
  NOT_FOUND = 'ADMISSION_NOT_FOUND',
  NO_CHANGES = 'ADMISSION_NO_CHANGES',
  ENROLLED_CANNOT_DELETE = 'ADMISSION_ENROLLED_CANNOT_DELETE',
}

export const applicationNotFound = (id: string) =>
  new AppException(HttpStatus.NOT_FOUND, AdmissionErrorCode.NOT_FOUND, `No admission application found with id "${id}".`)

export const noApplicationChanges = () =>
  new AppException(
    HttpStatus.BAD_REQUEST,
    AdmissionErrorCode.NO_CHANGES,
    'Nothing was changed. Edit a detail and save again.',
  )

export const cannotDeleteEnrolled = (applicationNo: string) =>
  new AppException(
    HttpStatus.UNPROCESSABLE_ENTITY,
    AdmissionErrorCode.ENROLLED_CANNOT_DELETE,
    `${applicationNo} has already been enrolled, so it can't be deleted. The student record points back to it.`,
  )
