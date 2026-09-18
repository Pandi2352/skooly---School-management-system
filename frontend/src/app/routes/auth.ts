import type { RouteObject } from 'react-router-dom'
import { paths } from '@/app/paths'

// These sit outside the app layout: there is no sidebar until someone is signed in.
export const authRoutes: RouteObject[] = [
  {
    path: paths.login,
    lazy: async () => ({
      Component: (await import('@/features/auth/pages/LoginPage')).LoginPage,
    }),
  },
  {
    path: paths.setup,
    lazy: async () => ({
      Component: (await import('@/features/auth/pages/SetupPage')).SetupPage,
    }),
  },
  {
    path: paths.forgotPassword,
    lazy: async () => ({
      Component: (await import('@/features/auth/pages/ForgotPasswordPage')).ForgotPasswordPage,
    }),
  },
  // An invitation and a password reset land on the same page; the link says which it is.
  {
    path: paths.setPassword,
    lazy: async () => ({
      Component: (await import('@/features/auth/pages/SetPasswordPage')).SetPasswordPage,
    }),
  },
  {
    path: paths.resetPassword,
    lazy: async () => ({
      Component: (await import('@/features/auth/pages/SetPasswordPage')).SetPasswordPage,
    }),
  },
]
