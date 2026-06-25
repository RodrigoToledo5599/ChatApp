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
  access_token: string
  refresh_token: string
}

export interface LoginReturn {
  user: UserLoginReturn
  access_token: string
  refresh_token: string
}
