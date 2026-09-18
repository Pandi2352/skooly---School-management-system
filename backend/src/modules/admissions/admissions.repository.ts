import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { FilterQuery, Model } from 'mongoose'
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
    }
  }

  async find(
    filter: FilterQuery<AdmissionApplicationDocument>,
    skip = 0,
    limit = 20,
  ): Promise<AdmissionApplicationDocument[]> {
    return this.applicationModel
      .find(filter)
      .sort({ appliedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
  }

  async count(filter: FilterQuery<AdmissionApplicationDocument>): Promise<number> {
    return this.applicationModel.countDocuments(filter).exec()
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
