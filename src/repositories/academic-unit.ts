import { prisma } from '../utils/bd'

export const getAllAcademicUnits = async () => {
    try {
        const academicUnits = await prisma.academicUnit.findMany({
            include: { secretaries: true },
        })
        return academicUnits
    } catch (error) {
        return null
    }
}

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

export const updateAcademicUnit = async (
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
