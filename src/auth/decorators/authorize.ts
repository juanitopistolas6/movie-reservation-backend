import { SetMetadata } from '@nestjs/common'
import { TypeUser } from 'src/users/interfaces'

export const ROLE_KEY = 'role'

export const Authorization = (...roles: TypeUser[]) =>
  SetMetadata(ROLE_KEY, roles)
