import {prisma} from '../utils/bd'

const findProtocolById = async (id: string) => {
  return await prisma.protocol.findUnique({
    where: {
      id,
    },
  })
}

const updateProtocolById = async (id: string, data: any) => {
  const protocol = await prisma.protocol.update({
    where: {
      id,
    },
    data,
  })
  return protocol
}

const getAllProtocols = async () => {
  return await prisma.protocol.findMany()
}

export {findProtocolById, updateProtocolById, getAllProtocols}