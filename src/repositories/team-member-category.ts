'use server'

import type { TeamMemberCategory } from '@prisma/client'
import { cache } from 'react'
import { prisma } from '../utils/bd'
import { orderByQuery } from '@utils/query-helper/orderBy'
import { TeamMemberCategorySchema } from '@utils/zod'
import { getCurrentIndexes } from './finance-index'
import { z } from 'zod'

/** This query returns all categories that match the filtering criteria. The criteria includes:

 * @param records this is the amount of records shown in the table at once.
 * @param page necessary for pagination, the total amount of pages is calculated using the records number. Defaults to 1.
 * @param search string that, for now, only searches the name of the category, which is defined as insensitive.
 * @param sort this is the key which will be used to order the records.
 * @param order this is the type of ordering which will be used: asc or desc. Always present when a key is given to the order param.
 *
 */

const getCategories = cache(
  async ({
    records = '10',
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
        prisma.teamMemberCategory.count({
          where: {
            state: { not: false },
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
                  ],
                }
              : {},
              filter && values ? { [filter]: { in: values.split('-') } } : {},
            ],
          },
        }),

        prisma.teamMemberCategory.findMany({
          skip: Number(records) * (Number(page) - 1),
          take: Number(records),
          // Grab the model, and  bring relational data
          select: {
            id: true,
            state: true,
            name: true,
            price: true,
            amountIndex: true,
          },
          // Add all the globally searchable fields
          where: {
            state: { not: false },
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

const updatePriceCategoryById = async (
  id: string,
  data: TeamMemberCategory
) => {
  try {
    const category = await prisma.teamMemberCategory.update({
      where: {
        id,
      },
      data: { price: data.price },
    })
    return category
  } catch (error) {
    return new Error(`${error}`)
  }
}

const deleteCategoryById = async (id: string, data: TeamMemberCategory) => {
  try {
    const user = await prisma.teamMemberCategory.update({
      where: {
        id,
      },
      data: { state: data.state },
    })
    return user
  } catch (error) {
    return new Error(`${error}`)
  }
}

const insertCategory = async (
  data: z.infer<typeof TeamMemberCategorySchema>
) => {
  const { currentFCA, currentFMR } = await getCurrentIndexes()

  const newCategory = {
    name: data.name,
    state: data.state,
    amountIndex: {
      FCA: data.amount / currentFCA,
      FMR: data.amount / currentFMR,
    },
  }

  try {
    return await prisma.teamMemberCategory.create({
      data: newCategory,
    })
  } catch (error) {
    return null
  }
}

const getAllCategories = async () =>
  await prisma.teamMemberCategory.findMany({
    where: {
      state: {
        not: false,
      },
    },
  })

const getObreroCategory = async () => {
  return await prisma.teamMemberCategory.findFirstOrThrow({
    where: { name: 'Obrero' },
  })
}

export {
  getCategories,
  updatePriceCategoryById,
  insertCategory,
  deleteCategoryById,
  getAllCategories,
  getObreroCategory,
}
