import { Role } from '@prisma/client'

export default {
  [Role.RESEARCHER]: 'Investigador',
  [Role.SCIENTIST]: 'Evaluador',
  [Role.METHODOLOGIST]: 'Metodólogo',
  [Role.SECRETARY]: 'Secretario de Investigación',
  [Role.ADMIN]: 'Administrador',
} as const
