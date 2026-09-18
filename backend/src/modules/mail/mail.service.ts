import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createTransport, type Transporter } from 'nodemailer'
import type { MailEnvConfig } from '../../config/env.config'
import { BrandingService } from '../branding/branding.service'
import { renderEmailHtml, renderEmailText, type EmailContent } from './templates/email-layout'

export type InvitationEmail = {
  to: string
  fullName: string
  roleName: string
  /** Link that opens the "choose your password" page. */
  actionUrl: string
  expiresInHours: number
  /** Who added the account, so the person knows the email is expected. */
  invitedBy?: string
}

export type PasswordResetEmail = {
  to: string
  fullName: string
  actionUrl: string
  expiresInMinutes: number
  /** True when an administrator started the reset, rather than the person themselves. */
  startedByAdministrator?: boolean
}

export type PasswordChangedEmail = {
  to: string
  fullName: string
  changedAt: Date
}

/**
 * Sends account emails over SMTP. Sending never throws into the request: a failed email is logged
 * and reported back as `false`, so an account is still created when the mail server is down and the
 * administrator can be told to share the link another way.
 *
 * With no SMTP_HOST configured the message is written to the log instead, so development works
 * without a mail server.
 */
@Injectable()
export class MailService implements OnModuleDestroy {
  private readonly logger = new Logger(MailService.name)
  private readonly config: MailEnvConfig
  private transporter: Transporter | null = null

  constructor(
    private readonly configService: ConfigService,
    private readonly brandingService: BrandingService,
  ) {
    this.config = this.configService.get<MailEnvConfig>('mail') ?? {
      host: '', port: 587, secure: false, user: '', password: '', from: '', enabled: false,
    }
    if (!this.config.enabled) {
      this.logger.warn('SMTP_HOST is empty: emails will be written to the log instead of sent.')
    }
  }

  onModuleDestroy(): void {
    this.transporter?.close()
    this.transporter = null
  }

  /** True when the school can actually receive email invitations right now. */
  get isEnabled(): boolean {
    return this.config.enabled
  }

  async sendInvitation(message: InvitationEmail): Promise<boolean> {
    const schoolName = await this.getSchoolName()
    const invitedBy = message.invitedBy ? ` by ${message.invitedBy}` : ''
    return this.send(message.to, `Set up your ${schoolName} account`, {
      schoolName,
      heading: `Welcome, ${message.fullName}`,
      paragraphs: [
        `An account was created for you${invitedBy} on the ${schoolName} school management system, with the role ${message.roleName}.`,
        'Choose a password to finish setting it up. After that you can sign in with this email address.',
      ],
      button: { label: 'Choose your password', url: message.actionUrl },
      footnotes: [
        `This link works for ${message.expiresInHours} hours. After that, ask an administrator to send a new one.`,
        'If you weren’t expecting this, you can ignore this email and no account will be activated.',
      ],
    })
  }

  async sendPasswordReset(message: PasswordResetEmail): Promise<boolean> {
    const schoolName = await this.getSchoolName()
    const opening = message.startedByAdministrator
      ? 'An administrator started a password reset for your account.'
      : 'We received a request to reset the password for your account.'
    return this.send(message.to, `Reset your ${schoolName} password`, {
      schoolName,
      heading: 'Reset your password',
      paragraphs: [`Hello ${message.fullName}`, opening, 'Choose a new password using the link below.'],
      button: { label: 'Choose a new password', url: message.actionUrl },
      footnotes: [
        `This link works for ${message.expiresInMinutes} minutes and can be used once.`,
        'If you didn’t ask for this, ignore this email — your current password still works.',
      ],
    })
  }

  async sendPasswordChanged(message: PasswordChangedEmail): Promise<boolean> {
    const schoolName = await this.getSchoolName()
    const changedAt = message.changedAt.toUTCString()
    return this.send(message.to, `Your ${schoolName} password was changed`, {
      schoolName,
      heading: 'Your password was changed',
      paragraphs: [
        `Hello ${message.fullName}`,
        `The password for your ${schoolName} account was changed on ${changedAt}. Any other signed-in device was signed out.`,
        'If this was you, nothing more is needed.',
      ],
      footnotes: ['If it wasn’t you, contact an administrator straight away so the account can be secured.'],
    })
  }

  private async send(to: string, subject: string, content: EmailContent): Promise<boolean> {
    if (!this.config.enabled) {
      this.logger.log(`Email not sent (SMTP is off). To: ${to} | Subject: ${subject}\n${renderEmailText(content)}`)
      return false
    }
    try {
      await this.getTransporter().sendMail({
        from: this.config.from || this.config.user,
        to,
        subject,
        text: renderEmailText(content),
        html: renderEmailHtml(content),
      })
      this.logger.log(`Email sent to ${to}: ${subject}`)
      return true
    } catch (error) {
      // The caller decides what to tell the user; the account change itself has already succeeded.
      this.logger.error(`Email to ${to} failed: ${error instanceof Error ? error.message : 'unknown error'}`)
      return false
    }
  }

  private getTransporter(): Transporter {
    this.transporter ??= createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: this.config.user ? { user: this.config.user, pass: this.config.password } : undefined,
      // One connection is reused for the few emails this app sends.
      pool: true,
      maxConnections: 1,
    })
    return this.transporter
  }

  /** The school's own name, so emails don't look like they came from the software vendor. */
  private async getSchoolName(): Promise<string> {
    try {
      const branding = await this.brandingService.getBranding()
      return branding.displayName?.trim() || 'Skooly'
    } catch {
      return 'Skooly'
    }
  }
}
