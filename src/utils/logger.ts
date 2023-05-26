import type { Logs, State } from '@prisma/client'
import { newLog } from '@repositories/log'
import { getServerSession } from 'next-auth'
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
    const session = await getServerSession()
    const message = `${fromState} --> ${toState}`
    await newLog({ message, protocolId, userId: session?.user.id } as Logs)
}
