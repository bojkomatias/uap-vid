import type {
    HistoricCategoryPrice,
    TeamMemberCategory,
    User,
} from '@prisma/client'
import { cache } from 'react'
import { prisma } from '../utils/bd'
import { orderByQuery } from '@utils/query-helper/orderBy'

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
                prisma.teamMemberCategory.count({
                    where: {
                        AND: [
                            search
                                ? {
                                      OR: [
                                          {
                                              name: {
                                                  contains: search,
                                              },
                                          },
                                      ],
                                  }
                                : {},
                            filter && values
                                ? { [filter]: { in: values.split('-') } }
                                : {},
                        ],
                    },
                }),

                prisma.teamMemberCategory.findMany({
                    skip: Number(records) * (Number(page) - 1),
                    take: Number(records),
                    // Grab the model, and  bring relational data
                    select: {
                        id: true,
                        name: true,
                        price: true,
                    },
                    // Add all the globally searchable fields
                    where: {
                        AND: [
                            search
                                ? {
                                      OR: [
                                          {
                                              name: {
                                                  contains: search,
                                              },
                                          },
                                      ],
                                  }
                                : {},
                            filter && values
                                ? { [filter]: { in: values.split('-') } }
                                : {},
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

const updateCategoryById = async (id: string, data: TeamMemberCategory) => {
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

const createCategory = async (data: TeamMemberCategory) => {
    try {
        const category = await prisma.teamMemberCategory.create({
            data,
        })
        return category
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

export { getCategories, updateCategoryById, createCategory, deleteUserById }
