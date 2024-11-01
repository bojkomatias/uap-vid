export const PROTOCOL_DURATION_DEFAULT = 12
export const WEEKS_IN_MONTH = 4
export const WEEKS_IN_HALF_YEAR = 24
export const WEEKS_IN_YEAR = 48

/** Returns the procol duration in weeks
 *
 * If duration is "12 months", the function will return 48.
 *
 * If duration is "6 months", the function will return 24.
 *
 * If duration is an empty string or doesn't contain a space, the function will use the PROTOCOL_DURATION_DEFAULT value and compare it with 12 to determine the return value.
 */
export const protocolDuration = (duration: string) =>
  (
    parseInt(
      duration.split(' ').at(0) || PROTOCOL_DURATION_DEFAULT.toString()
    ) >= 12
  ) ?
    WEEKS_IN_YEAR
  : WEEKS_IN_HALF_YEAR
