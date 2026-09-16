import {
  destinationInputSchema,
  destinationListSchema,
  destinationSchema,
} from '../schemas/backup.schema'
import type { Destination, DestinationInput } from '../types/backup.types'
import {
  addSampleDestination,
  readSampleDestinations,
  removeSampleDestination,
} from './sample/sampleBackups'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** TODO(api): `api.get('/backups/destinations', destinationListSchema)`. */
export async function getDestinations(): Promise<Destination[]> {
  await Promise.resolve()
  return destinationListSchema.parse(readSampleDestinations())
}

/** TODO(api): `api.post('/backups/destinations', destinationSchema, input)`. */
export async function addDestination(input: DestinationInput): Promise<Destination> {
  await wait(400)
  return destinationSchema.parse(addSampleDestination(destinationInputSchema.parse(input)))
}

/** TODO(api): `api.delete(`/backups/destinations/${id}`)`. */
export async function removeDestination(id: string): Promise<void> {
  await wait(300)
  removeSampleDestination(id)
}
