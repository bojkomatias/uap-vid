import { Role } from '@prisma/client'

export default async function Page() {
  const sape = Role
  return JSON.stringify(Object.values(sape), null, 2)
}
