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
