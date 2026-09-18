/**
 * Creates (or resets) an administrator account straight in the database.
 *
 * The normal way in is the first-run /setup page, and after that an administrator invites everyone
 * else. This script exists for the two cases that can't use either: setting up a local machine for
 * testing, and getting back in when the last administrator account is locked out.
 *
 * It deliberately skips the password rules the API enforces, so it can set a short password for
 * testing. That is also why it should never be pointed at a school's real database.
 *
 * Usage:  node scripts/create-administrator.js <email> <password> ["Full Name"]
 */

const { randomUUID } = require('node:crypto')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { MongoClient } = require('mongodb')
const { hash } = require('@node-rs/argon2')

const ARGON2_OPTIONS = { memoryCost: 19456, timeCost: 2, parallelism: 1 }

/** Reads .env without pulling in a library; only KEY=value lines, no expansion. */
function readEnv(file) {
  try {
    return readFileSync(resolve(__dirname, '..', file), 'utf8')
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .reduce((env, line) => {
        const index = line.indexOf('=')
        env[line.slice(0, index).trim()] = line.slice(index + 1).trim()
        return env
      }, {})
  } catch {
    return {}
  }
}

async function main() {
  const [email, password, fullName = 'Administrator'] = process.argv.slice(2)
  if (!email || !password) {
    console.error('Usage: node scripts/create-administrator.js <email> <password> ["Full Name"]')
    process.exit(1)
  }

  const env = { ...readEnv('.env'), ...process.env }
  const uri = env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skooly_erp'
  const client = new MongoClient(uri)

  await client.connect()
  const db = client.db(env.MONGODB_DB_NAME || undefined)
  const roles = db.collection('roles')
  const users = db.collection('users')
  const now = new Date()

  // The app seeds system roles when it starts, but this script has to work on an empty database too.
  let administrator = await roles.findOne({ code: 'administrator' })
  if (!administrator) {
    administrator = {
      _id: randomUUID(),
      code: 'administrator',
      name: 'Administrator',
      nameKey: 'administrator',
      description: 'Runs the school’s system: every page, every action.',
      kind: 'system',
      fullAccess: true,
      permissions: [],
      createdAt: now,
      updatedAt: now,
    }
    await roles.insertOne(administrator)
    console.log('Created the Administrator role.')
  }

  const emailKey = email.trim().toLowerCase()
  const passwordHash = await hash(password, ARGON2_OPTIONS)
  const existing = await users.findOne({ emailKey })

  if (existing) {
    await users.updateOne(
      { _id: existing._id },
      {
        $set: {
          passwordHash,
          passwordUpdatedAt: now,
          mustChangePassword: false,
          roleId: administrator._id,
          status: 'active',
          failedLoginCount: 0,
          lockedUntil: null,
          updatedAt: now,
        },
      },
    )
    // Any session or emailed link from before this reset must stop working.
    await db.collection('sessions').updateMany(
      { userId: existing._id, revokedAt: null },
      { $set: { revokedAt: now, revokedReason: 'Password reset from the server' } },
    )
    await db.collection('user_tokens').updateMany({ userId: existing._id, usedAt: null }, { $set: { usedAt: now } })
    console.log(`Reset ${email} as an administrator.`)
  } else {
    await users.insertOne({
      _id: randomUUID(),
      fullName,
      email: email.trim(),
      emailKey,
      phone: '',
      designation: '',
      roleId: administrator._id,
      status: 'active',
      passwordHash,
      passwordUpdatedAt: now,
      mustChangePassword: false,
      lastLoginAt: null,
      failedLoginCount: 0,
      lockedUntil: null,
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorConfirmedAt: null,
      twoFactorRecoveryHashes: [],
      invitedAt: null,
      activatedAt: now,
      createdBy: null,
      updatedBy: null,
      createdAt: now,
      updatedAt: now,
    })
    console.log(`Created ${email} as an administrator.`)
  }

  // Recorded like any other change, so the trail doesn't have a silent gap where this account began.
  await db.collection('audit_events').insertOne({
    _id: randomUUID(),
    action: existing ? 'user.temporary_password_set' : 'user.created',
    actorId: null,
    actorName: 'Server script',
    targetUserId: existing ? existing._id : null,
    targetName: fullName,
    summary: 'Administrator set from scripts/create-administrator.js',
    ip: '',
    userAgent: '',
    createdAt: now,
    updatedAt: now,
  })

  await client.close()
  console.log(`Sign in at the web app with ${email}.`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
