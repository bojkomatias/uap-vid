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
      const orderBy =
        order && sort ? orderByQuery(sort, order) : { active: 'desc' }
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

    try {
      //If it's a new career, create it and return.
      if (!id) {
        return await prisma.career.create({
          data: { name: career.name, active: career.active },
        })
      }

      //Handle courses bulk deletion
      const courses_from_career = prisma.course.findMany({
        where: { careerId: data.id },
      })
      const courses_to_delete = (await courses_from_career).filter(
        (course) => !data.courses.includes(course.name)
      )

      courses_to_delete.map(async (c) => {
        const deleted_course = await prisma.course.delete({
          where: {
            id: c.id,
          },
          //Don't pass anything since it won't update anything here
          // data: {
          //   active: false,
          // },
        })
      })

      //Handle bulk creation of courses
      courses?.map(async (c) => {
        //If to catch empty elements caused by extra commas added by mistake
        if (c.length > 0) {
          const created_course = await prisma.course.upsert({
            where: {
              name: c,
            },
            create: {
              name: c.replaceAll(`"`, '').trim(),
              active: true,
              careerId: id!,
            },
            //Don't pass anything since it won't update anything here
            update: {},
          })
          return created_course
        }
      })

      return await prisma.career.update({
        where: { id },
        data: career,
      })
    } catch (e) {
      console.log(e)
      return null
    }
  }
)
