import { describe, expect, it } from 'vitest'
import { ApiError } from './ApiError'

const jsonResponse = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

describe('ApiError.fromResponse', () => {
  it('reads NestJS validation messages', async () => {
    const error = await ApiError.fromResponse(
      jsonResponse({ statusCode: 400, message: ['name should not be empty'] }, 400),
    )
    expect(error.status).toBe(400)
    expect(error.messages).toEqual(['name should not be empty'])
    expect(error.message).toBe('name should not be empty')
  })

  it('reads a single message string', async () => {
    const error = await ApiError.fromResponse(jsonResponse({ message: 'Forbidden resource' }, 403))
    expect(error.messages).toEqual(['Forbidden resource'])
  })

  it('falls back to the status text when the body is not JSON', async () => {
    const error = await ApiError.fromResponse(
      new Response('<html>Bad gateway</html>', { status: 502, statusText: 'Bad Gateway' }),
    )
    expect(error.messages).toEqual(['Bad Gateway'])
  })
})
