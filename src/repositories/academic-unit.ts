import type { AcademicUnit } from '@prisma/client'
import { prisma } from '../utils/bd'
import { cache } from 'react'
import { orderByQuery } from '@utils/query-helper/orderBy'

export const getAllAcademicUnits = cache(async ({
    records = '5',
    page = '1',
    search,
    sort,
    order,
    filter,
    values,
}: { [key: string]: string }) => {
    try {
        const orderBy = order && sort ? orderByQuery(sort, order) : {}

        const academicUnits = await prisma.$transaction([
            prisma.academicUnit.count({
                where: {
                    AND: [
                        search
                            ? {
                                OR: [
                                    {
                                        name: {
                                            contains: search,
                                            mode: 'insensitive'
                                        },
                                    },
                                ],
                            }
                            : {},
                        filter && values
                            ? { [filter]: { in: values.split('-') } }
                            : {},
                    ],
                }
            }),

            prisma.academicUnit.findMany({
                skip: Number(records) * (Number(page) - 1),
                take: Number(records),
                // Grab the model, and  bring relational data
                select: {
                    id: true,
                    name: true,
                    budgets: true,
                    secretariesIds: true,
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
                                            mode: 'insensitive'
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

        // const academicUnits = await prisma.academicUnit.findMany({
        //     include: { secretaries: true },
        // })
        return academicUnits
    } catch (error) {
        return []
    }
})

export const getAcademicUnitsByUserId = async (id: string) => {
    try {
        const academicUnits = prisma.academicUnit.findMany({
            where: {
                secretariesIds: {
                    has: id,
                },
            },
        })
        return academicUnits
    } catch (error) {
        return null
    }
}

export const updateAcademicUnit = async (id: string, academicUnit: AcademicUnit) => {
    const { id: _, ...academicUnitWithoutId } = academicUnit;

    try {
        const unit = await prisma.academicUnit.update({
            where: {
                id,
            },
            data: {
                budgets: academicUnitWithoutId.budgets,
                name: academicUnitWithoutId.name,
                secretariesIds: academicUnitWithoutId.secretariesIds,
            },
        })
        return unit
    } catch (error) {
        return null
    }
}

export const updateAcademicUnitSecretaries = async (
    id: string,
    secretariesIds: string[]
) => {
    try {
        const unit = await prisma.academicUnit.update({
            where: {
                id,
            },
            data: { secretariesIds },
        })
        return unit
    } catch (error) {
        return null
    }
}
