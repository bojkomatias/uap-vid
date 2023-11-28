import { PROTOCOL_DURATION_DEFAULT } from '@utils/constants'

export const protocolDuration = (duration: string) =>
    parseInt(
        duration.split(' ').at(0) || PROTOCOL_DURATION_DEFAULT.toString()
    ) >= 12
        ? 52
        : 26
