export const customFieldKeys = {
  all: ['custom-fields'] as const,
  list: () => [...customFieldKeys.all, 'list'] as const,
  /** What the admission form asks; a different endpoint, so a different key. */
  active: () => [...customFieldKeys.all, 'active'] as const,
}
