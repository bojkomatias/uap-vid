import { prisma } from '../utils/bd'

export const getAllAcademicUnits = async () => {
    try {
        const academicUnits = await prisma.academicUnit.findMany()
        return academicUnits
    } catch (error) {
        return null
    }
}
