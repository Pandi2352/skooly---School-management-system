import { leaveListSchema } from '../schemas/leave.schema'
import type { LeaveApplication, LeaveFilters } from '../types/staff.types'
import { SAMPLE_LEAVES } from './sample/sampleLeaves'
import { evaluationListSchema } from '../schemas/evaluation.schema'
import type { Evaluation } from '../types/staff.types'
import { jobListSchema, applicantListSchema } from '../schemas/recruitment.schema'
import type { JobPosting, JobApplicant } from '../types/staff.types'

const DELAY = 200

// ── Leaves ──────────────────────────────────────────────────────────────────

/**
 * TODO(api): return api.get('/staff/leaves?…', leaveListSchema) and delete sample.
 */
export async function getLeaves(filters: LeaveFilters): Promise<LeaveApplication[]> {
  await new Promise((r) => setTimeout(r, DELAY))
  let rows = [...SAMPLE_LEAVES]
  if (filters.staffId) rows = rows.filter((l) => l.staffId === filters.staffId)
  if (filters.leaveType) rows = rows.filter((l) => l.leaveType === filters.leaveType)
  if (filters.status) rows = rows.filter((l) => l.status === filters.status)
  return leaveListSchema.parse(rows)
}

/**
 * TODO(api): return api.post('/staff/leaves', body) and invalidate leaves.
 */
export async function createLeave(body: Omit<LeaveApplication, 'id' | 'status' | 'createdAt'>): Promise<LeaveApplication> {
  await new Promise((r) => setTimeout(r, DELAY))
  return { ...body, id: `leave-${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() }
}

/**
 * TODO(api): return api.patch(`/staff/leaves/${id}/status`, body).
 */
export async function updateLeaveStatus(
  id: string,
  status: LeaveApplication['status'],
  remarks?: string,
): Promise<LeaveApplication> {
  await new Promise((r) => setTimeout(r, DELAY))
  const found = SAMPLE_LEAVES.find((l) => l.id === id)
  if (!found) throw new Error(`Leave not found: ${id}`)
  return { ...found, status, remarks: remarks ?? '' }
}

// ── Evaluations ──────────────────────────────────────────────────────────────

const SAMPLE_EVALS: Evaluation[] = [
  {
    id: 'eval-001',
    staffId: 'staff-001',
    evaluatorRole: 'Principal',
    period: 'Annual 2025-26',
    scores: { subjectKnowledge: 5, classroomManagement: 4, communication: 4, punctuality: 5, teamwork: 4 },
    overallRating: 4.4,
    comments: 'Excellent command over subject. Students appreciate her teaching style.',
    createdAt: '2026-04-10T10:00:00.000Z',
  },
  {
    id: 'eval-002',
    staffId: 'staff-002',
    evaluatorRole: 'Principal',
    period: 'Annual 2025-26',
    scores: { subjectKnowledge: 5, classroomManagement: 3, communication: 4, punctuality: 4, teamwork: 4 },
    overallRating: 4.0,
    comments: 'Strong content knowledge; classroom management can improve.',
    createdAt: '2026-04-11T10:00:00.000Z',
  },
]

/**
 * TODO(api): return api.get('/staff/evaluations?staffId=…', evaluationListSchema).
 */
export async function getEvaluations(staffId?: string): Promise<Evaluation[]> {
  await new Promise((r) => setTimeout(r, DELAY))
  const rows = staffId ? SAMPLE_EVALS.filter((e) => e.staffId === staffId) : SAMPLE_EVALS
  return evaluationListSchema.parse(rows)
}

/**
 * TODO(api): return api.post('/staff/evaluations', body).
 */
export async function createEvaluation(body: Omit<Evaluation, 'id' | 'createdAt'>): Promise<Evaluation> {
  await new Promise((r) => setTimeout(r, DELAY))
  return { ...body, id: `eval-${Date.now()}`, createdAt: new Date().toISOString() }
}

// ── Recruitment ─────────────────────────────────────────────────────────────

const SAMPLE_JOBS: JobPosting[] = [
  {
    id: 'job-001',
    title: 'Science Teacher – Grade 9 & 10',
    department: 'Secondary',
    description: 'We are looking for a passionate Science teacher with strong communication skills and minimum 3 years teaching experience.',
    requirements: 'M.Sc. Physics or Chemistry, B.Ed., minimum 3 years experience.',
    status: 'open',
    closingDate: '2026-10-31',
    vacancies: 1,
    createdAt: '2026-09-01T09:00:00.000Z',
  },
]

const SAMPLE_APPLICANTS: JobApplicant[] = [
  {
    id: 'applicant-001',
    jobId: 'job-001',
    name: 'Ramesh Kumar',
    email: 'ramesh.kumar@gmail.com',
    phone: '+91 98765 00001',
    status: 'shortlisted',
    notes: 'Good academic background. Spoke well in telephonic screening.',
    createdAt: '2026-09-10T10:00:00.000Z',
  },
  {
    id: 'applicant-002',
    jobId: 'job-001',
    name: 'Latha Venkatesh',
    email: 'latha.v@outlook.com',
    phone: '+91 90123 45678',
    status: 'received',
    createdAt: '2026-09-15T14:00:00.000Z',
  },
]

/**
 * TODO(api): return api.get('/staff/recruitment/jobs', jobListSchema).
 */
export async function getJobs(): Promise<JobPosting[]> {
  await new Promise((r) => setTimeout(r, DELAY))
  return jobListSchema.parse(SAMPLE_JOBS)
}

/**
 * TODO(api): return api.get(`/staff/recruitment/jobs/${jobId}/applicants`, applicantListSchema).
 */
export async function getApplicants(jobId: string): Promise<JobApplicant[]> {
  await new Promise((r) => setTimeout(r, DELAY))
  return applicantListSchema.parse(SAMPLE_APPLICANTS.filter((a) => a.jobId === jobId))
}

/**
 * TODO(api): return api.post('/staff/recruitment/jobs', body).
 */
export async function createJob(body: Omit<JobPosting, 'id' | 'createdAt' | 'status'>): Promise<JobPosting> {
  await new Promise((r) => setTimeout(r, DELAY))
  return { ...body, id: `job-${Date.now()}`, status: 'open', createdAt: new Date().toISOString() }
}

/**
 * TODO(api): return api.post('/staff/recruitment/applicants', body).
 */
export async function createApplicant(body: Omit<JobApplicant, 'id' | 'createdAt' | 'status'>): Promise<JobApplicant> {
  await new Promise((r) => setTimeout(r, DELAY))
  return { ...body, id: `applicant-${Date.now()}`, status: 'received', createdAt: new Date().toISOString() }
}

/**
 * TODO(api): return api.patch(`/staff/recruitment/applicants/${id}/status`, body).
 */
export async function updateApplicantStatus(
  id: string,
  status: JobApplicant['status'],
  interviewDate?: string,
): Promise<JobApplicant> {
  await new Promise((r) => setTimeout(r, DELAY))
  const found = SAMPLE_APPLICANTS.find((a) => a.id === id)
  if (!found) throw new Error(`Applicant not found: ${id}`)
  return { ...found, status, interviewDate: interviewDate ?? null }
}
