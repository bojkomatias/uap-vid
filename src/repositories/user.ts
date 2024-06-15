'use server'

import type { User } from '@prisma/client'
import { Role } from '@prisma/client'
import { cache } from 'react'
import { prisma } from '../utils/bd'
import { orderByQuery } from '@utils/query-helper/orderBy'
import { createHashScrypt, verifyHashScrypt } from '@utils/hash'

/** This query returns all users that match the filtering criteria. The criteria includes:

 * @param records this is the amount of records shown in the table at once.
 * @param page necessary for pagination, the total amount of pages is calculated using the records number. Defaults to 1.
 * @param search string that, for now, only searches the name of the user, which is defined as insensitive.
 * @param sort this is the key which will be used to order the records.
 * @param order this is the type of ordering which will be used: asc or desc. Always present when a key is given to the order param.
 *
 */

const getUsers = cache(
  async ({
    records = '5',
    page = '1',
    search,
    sort,
    order,
    filter,
    values,
  }: {
    [key: string]: string
  }) => {
    try {
      const orderBy = order && sort ? orderByQuery(sort, order) : {}

      return await prisma.$transaction([
        prisma.user.count({
          where: {
            AND: [
              search ?
                {
                  OR: [
                    {
                      name: {
                        contains: search,
                        mode: 'insensitive',
                      },
                    },
                    {
                      email: {
                        contains: search,
                        mode: 'insensitive',
                      },
                    },
                  ],
                }
              : {},
              filter && values ? { [filter]: { in: values.split('-') } } : {},
            ],
          },
        }),
        prisma.user.findMany({
          skip: Number(records) * (Number(page) - 1),
          take: Number(records),
          // Grab the model, and  bring relational data
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
            lastLogin: true,
            image: true,
            AcademicUnitIds: true,
            _count: true,
          },
          // Add all the globally searchable fields
          where: {
            AND: [
              search ?
                {
                  OR: [
                    {
                      name: {
                        contains: search,
                        mode: 'insensitive',
                      },
                    },
                    {
                      email: {
                        contains: search,
                        mode: 'insensitive',
                      },
                    },
                  ],
                }
              : {},
              filter && values ? { [filter]: { in: values.split('-') } } : {},
            ],
          },

          orderBy,
        }),
      ])
    } catch (error) {
      return []
    }
  }
)
/** Posible protocol owners */
const getAllOwners = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['RESEARCHER', 'METHODOLOGIST', 'SECRETARY', 'ADMIN'],
        },
      },
    })
    return users
  } catch (error) {
    return []
  }
}
const getAllNonTeamMembers = async (teamMemberId?: string) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { memberDetails: null },
          teamMemberId ? { memberDetails: { id: teamMemberId } } : {},
        ],
      },
    })
    return users
  } catch (error) {
    return []
  }
}

const getAllUsersWithoutResearchers = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: Role.RESEARCHER,
        },
      },
    })
    return users
  } catch (error) {
    return null
  }
}

const getAllSecretaries = cache(async () => {
  try {
    const secretaries = await prisma.user.findMany({
      where: { role: Role.SECRETARY },
    })
    return secretaries
  } catch (error) {
    return null
  }
})

const findUserById = cache(async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    return user
  } catch (error) {
    return null
  }
})

const findUserByEmail = cache(
  async (email: string) =>
    await prisma.user.findUnique({
      where: {
        email,
      },
    })
)

const updateUserById = async (id: string, data: User) => {
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
    })
    return user
  } catch (error) {
    return null
  }
}

const updateUserRoleById = async (id: string, role: Role) => {
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: { role },
    })
    return user
  } catch (error) {
    return null
  }
}

const updateUserByEmail = async (email: string, data: User) => {
  try {
    const user = await prisma.user.update({
      where: {
        email,
      },
      data,
    })
    return user
  } catch (error) {
    return null
  }
}
const updateUserEmailById = async (id: string, email: string) => {
  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        email: email,
      },
    })

    return user
  } catch (error) {
    return null
  }
}

const updateUserPasswordById = async ({
  id,
  currentPassword,
  currentPasswordHash,
  newPassword,
}: {
  id: string
  currentPassword: string
  currentPasswordHash: string
  newPassword: string
}) => {
  // Check if match
  const passwordCheck = await verifyHashScrypt(
    currentPassword,
    currentPasswordHash
  )

  if (!passwordCheck) return null

  // Hash new one
  const newPasswordHash = await createHashScrypt(newPassword)

  try {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: newPasswordHash,
      },
    })

    return user
  } catch (error) {
    return null
  }
}

const saveUser = async (data: {
  name: string
  email: string
  image?: string | null
  password?: string
  role: Role
  lastLogin?: Date
}) => {
  try {
    const user = await prisma.user.create({
      data,
    })
    return user
  } catch (error) {
    return null
  }
}

const deleteUserById = async (id: string) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id,
      },
    })
    return user.id
  } catch (error) {
    return null
  }
}

export {
  getUsers,
  getAllOwners,
  getAllUsersWithoutResearchers,
  getAllNonTeamMembers,
  getAllSecretaries,
  findUserById,
  findUserByEmail,
  updateUserById,
  updateUserRoleById,
  updateUserByEmail,
  saveUser,
  deleteUserById,
  updateUserEmailById,
  updateUserPasswordById,
}
