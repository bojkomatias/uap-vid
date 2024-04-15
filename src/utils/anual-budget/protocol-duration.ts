import { PROTOCOL_DURATION_DEFAULT } from '@utils/constants'

/** Returns the procol duration in weeks
 *
 * If duration is "12 months", the function will return 52.
 *
 * If duration is "6 months", the function will return 26.
 *
 * If duration is an empty string or doesn't contain a space, the function will use the PROTOCOL_DURATION_DEFAULT value and compare it with 12 to determine the return value.
 */
export const protocolDuration = (duration: string) =>
    parseInt(
        duration.split(' ').at(0) || PROTOCOL_DURATION_DEFAULT.toString()
    ) >= 12
        ? 52
        : 26
