import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomInt } from 'node:crypto'
import { Secret, TOTP } from 'otpauth'
import { toDataURL } from 'qrcode'
import { openSecret, sealSecret } from '../../common/utils/secret-box.util'
import { hashSecretToken } from '../../common/utils/token.util'
import type { AuthEnvConfig } from '../../config/env.config'
import { BrandingService } from '../branding/branding.service'
import type { UserRecord } from '../users/users.repository'
import { UsersRepository } from '../users/users.repository'
import { twoFactorCodeWrong, twoFactorNotConfigured, twoFactorUnavailable } from './auth.errors'
import type { TwoFactorSetupDto } from './dto/two-factor.dto'

/**
 * Codes are six digits over a 30-second step (RFC 6238), which is what every authenticator app
 * expects. Verification accepts the step either side of now, so a phone whose clock is a few
 * seconds out still works.
 */
const TOTP_SETTINGS = { algorithm: 'SHA1', digits: 6, period: 30 } as const
const ACCEPTED_DRIFT = 1

const RECOVERY_CODE_COUNT = 10
// No look-alike characters: these get written on paper and typed back months later.
const RECOVERY_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

/**
 * Two-step sign-in: the password proves what someone knows, the code proves what they hold. The
 * seed is encrypted with TWO_FACTOR_KEY, because unlike a password it has to be read back to check
 * a code — hashing it would make it useless.
 */
@Injectable()
export class TwoFactorService {
  private readonly logger = new Logger(TwoFactorService.name)

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly brandingService: BrandingService,
    private readonly configService: ConfigService,
  ) {}

  private get auth(): AuthEnvConfig {
    return this.configService.getOrThrow<AuthEnvConfig>('auth')
  }

  /** False when no key is configured, in which case two-step sign-in can't be offered at all. */
  get isAvailable(): boolean {
    return this.auth.twoFactorKey.length > 0
  }

  /**
   * Starts enrolment: a new seed, a QR code to scan and the same seed in text for anyone typing it
   * in by hand. Nothing is switched on until a code from the app proves the seed arrived intact.
   */
  async startSetup(user: UserRecord): Promise<TwoFactorSetupDto> {
    if (!this.isAvailable) throw twoFactorUnavailable()

    const secret = new Secret({ size: 20 })
    const totp = await this.buildTotp(user, secret)
    const otpauthUrl = totp.toString()

    // Kept as "pending" on the account: switched on only by confirmSetup below.
    await this.usersRepository.updateById(user._id, {
      twoFactorSecret: sealSecret(secret.base32, this.auth.twoFactorKey),
      twoFactorEnabled: false,
      twoFactorConfirmedAt: null,
    })

    return {
      secret: secret.base32,
      otpauthUrl,
      qrCodeDataUrl: await toDataURL(otpauthUrl, { margin: 1, width: 240 }),
    }
  }

  /**
   * Finishes enrolment. The recovery codes are returned once and stored only as hashes, so they can
   * be checked later but never read back — the same reasoning as a password.
   */
  async confirmSetup(user: UserRecord, code: string): Promise<string[]> {
    const secret = this.readSecret(user)
    if (!secret) throw twoFactorNotConfigured()
    if (!this.isCodeValid(secret, code)) throw twoFactorCodeWrong()

    const recoveryCodes = Array.from({ length: RECOVERY_CODE_COUNT }, () => generateRecoveryCode())
    await this.usersRepository.updateById(user._id, {
      twoFactorEnabled: true,
      twoFactorConfirmedAt: new Date(),
      twoFactorRecoveryHashes: recoveryCodes.map(hashSecretToken),
    })
    this.logger.log(`Two-step sign-in switched on for ${user.email}`)
    return recoveryCodes
  }

  /** Replaces the recovery codes, for someone who has used or lost theirs. */
  async regenerateRecoveryCodes(user: UserRecord): Promise<string[]> {
    if (!user.twoFactorEnabled) throw twoFactorNotConfigured()
    const recoveryCodes = Array.from({ length: RECOVERY_CODE_COUNT }, () => generateRecoveryCode())
    await this.usersRepository.updateById(user._id, {
      twoFactorRecoveryHashes: recoveryCodes.map(hashSecretToken),
    })
    return recoveryCodes
  }

  /** Switches it off and forgets the seed, so turning it back on starts from a fresh QR code. */
  async disable(user: UserRecord): Promise<void> {
    await this.usersRepository.updateById(user._id, {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorConfirmedAt: null,
      twoFactorRecoveryHashes: [],
    })
    this.logger.log(`Two-step sign-in switched off for ${user.email}`)
  }

  /**
   * Checks a code at sign-in: either from the app, or one of the recovery codes, which is used up
   * in the process. Returns how it was accepted, so the person can be told a code was spent.
   */
  async verifySignIn(user: UserRecord, code: string): Promise<'app' | 'recovery'> {
    const cleaned = code.replace(/[\s-]/g, '').toUpperCase()
    const secret = this.readSecret(user)

    if (secret && this.isCodeValid(secret, cleaned)) return 'app'

    const usedHash = hashSecretToken(cleaned)
    const recoveryHashes = user.twoFactorRecoveryHashes ?? []
    if (recoveryHashes.includes(usedHash)) {
      await this.usersRepository.updateById(user._id, {
        twoFactorRecoveryHashes: recoveryHashes.filter((hash) => hash !== usedHash),
      })
      this.logger.warn(`A recovery code was used to sign in as ${user.email}`)
      return 'recovery'
    }

    throw twoFactorCodeWrong()
  }

  /** How many recovery codes are left, for the warning when they are running out. */
  countRecoveryCodes(user: UserRecord): number {
    return user.twoFactorRecoveryHashes?.length ?? 0
  }

  private readSecret(user: UserRecord): Secret | null {
    if (!user.twoFactorSecret || !this.isAvailable) return null
    const base32 = openSecret(user.twoFactorSecret, this.auth.twoFactorKey)
    if (!base32) {
      // Almost always TWO_FACTOR_KEY having changed; the seed is unreadable and must be set up again.
      this.logger.error(`Could not read the two-step seed for ${user.email}. Has TWO_FACTOR_KEY changed?`)
      return null
    }
    return Secret.fromBase32(base32)
  }

  private isCodeValid(secret: Secret, code: string): boolean {
    const cleaned = code.replace(/\s/g, '')
    if (!/^\d{6}$/.test(cleaned)) return false
    const totp = new TOTP({ ...TOTP_SETTINGS, secret })
    return totp.validate({ token: cleaned, window: ACCEPTED_DRIFT }) !== null
  }

  /** The label a person sees in their authenticator app: the school's name, then their email. */
  private async buildTotp(user: UserRecord, secret: Secret): Promise<TOTP> {
    let issuer = 'Skooly'
    try {
      issuer = (await this.brandingService.getBranding()).displayName?.trim() || issuer
    } catch {
      // Branding is optional here; the default keeps enrolment working.
    }
    return new TOTP({ ...TOTP_SETTINGS, issuer, label: user.email, secret })
  }
}

/** Grouped as XXXX-XXXX so it can be read aloud and written down without losing a character. */
function generateRecoveryCode(): string {
  const pick = () => RECOVERY_ALPHABET[randomInt(RECOVERY_ALPHABET.length)]
  const block = () => Array.from({ length: 4 }, pick).join('')
  return `${block()}-${block()}`
}
