import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.agents', '.codex', '.claude']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // FRONTEND.md: props and data shapes use `type`.
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      // `onClick={() => setOpen(true)}` is idiomatic React.
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // Logging goes through src/lib/logger.ts, which is allowed to use warn and error.
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // Routing imports come from one package (FRONTEND.md D9).
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react-router', message: "Import from 'react-router-dom' instead." },
            { name: 'react-router/dom', message: "Import from 'react-router-dom' instead." },
          ],
        },
      ],
    },
  },
])
