# Plan: Administrator & Staff Accounts (Users, Login, Access)

Status: **Phases A–D built on 2026-09-18** (accounts, sessions, sign-in, the User Accounts page).
Email is on: SMTP is configured, so invitations and password resets are emailed, and a temporary
password read out at the desk stays available as the fallback. Not yet verified by a typecheck,
lint, test or build run. Phase E (self-service reset polish) and Phase F (two-factor, audit page)
are still open.

Written 2026-09-18.
Covers: who can sign in to Skooly, how they sign in, and how a School Administrator manages those
accounts. This is the missing half of the Roles & Permissions module, which is already built but has
nobody to assign roles to.

---

## 1. What this module is

| Term | Meaning here |
|---|---|
| **User account** | A person who can sign in: their email, password, status and one role. |
| **Administrator** | A user whose role has full access (the `administrator` system role). Can manage every other account. |
| **Role** | Already built (`backend/src/modules/roles`). A user has exactly one role; the role carries the permissions. |
| **Session** | A signed-in browser. Ends at sign-out, on expiry, or when an administrator revokes it. |
| **Staff profile** | HR data (designation, joining date, payroll). **Out of scope** here; the account is only the login. A later Staff module links to a user account by id. |

**Goal:** an administrator can create an account for a colleague, choose the role, hand over or send
credentials, and later suspend, re-enable or delete it. Everyone else signs in and sees only what
their role allows.

---

## 2. Where we are today (verified in the repo)

**Works**
- Roles API with permissions, system roles, seeding and UUID ids: `backend/src/modules/roles`.
- Roles & Permissions page: `frontend/src/features/roles`.
- Permission keys built from the sidebar menu: `<module>.<page>:<action>` (`frontend/src/features/roles/utils/permissions.ts`).
- `PermissionsGuard` reads `@RequirePermissions` and can check `request.user` (`backend/src/common/guards/permissions.guard.ts`).
- One response format for success and errors, `AppException`, validation pipe, UUID pipe, file storage.

**Missing or fake**
- **No backend auth at all**: no users collection, no login endpoint, nothing sets `request.user`.
  `AUTH_ENABLED=false` therefore skips every permission check.
- **The login page is a mock** (`frontend/src/features/auth`): four demo personas, any password,
  the "user" is written to `localStorage` under `erp-auth-user`, plus a "Direct Preview: Enter
  Dashboard" link that walks straight in.
- **The user menu is hard-coded**: "Principal Sharma / admin@skooly.edu" (`app/layouts/navbar/UserMenu.tsx`).
- **No route is protected**: `/dashboard` and every settings page open without signing in.
- **The sidebar shows every page** to everyone; nothing is filtered by permission.
- **No dependencies installed** for auth: no `@nestjs/jwt`, `argon2`/`bcrypt`, `cookie-parser`, `@nestjs/throttler`, no mailer.

---

## 3. Decisions to confirm before building

I recommend the first option in each row; say the word if you want a different one.

| # | Decision | Recommended | Alternative |
|---|---|---|---|
| D1 | Session type | **httpOnly cookie session**, refreshed silently. Safer against XSS token theft, and the frontend client already sends `credentials: 'include'`. | JWT in localStorage (simpler, less safe). |
| D2 | Password storage | **argon2id** (`argon2` package). | bcrypt (older, still fine). |
| D3 | First account | **Setup screen on first run**: if no users exist, `/setup` creates the first administrator. No default password shipped. | Seed a fixed admin from `.env`. |
| D4 | New colleague's password | **Built: both.** Adding an account asks how the person gets in — an emailed invitation link, or a temporary password to read out. | — |
| D5 | Forgotten password | **Built: both.** `/forgot-password` emails a link, and an administrator can email a reset or set a temporary password. | — |
| D6 | Sign-in identifier | **Email only**, unique, case-insensitive. | Email or staff ID. |
| D7 | Menu placement | **Administration → User Accounts** (plus a shortcut in the gear menu). Sits next to Roles & Permissions. | A separate top-level "Administration" section in the sidebar. |
| D8 | Deleting accounts | **Soft delete** (status `archived`): keeps history honest for audit and "who created this student". | Hard delete. |
| D9 | Two-factor sign-in | Later (Phase F), optional per user. | Now (slows Phase A). |
| D10 | Turning on enforcement | **Flip `AUTH_ENABLED=true` at the end of Phase C**, once login, guards and the seeded administrator all work. | Enforce from day one (blocks all work in between). |

---

## 4. Data model

### 4.1 `users` collection

