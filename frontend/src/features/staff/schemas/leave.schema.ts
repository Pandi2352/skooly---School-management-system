import { z } from 'zod'
import { LEAVE_STATUSES, LEAVE_TYPES } from '../constants'

export const leaveApplicationSchema = z.object({
  id: z.string(),
  staffId: z.string(),
  staffName: z.string().optional(),
  leaveType: z.enum(LEAVE_TYPES),
  fromDate: z.string(),
  toDate: z.string(),
  days: z.number(),
  reason: z.string(),
  status: z.enum(LEAVE_STATUSES),
  approvedBy: z.string().nullable().optional(),
  approvedAt: z.string().nullable().optional(),
  remarks: z.string().optional(),
  createdAt: z.string().optional(),
})

export const leaveListSchema = z.array(leaveApplicationSchema)
