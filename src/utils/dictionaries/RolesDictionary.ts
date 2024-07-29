import { Role } from '@prisma/client'

export const RolesDictionary = {
  [Role.RESEARCHER]: 'Investigador',
  [Role.SCIENTIST]: 'Evaluador',
  [Role.METHODOLOGIST]: 'Metodólogo',
  [Role.SECRETARY]: 'Secretario de Investigación',
  [Role.ADMIN]: 'Administrador',
} as const

export const RolesColorDictionary = {
  [Role.RESEARCHER]: 'sky',
  [Role.SCIENTIST]: 'violet',
  [Role.METHODOLOGIST]: 'lime',
  [Role.SECRETARY]: 'cyan',
  [Role.ADMIN]: 'amber',
} as const
