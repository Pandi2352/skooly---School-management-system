export type ErpRole = 'admin' | 'teacher' | 'accountant' | 'registrar'

export type DemoCredential = {
  role: ErpRole
  label: string
  subtitle: string
  email: string
  name: string
  avatar: string
}
