'use server'
import { orderByQuery } from '@utils/query-helper/orderBy'
import type { CareerSchema } from '@utils/zod'
import { cache } from 'react'
import { prisma } from 'utils/bd'
import type { z } from 'zod'

export const getAllCareers = cache(
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
        prisma.career.count({
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

        prisma.career.findMany({
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
      console.log(e)
      return []
    }
  }
)

export const getCareerById = cache(async (id: string) => {
  try {
    const result = prisma.career.findFirst({
      include: { courses: true },
      where: { id },
    })
    return result
  } catch (e) {
    console.log(e)
    return null
  }
})

export const upsertCareer = cache(
  async (data: z.infer<typeof CareerSchema>) => {
    const { id, courses, ...career } = data
    const coursesToArray = courses.toString().split(',')
    coursesToArray.map(async (c) => {
      console.log('Creating course: ', c.trim(), c.length)
      //If to catch extra commas added by mistake
      if (c.length > 0) {
        return await prisma.course.create({
          data: {
            name: c.replaceAll(`"`, '').trim(),
            active: true,
            careerId: id!,
          },
        })
      }
    })

    try {
      if (!id) {
        return await prisma.career.create({
          data: { name: career.name, active: career.active },
        })
      }
      return await prisma.career.update({
        where: { id },
        data: {
          name: career.name,
          active: career.active,
        },
      })
    } catch (e) {
      console.log(e)
      return null
    }
  }
)
