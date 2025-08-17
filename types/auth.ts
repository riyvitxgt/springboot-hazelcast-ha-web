export interface User {
  id: number
  username: string
  email: string
  roles: Role[]
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: number
  name: string
  code: string
  description?: string
  permissions: Permission[]
}

export interface Permission {
  id: number
  name: string
  code: string
  resource: string
  action: string
  description?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: User
  expiresIn: number
}

export interface MenuItem {
  title: string
  icon: string
  to?: string
  children?: MenuItem[]
  permission?: string
  roles?: string[]
}