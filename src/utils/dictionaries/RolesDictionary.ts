import { Role } from '@prisma/client'

export default {
    [Role.RESEARCHER]: 'Investigador',
    [Role.SCIENTIST]: 'Evaluador',
    [Role.METHODOLOGIST]: 'Metodólogo',
    [Role.SECRETARY]: 'Secretario de Investigación',
    [Role.ADMIN]: 'Administrador',
} as const

/** Made this helper function to help me retrieve the value of one of these items given a key */
export function getValueByKey<T extends Record<string, string | symbol>>(
    obj: T,
    key: keyof T | string
): T[keyof T] | undefined {
    return obj[key as keyof T]
}
