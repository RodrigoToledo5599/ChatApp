// Auth ==================================================================================================================================

export interface LoginParams {
  email: string,
  password: string
}

export interface User{
  id: string
  name: string
  email: string
}

export interface UserLoginReturn {
  user: User
}
