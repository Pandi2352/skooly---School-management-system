export const authKeys = {
  all: ['auth'] as const,
  /** The signed-in person. Everything the app shows depends on this one query. */
  session: () => [...authKeys.all, 'session'] as const,
  setupState: () => [...authKeys.all, 'setup-state'] as const,
  sessions: () => [...authKeys.all, 'sessions'] as const,
}
