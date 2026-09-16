import { ConfigService } from '@nestjs/config'
import { getCorsConfig } from './cors.config'

describe('CorsConfig', () => {
  let configService: ConfigService

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        if (key === 'app.corsOrigins') {
          return ['http://localhost:5173', 'http://127.0.0.1:5173']
        }
        if (key === 'app.corsCredentials') {
          return true
        }
        return undefined
      }),
    } as unknown as ConfigService
  })

  it('should allow whitelisted origin', (done) => {
    const corsOptions = getCorsConfig(configService)
    if (typeof corsOptions.origin === 'function') {
      corsOptions.origin('http://localhost:5173', (err, allow) => {
        expect(err).toBeNull()
        expect(allow).toBe(true)
        done()
      })
    } else {
      done.fail('origin is not a function')
    }
  })

  it('should block non-whitelisted origin', (done) => {
    const corsOptions = getCorsConfig(configService)
    if (typeof corsOptions.origin === 'function') {
      corsOptions.origin('http://malicious-site.com', (err, allow) => {
        expect(err).toBeDefined()
        expect(allow).toBe(false)
        done()
      })
    } else {
      done.fail('origin is not a function')
    }
  })

  it('should allow requests with no origin (e.g. server-to-server or mobile)', (done) => {
    const corsOptions = getCorsConfig(configService)
    if (typeof corsOptions.origin === 'function') {
      corsOptions.origin(undefined, (err, allow) => {
        expect(err).toBeNull()
        expect(allow).toBe(true)
        done()
      })
    } else {
      done.fail('origin is not a function')
    }
  })
})
