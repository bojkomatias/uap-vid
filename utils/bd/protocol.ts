import prisma from "../prismaClient"

const findById = async (id: string) => {
  return (await prisma).protocol.findUnique({
    where: {
      id,
    },
  })
}

const getAll = async () => {
  return (await prisma).protocol.findMany()
}

export {findById, getAll}