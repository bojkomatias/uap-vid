/* eslint-disable no-console */
'use server'

import { orderByQuery } from '@utils/query-helper/orderBy'
import type { ConvocatorySchema } from '@utils/zod'
import { cache } from 'react'
import { prisma } from 'utils/bd'
import type { z } from 'zod'

export const getConvocatoriesForFilter = cache(async () => {
  return await prisma.convocatory.findMany({ select: { id: true, name: true } })
})

export const getAllConvocatories = cache(
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
        prisma.convocatory.count({
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
                  ],
                }
              : {},
              filter && values ? { [filter]: { in: values.split('-') } } : {},
            ],
          },
        }),

        prisma.convocatory.findMany({
          skip: Number(records) * (Number(page) - 1),
          take: Number(records),

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
                  ],
                }
              : {},
              filter && values ? { [filter]: { in: values.split('-') } } : {},
            ],
          },

          orderBy,
        }),
      ])
    } catch (e) {
      return []
    }
  }
)
export const getConvocatoryById = cache(async (id: string) => {
  try {
    return await prisma.convocatory.findFirst({
      where: { id },
    })
  } catch (e) {
    return null
  }
})

export const getConvocatoryByIdWithCount = cache(async (id: string) => {
  try {
    return await prisma.convocatory.findFirst({
      where: { id },
      include: { _count: { select: { protocols: true } } },
    })
  } catch (e) {
    return null
  }
})

export const getCurrentConvocatory = cache(async () => {
  try {
    return await prisma.convocatory.findFirst({
      where: {
        AND: [
          {
            from: {
              lte: new Date(),
            },
          },
          {
            to: {
              gt: new Date(),
            },
          },
        ],
      },
    })
  } catch (e) {
    return null
  }
})

export const upsertConvocatory = async (
  data: z.infer<typeof ConvocatorySchema>
) => {
  const { id, ...convocatory } = data
  try {
    if (!id)
      return await prisma.convocatory.create({
        data,
      })

    return await prisma.convocatory.update({
      where: { id },
      data: convocatory,
    })
  } catch (error) {
    console.error(error)
    return null
  }
}
