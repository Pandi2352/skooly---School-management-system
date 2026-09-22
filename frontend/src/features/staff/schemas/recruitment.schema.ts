import { z } from 'zod'
import { APPLICANT_STATUSES, DEPARTMENTS, JOB_STATUSES } from '../constants'

export const jobPostingSchema = z.object({
  id: z.string(),
  title: z.string(),
  department: z.enum(DEPARTMENTS),
  description: z.string(),
  requirements: z.string().optional(),
  status: z.enum(JOB_STATUSES),
  closingDate: z.string().nullable().optional(),
  vacancies: z.number().int().min(1),
  createdAt: z.string().optional(),
})

export const jobListSchema = z.array(jobPostingSchema)

export const jobApplicantSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  resumeUrl: z.string().optional(),
  status: z.enum(APPLICANT_STATUSES),
  interviewDate: z.string().nullable().optional(),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
})

export const applicantListSchema = z.array(jobApplicantSchema)
