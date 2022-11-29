import {prisma} from '../bd'


const findProtocolById = async (id: string) => {
  return await prisma.protocol.findUnique({
    where: {
      id,
    },
  })
}

const getAllProtocols = async () => {
  return await prisma.protocol.findMany()
}

export {findProtocolById, getAllProtocols}