import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { FilterQuery, Model, SortOrder } from 'mongoose'
import { generateUuid } from '../../common/utils/uuid.util'
import { SEED_ADMISSION_APPLICATIONS, type AdmissionStatus } from './constants/admissions.constants'
import {
  AdmissionApplication,
  AdmissionApplicationDocument,
} from './schemas/admission-application.schema'

@Injectable()
export class AdmissionsRepository {
  constructor(
    @InjectModel(AdmissionApplication.name)
    private readonly applicationModel: Model<AdmissionApplicationDocument>,
  ) {}

  async ensureSeedData(): Promise<void> {
    const count = await this.applicationModel.countDocuments().exec()
    if (count === 0) {
      const docs = SEED_ADMISSION_APPLICATIONS.map((item) => ({
        _id: generateUuid(),
        ...item,
      }))
      await this.applicationModel.insertMany(docs)
    } else {
      for (const item of SEED_ADMISSION_APPLICATIONS) {
        await this.applicationModel.updateOne(
          { applicationNo: item.applicationNo },
          {
            $set: {
              'student.photoUrl': item.student.photoUrl,
              'student.firstName': item.student.firstName,
              'student.lastName': item.student.lastName,
              'student.gradeApplied': item.student.gradeApplied,
              'student.gender': item.student.gender,
              'student.bloodGroup': item.student.bloodGroup,
              'student.previousSchool': item.student.previousSchool,
            },
          },
        )
      }
    }
  }

  async find(
    filter: FilterQuery<AdmissionApplicationDocument>,
    skip = 0,
    limit = 20,
    sort: Record<string, SortOrder> = { appliedAt: -1, createdAt: -1 },
  ): Promise<AdmissionApplicationDocument[]> {
    return this.applicationModel.find(filter).sort(sort).skip(skip).limit(limit).exec()
  }

  async count(filter: FilterQuery<AdmissionApplicationDocument>): Promise<number> {
    return this.applicationModel.countDocuments(filter).exec()
  }

  /** Edits the applicant's own details. Status has its own path, so it can't change by accident. */
  async updateDetails(
    id: string,
    changes: Record<string, unknown>,
  ): Promise<AdmissionApplicationDocument | null> {
    return this.applicationModel.findByIdAndUpdate(id, { $set: changes }, { new: true, runValidators: true }).exec()
  }

  async deleteById(id: string): Promise<AdmissionApplicationDocument | null> {
    return this.applicationModel.findByIdAndDelete(id).exec()
  }

  async findById(id: string): Promise<AdmissionApplicationDocument | null> {
    return this.applicationModel.findById(id).exec()
  }

  async findByApplicationNo(applicationNo: string): Promise<AdmissionApplicationDocument | null> {
    return this.applicationModel.findOne({ applicationNo }).exec()
  }

  async create(data: Partial<AdmissionApplication>): Promise<AdmissionApplicationDocument> {
    return this.applicationModel.create({
      _id: generateUuid(),
      appliedAt: new Date(),
      status: 'under-review',
      ...data,
    })
  }

  async updateStatus(
    id: string,
    status: AdmissionStatus,
    reviewerNotes?: string,
  ): Promise<AdmissionApplicationDocument | null> {
    return this.applicationModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            status,
            reviewerNotes: reviewerNotes ?? '',
            reviewedAt: new Date(),
          },
        },
        { new: true, runValidators: true },
      )
      .exec()
  }

  async markEnrolled(id: string, studentId: string): Promise<AdmissionApplicationDocument | null> {
    return this.applicationModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            status: 'enrolled',
            enrolledStudentId: studentId,
            reviewedAt: new Date(),
          },
        },
        { new: true },
      )
      .exec()
  }

  /** How many applications per grade, for the grade chart. Grades with none are left out. */
  async countByGrade(): Promise<{ grade: number; count: number }[]> {
    const rows = await this.applicationModel
      .aggregate<{ _id: number; count: number }>([
        { $group: { _id: '$student.gradeApplied', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ])
      .exec()
    return rows.map((row) => ({ grade: row._id, count: row.count }))
  }

  /** Applications per day since a date, for the trend. Days with none are filled in by the caller. */
  async countByDay(since: Date): Promise<{ day: string; count: number }[]> {
    const rows = await this.applicationModel
      .aggregate<{ _id: string; count: number }>([
        { $match: { appliedAt: { $gte: since } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$appliedAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ])
      .exec()
    return rows.map((row) => ({ day: row._id, count: row.count }))
  }

  async getStats(): Promise<{
    total: number
    underReview: number
    approved: number
    enrolled: number
    rejected: number
  }> {
    const counts = await this.applicationModel.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    const stats = {
      total: 0,
      underReview: 0,
      approved: 0,
      enrolled: 0,
      rejected: 0,
    }

    for (const entry of counts) {
      stats.total += entry.count
      if (entry._id === 'under-review') stats.underReview = entry.count
      if (entry._id === 'approved') stats.approved = entry.count
      if (entry._id === 'enrolled') stats.enrolled = entry.count
      if (entry._id === 'rejected') stats.rejected = entry.count
    }

    return stats
  }
}
