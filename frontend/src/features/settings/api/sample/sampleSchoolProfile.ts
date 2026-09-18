import type { SchoolProfile } from '../../types/settings.types'

// SAMPLE DATA: placeholder school details until the settings API exists (antislop R-38). The page
// shows a "Sample data" label, and saving only updates this in-memory copy, which resets on reload.

let profile: SchoolProfile = {
  schoolName: 'Sample Public School',
  shortName: 'SPS',
  email: 'office@sample-school.example',
  phone: '',
  principalName: '',
  country: 'IN',
  address: '',
}

export const readSampleSchoolProfile = (): SchoolProfile => profile

export function writeSampleSchoolProfile(next: SchoolProfile): SchoolProfile {
  profile = next
  return profile
}
