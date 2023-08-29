import type { Logs, State, User } from '@prisma/client'
import { newLog } from '@repositories/log'
import ProtocolStatesDictionary from './dictionaries/ProtocolStatesDictionary'
interface LoggerArguments {
    user: User
    fromState: State
    toState: State
    protocolId: string
}
export const logProtocolUpdate = async ({
    user,
    fromState,
    toState,
    protocolId,
}: LoggerArguments) => {
    const message = `${ProtocolStatesDictionary[fromState]} --> ${ProtocolStatesDictionary[toState]}`
    await newLog({ message, protocolId, userId: user.id } as Logs)
}
