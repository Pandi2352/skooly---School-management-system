import type { SystemSettings } from '../../types/settings.types'

// SAMPLE DATA: placeholder formats until the settings API exists (antislop R-38). Saving only
// updates this in-memory copy, which resets on reload; the save message says so.

let settings: SystemSettings = {
  schoolCode: '',
  affiliatedBy: '',
  currency: 'INR',
  receiptTemplate: 'standard-a4',
  feeReceipt: {
    prefix: 'SPS',
    separator: 'slash',
    padding: '3',
    includeSession: true,
    sessionFormat: 'full',
    includeDate: true,
    dateFormat: 'yy',
    nextNumber: 1,
  },
  admission: {
    prefix: 'SPS',
    separator: 'slash',
    padding: '4',
    includeSession: true,
    sessionFormat: 'full',
    includeDate: true,
    dateFormat: 'monyy',
    nextNumber: 1,
  },
  roll: {
    prefix: 'ROLL',
    separator: 'slash',
    padding: '3',
    includeSession: true,
    sessionFormat: 'short',
  },
}

export const readSampleSystemSettings = (): SystemSettings => settings

export function writeSampleSystemSettings(next: SystemSettings): SystemSettings {
  settings = next
  return settings
}
