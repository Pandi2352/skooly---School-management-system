// `theme`, `colorTheme` and `schoolColorTheme` are also read by the inline script in index.html;
// change both together.
export const STORAGE_KEYS = {
  theme: 'erp-theme',
  colorTheme: 'erp-color-theme',
  /** The school's default colour from Branding, cached for the first paint. */
  schoolColorTheme: 'erp-school-color-theme',
  sidebarCollapsed: 'erp-sidebar-collapsed',
  studentHiddenColumns: 'erp-student-hidden-columns',
} as const