| Field | Type | Notes |
|---|---|---|
| `_id` | string (UUID v4) | From `BaseSchema`, never an ObjectId. |
| `email` | string | Shown as typed. |
| `emailKey` | string | Lower-cased, **unique index**. Stops duplicates under any capitalisation and in races. |
| `fullName` | string | 2–80 characters. |
| `phone` | string | Optional; same rule as elsewhere. |
| `roleId` | string (UUID) | References `roles._id`. Indexed. |
| `status` | enum | `active`, `suspended`, `archived`. Indexed. |
| `passwordHash` | string | argon2id. **Never leaves the server** (excluded from every response). |
| `passwordUpdatedAt` | Date | Used by "password changed, sign out other sessions". |
| `mustChangePassword` | boolean | True after an administrator sets a temporary password. |
| `lastLoginAt` | Date \| null | Shown in the list. |
| `failedLoginCount` | number | Reset on success. |
| `lockedUntil` | Date \| null | Set after repeated failures. |
| `avatar` | asset \| null | Optional; reuses `FILE_STORAGE` from branding. |
| `createdBy` / `updatedBy` | string \| null | User id, for audit. |
| `createdAt` / `updatedAt` | Date | From `BaseSchema`. |

Indexes: `emailKey` unique, `roleId`, `status`, `{ status: 1, fullName: 1 }` for the list.

### 4.2 `sessions` collection

`_id` (UUID), `userId`, `tokenHash` (SHA-256 of the cookie value — the raw value is never stored),
`createdAt`, `lastSeenAt`, `expiresAt`, `revokedAt`, `userAgent`, `ip`.
Indexes: `tokenHash` unique, `userId`, TTL index on `expiresAt`.

### 4.3 `audit_events` collection (small, this module only for now)

`_id`, `at`, `actorUserId`, `action` (`user.created`, `user.role_changed`, `user.suspended`,
`user.password_reset`, `auth.login_failed`, `session.revoked`…), `targetUserId`, `details` (small object), `ip`.
Feeds the existing "Audit Trail" menu entry later.

### 4.4 Rules the data must keep

- **R1** Exactly one role per user; the role must exist.
- **R2** At least one **active administrator** must remain: block suspend, archive, role change or
  self-demotion when that would leave none. Error `LAST_ADMINISTRATOR`.
- **R3** Nobody can suspend, archive or change their own role (`CANNOT_MODIFY_SELF`).
- **R4** Email unique regardless of capitals; re-using an archived user's email is refused with a
  message pointing to the archived account.
- **R5** Changing a role or suspending an account takes effect on the **next request**, not on next
  login (permissions are read from the database per request, or from a short-lived cache).

---

## 5. Security design

| Concern | Approach |
|---|---|
| Password storage | argon2id, per-password salt, tuned memory/time cost. |
| Password rules | 10+ characters, not in a small list of obvious ones (`password`, school name, email local part), no maximum under 128, no forced symbols. Strength meter in the UI, not a blocker. |
| Session cookie | httpOnly, `SameSite=Lax`, `Secure` in production, path `/`, 12-hour idle expiry, 30-day absolute expiry with "remember this workstation". Rotated on sign-in and on password change. |
| CSRF | `SameSite=Lax` plus an `X-Requested-With` check on unsafe methods. Frontend sends it from one place (the API client). |
| Brute force | Per-account: 5 failures → 15-minute lock, counter reset on success. Per-IP: `@nestjs/throttler` on `/auth/*`. Failures logged as audit events. |
| Timing | Same response time and identical message for "wrong email" and "wrong password": *"Email or password is wrong."* Never reveal which. |
| Enumeration | Any password-reset or lookup endpoint answers the same way whether or not the account exists. |
| Privilege escalation | Only `...user-accounts:edit` may change a role; assigning a **full-access** role requires the actor to hold full access themselves. |
| Sessions after sensitive changes | Password change or reset revokes that user's other sessions. Suspension revokes all of theirs at once. |
| Secrets | `SESSION_SECRET` from env; no default in production (the app refuses to start without it). |
| Logging | Never log passwords, cookie values or hashes. Audit records the action, not the secret. |

---

## 6. Backend plan (`backend/src`)

