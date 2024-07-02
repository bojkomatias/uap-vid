/**
 * A recursive function to help pass a sortable key to a prisma OrderBy operator.
 * Receives "example.key" and returns { example: { key: order } }
 * @param query : string
 * @param order : string
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const orderByQuery: any = (query: string, order: string) => {
  const arr = query.split(/[.|_]/)
  if (!arr[0]) return order
  return { [arr[0]]: orderByQuery(arr.slice(1).join('.'), order) }
}
