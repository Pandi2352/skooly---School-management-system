import { staffPageSchema } from '../schemas/staff.schema'
import type { StaffFilters, StaffPage } from '../types/staff.types'
import { querySampleStaff, SAMPLE_STAFF_STATS } from './sample/sampleStaff'
import { staffStatsSchema } from '../schemas/staff.schema'
import type { StaffStats } from '../types/staff.types'
import { staffDetailSchema } from '../schemas/staff.schema'
import type { StaffDetail } from '../types/staff.types'
import { SAMPLE_STAFF } from './sample/sampleStaff'

const DELAY = 250

/**
 * One page of staff. The only function that knows where staff data comes from.
 * TODO(api): return api.get('/staff?…', staffPageSchema) and delete ./sample.
 */
export async function getStaff(filters: StaffFilters): Promise<StaffPage> {
  await new Promise((r) => setTimeout(r, DELAY))
  return staffPageSchema.parse(querySampleStaff(filters))
}

/**
 * Full staff profile for the detail/edit page.
 * TODO(api): return api.get(`/staff/${id}`, staffDetailSchema) and delete ./sample.
 */
export async function getStaffMember(id: string): Promise<StaffDetail> {
  await new Promise((r) => setTimeout(r, DELAY))
  const doc = SAMPLE_STAFF.find((s) => s.id === id)
  if (!doc) throw new Error(`Staff member not found: ${id}`)
  return staffDetailSchema.parse(doc)
}

/**
 * Dashboard KPI stats.
 * TODO(api): return api.get('/staff/stats', staffStatsSchema) and delete ./sample.
 */
export async function getStaffStats(): Promise<StaffStats> {
  await new Promise((r) => setTimeout(r, DELAY))
  return staffStatsSchema.parse(SAMPLE_STAFF_STATS)
}

/**
 * Create a new staff member.
 */
export async function createStaffMember(data: Omit<StaffDetail, 'id'>): Promise<StaffDetail> {
  await new Promise((r) => setTimeout(r, DELAY))
  const newStaff: StaffDetail = {
    ...data,
    id: `staff-${Date.now()}`,
  }
  SAMPLE_STAFF.unshift(newStaff)
  return staffDetailSchema.parse(newStaff)
}

/**
 * Update an existing staff profile.
 */
export async function updateStaffMember(id: string, patch: Partial<StaffDetail>): Promise<StaffDetail> {
  await new Promise((r) => setTimeout(r, DELAY))
  const index = SAMPLE_STAFF.findIndex((s) => s.id === id)
  const current = index !== -1 ? SAMPLE_STAFF[index] : undefined
  if (!current) throw new Error(`Staff member not found: ${id}`)
  const updated: StaffDetail = {
    ...current,
    ...patch,
    personalInfo: { ...current.personalInfo, ...patch.personalInfo },
    employment: { ...current.employment, ...patch.employment },
    contactInfo: { ...current.contactInfo, ...patch.contactInfo },
  }
  SAMPLE_STAFF[index] = updated
  return staffDetailSchema.parse(updated)
}

/**
 * Upload staff photo.
 */
export async function uploadStaffPhoto(id: string, photoUrl: string): Promise<StaffDetail> {
  return updateStaffMember(id, { photoUrl })
}