### 6.1 Dependencies to install
`argon2`, `cookie-parser`, `@nestjs/throttler`, `@types/cookie-parser` (dev).
(No JWT library needed for D1's cookie sessions.)

### 6.2 Files

```
common/
  decorators/current-user.decorator.ts     @CurrentUser() → the signed-in user
  guards/session.guard.ts                  reads the cookie → request.user; @Public() skips
  guards/permissions.guard.ts              (exists) unchanged
modules/users/
  constants/user.constants.ts              statuses, limits, permission keys, error codes
  schemas/user.schema.ts                   @Prop + @ApiProperty on every field
  dto/{create-user,update-user,change-role,set-password,list-users-query,user-response}.dto.ts
  users.repository.ts                      lean reads, unique email handling
  users.mapper.ts                          → UserResponseDto (never the hash)
  users.errors.ts                          one place for the module's errors
  users.service.ts                         rules R1–R5, argon2 hashing
  users.controller.ts                      @RequirePermissions(USER_PERMISSIONS.*)
  users.module.ts / index.ts
modules/auth/
  schemas/session.schema.ts
  dto/{login,change-password,session-response,me-response}.dto.ts
  auth.repository.ts                       sessions: create, find by token hash, revoke
  auth.service.ts                          verify, lockout, cookie issue/rotate, me
  auth.controller.ts                       @Public() on login and setup
  auth.cookie.ts                           one place for cookie name and options
  auth.module.ts / index.ts
modules/audit/                             (thin) append + list events
```

### 6.3 Endpoints

**Auth** (`/api/auth`)

| Method | Path | Access | Purpose |
|---|---|---|---|
| GET | `/auth/setup-state` | public | `{ needsSetup: boolean }` — true when no users exist. |
| POST | `/auth/setup` | public, only while `needsSetup` | Creates the first administrator. Refused (409) once any user exists. |
| POST | `/auth/login` | public, rate-limited | Body `{ email, password, rememberMe }`. Sets the cookie; returns the user, role and permissions. |
| POST | `/auth/logout` | signed in | Revokes this session and clears the cookie. |
| GET | `/auth/me` | signed in | The user, role, permissions, `mustChangePassword`. The frontend calls this on load. |
| POST | `/auth/change-password` | signed in | Current + new password. Revokes other sessions. |
| GET | `/auth/sessions` | signed in | This user's active sessions. |
| DELETE | `/auth/sessions/:id` | signed in | Sign out one of their own sessions. |

**Users** (`/api/users`) — permissions `core-setup-and-administration.user-accounts:{view,create,edit,delete}`

| Method | Path | Purpose |
|---|---|---|
| GET | `/users?search=&status=&roleId=&page=&limit=&sort=` | Paged list; `meta` carries counts per status. |
| GET | `/users/:id` | One account. |
| POST | `/users` | Create: name, email, phone, roleId, temporary password (or generated), `mustChangePassword: true`. |
| PATCH | `/users/:id` | Name, phone, email (with uniqueness check). |
| PUT | `/users/:id/role` | Change role (R2, R3, escalation rule). |
| PUT | `/users/:id/status` | `active` / `suspended` / `archived` (R2, R3). Suspending revokes sessions. |
| POST | `/users/:id/password` | Administrator sets a temporary password; revokes that user's sessions. |
| GET | `/users/:id/sessions` · DELETE `/users/:id/sessions` | View / revoke someone's sessions. |
| GET | `/users/:id/audit` | Recent events for this account. |

All responses use the existing envelope; all errors carry an `errorCode`
(`INVALID_CREDENTIALS`, `ACCOUNT_SUSPENDED`, `ACCOUNT_LOCKED`, `LAST_ADMINISTRATOR`,
`CANNOT_MODIFY_SELF`, `EMAIL_TAKEN`, `WEAK_PASSWORD`, `SETUP_ALREADY_DONE`, `SESSION_EXPIRED`).

### 6.4 Wiring
- `SessionGuard` registered globally (APP_GUARD) **before** `PermissionsGuard`; `@Public()` opens
  login, setup and branding.
- `main.ts`: `cookieParser()`, throttler on auth routes, and refuse to start in production when
  `SESSION_SECRET` is missing or `AUTH_ENABLED=false`.
- New env: `SESSION_SECRET`, `SESSION_IDLE_MINUTES`, `SESSION_ABSOLUTE_DAYS`, `LOGIN_MAX_ATTEMPTS`,
  `LOGIN_LOCK_MINUTES` — added to `.env.example` with comments.

---

## 7. Frontend plan (`frontend/src`)

### 7.1 Menu and routes
- New page under **Administration**: `builtFeature('User Accounts', 'User Accounts', paths.users)`
  → `/users`. It appears in the permission list automatically, giving the four keys above.
- Gear menu gets **User Accounts**, next to Roles & Permissions.
- Routes: `/users` (list), `/users/:id` (account detail), `/login`, `/setup`,
  `/account` (my profile, password, my sessions).

### 7.2 Feature folders

```
features/auth/          (rewrite of the current mock)
  api/auth.ts           login, logout, me, change password, sessions, setup state
  hooks/useSession.ts   the signed-in user via TanStack Query
  components/           LoginForm, SetupForm, MustChangePasswordDialog, SessionList
  pages/                LoginPage (keep the look, drop demo personas), SetupPage, AccountPage
  guards/RequireAuth.tsx, guards/RequirePermission.tsx
features/users/
  api/users.ts, api/userKeys.ts
  hooks/useUsers.ts, useUser.ts, useUserMutations.ts, useUserFilters.ts (URL state)
  utils/userRules.ts    pure: canSuspend, canChangeRole, isLastAdministrator, password strength
  components/           UsersToolbar, UsersTable, UserStatusBadge, UserRowActions,
                        UserFormDialog, SetPasswordDialog, ChangeRoleDialog, UserSessionsCard,
                        UserAuditList, UserSummaryCards
  pages/UsersPage.tsx, UserDetailPage.tsx
```

### 7.3 Screens

**Login** — keep today's layout and branding; remove the demo personas, the pre-filled password and
the "Direct Preview" link. Add: real errors from the API, locked-account message with the time,
"remember this workstation", and a forced password change when `mustChangePassword` is true.

**Setup (first run)** — shown when `needsSetup`: school display name (writes branding), the
administrator's name, email and password, with the strength meter. Ends signed in.

**User Accounts (list)** — search (name, email), filters (status, role), sort, pagination, all in the
URL. Columns: person (avatar, name, email), role, status, last sign-in, actions. Row actions: edit
details, change role, set temporary password, suspend / re-enable, archive, view sessions. Summary
chips: active, suspended, archived, administrators. Empty state invites the first colleague.

**Account detail** — profile, role with history, status, sessions (device, last seen, revoke),
recent audit events, danger zone (archive).

**My account** (`/account`) — own name and phone, change password, my sessions with "sign out
everywhere else".

**Navbar user menu** — real name, email and role from `/auth/me`; sign-out calls the API.

### 7.4 App-wide behaviour
- `AuthProvider` + `RequireAuth` wrap the app layout; a signed-out visitor lands on `/login?next=…`.
- A 401 from any request clears the session cache and redirects to `/login` once (no loop).
- **The sidebar filters by permission**: pages the role can't view disappear; `RequirePermission`
  guards the route as well, so a typed URL shows a clear "no access" page, not a blank one.
- Sign-out clears the TanStack Query cache so no other person's data is left behind.

---

## 8. Build order

| Phase | What ships | Done when |
|---|---|---|
| ~~A. Backend accounts~~ **built** | users module, argon2id (`@node-rs/argon2`), rules R1–R5, endpoints, Swagger | An administrator created through Swagger can be listed and updated; last-administrator rule proven by hand. |
| ~~B. Backend sessions~~ **built** | auth module, cookie sessions, lockout, throttling, `/auth/me`, setup, SMTP email | Login sets a cookie; `/auth/me` returns role and permissions; brute force locks. |
| ~~C. Frontend sign-in~~ **built** | `useSession`, RequireAuth, real LoginPage, SetupPage, user menu, 401 handling. `AUTH_ENABLED` is still `false` — flip it once the first administrator exists | Nobody reaches a page without signing in; demo personas are gone. |
| ~~D. Frontend accounts~~ **built** | Users list and detail, all dialogs, my account page, permission-filtered sidebar | An administrator can run the whole lifecycle from the UI. |
| **E. Email polish** | SMTP is wired and sending; what remains is checking deliverability and the from-address | A colleague can be invited and can reset their own password. |
| **F. Extras** | Two-factor, audit trail page, session policy settings | — |

Phases A–D are the module; E and F are follow-ups.

---

## 9. Testing

- **Backend:** no spec files (project rule). Verify by hand through Swagger with a written checklist
  per phase: wrong password, locked account, suspended user, last administrator, self-change,
  duplicate email, expired cookie, permission denied.
- **Frontend (Vitest):** pure rules in `utils/userRules.ts`; the users list (filters, empty state);
  the user form (validation, duplicate email from the server); login (error messages, forced password
  change); `RequireAuth` redirect; sidebar filtering by permission.
- **Accessibility:** labels on every field, errors tied to inputs, focus moved to the first error,
  dialogs trap focus, status badges readable without colour, contrast checked.

---

## 10. Risks

| Risk | Mitigation |
|---|---|
| Locking everyone out when `AUTH_ENABLED` flips | Flip only after Phase C works, and after the setup screen has created a real administrator. Keep a documented recovery command. |
| The mock login hides the change from testers | Remove the demo personas and the preview link in the same change that enables real login. |
| Permission keys drift from the menu | Keys keep coming from `config/navigation.ts`; the new page adds its own. |
| Sessions outliving a suspension | Suspension revokes sessions immediately, and every request re-reads status and permissions. |
| Existing localStorage `erp-auth-user` misleads the app | Delete that key on first load after the change. |

---

## 11. Open questions for you

1. **D3/D4**: first-run setup screen and administrator-set temporary passwords — good, or do you want
   email invitations from the start (needs SMTP details)?
2. **Menu name**: "User Accounts" under Administration, or "Staff Logins", or your own wording?
3. **Session length**: 12-hour idle / 30-day "remember" — or shorter for a school office?
4. **Staff link**: should a user account be created from the future Staff module (one person, one
   record), or stay separate for now?
