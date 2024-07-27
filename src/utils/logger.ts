import type { Logs, ProtocolState } from '@prisma/client'
import { newLog } from '@repositories/log'
import ProtocolStatesDictionary from './dictionaries/ProtocolStatesDictionary'
interface LoggerArguments {
  userId: string
  fromState: ProtocolState
  toState: ProtocolState
  protocolId: string
}
export const logProtocolUpdate = async ({
  userId,
  fromState,
  toState,
  protocolId,
}: LoggerArguments) => {
  const message = `${ProtocolStatesDictionary[fromState]} --> ${ProtocolStatesDictionary[toState]}`
  await newLog({ message, protocolId, userId } as Logs)
}
