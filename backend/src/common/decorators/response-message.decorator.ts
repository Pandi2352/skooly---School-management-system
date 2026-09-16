import { SetMetadata } from '@nestjs/common'

export const RESPONSE_MESSAGE_KEY = 'responseMessage'

/**
 * Sets the `message` of a handler's success response.
 * Example: `@ResponseMessage('Role created successfully.')`
 */
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE_KEY, message)
