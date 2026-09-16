export const customFieldKeys = {
  all: ['custom-fields'] as const,
  list: () => [...customFieldKeys.all, 'list'] as const,
}
