export const admissionKeys = {
  all: ['admissions'] as const,
  houses: () => [...admissionKeys.all, 'houses'] as const,
  feeGroups: () => [...admissionKeys.all, 'fee-groups'] as const,
  parentAccounts: () => [...admissionKeys.all, 'parent-accounts'] as const,
  nextNumbers: (grade: number | null, section: string) =>
    [...admissionKeys.all, 'next-numbers', grade, section] as const,
  pipelineList: (filters?: unknown) => [...admissionKeys.all, 'pipeline-list', filters] as const,
  pipelineStats: () => [...admissionKeys.all, 'pipeline-stats'] as const,
}
