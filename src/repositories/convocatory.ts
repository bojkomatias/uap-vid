'use server'

import type { Convocatory } from '@prisma/client'
import { orderByQuery } from '@utils/query-helper/orderBy'
import { cache } from 'react'
import { prisma } from 'utils/bd'

export const getAllConvocatories = cache(
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
        prisma.convocatory.count({
          where: {
            AND: [
              search
                ? {
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
              search
                ? {
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

export const createConvocatory = async (
  data: Omit<Convocatory, 'id' | 'createdAt'>
) => {
  try {
    return await prisma.convocatory.create({
      data,
    })
  } catch (error) {
    console.info(error)
    return null
  }
}
export const updateConvocatory = async (
  id: string,
  data: Omit<Convocatory, 'id'>
) => {
  try {
    return await prisma.convocatory.update({
      where: { id },
      data,
    })
  } catch (e) {
    return null
  }
}
