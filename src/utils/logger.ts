import type { Logs, State } from '@prisma/client'
import { newLog } from '@repositories/log'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import ProtocolStatesDictionary from './dictionaries/ProtocolStatesDictionary'
interface LoggerArguments {
    fromState: State
    toState: State
    protocolId: string
}
export const logProtocolUpdate = async ({
    fromState,
    toState,
    protocolId,
}: LoggerArguments) => {
    const session = await getServerSession(authOptions)
    const message = `${ProtocolStatesDictionary[fromState]} --> ${ProtocolStatesDictionary[toState]}`
    await newLog({ message, protocolId, userId: session?.user.id } as Logs)
}
