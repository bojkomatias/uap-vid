/**
 * A recursive function to help pass a sortable key to a prisma OrderBy operator.
 * Receives "example.key" and returns { example: { key: sort } }
 * @param query : string
 * @param sort : string
 * @returns
 */
export const orderByQuery: any = (query: string, sort: string) => {
    const arr = query.split(/[.|_]/)
    if (!arr[0]) return sort
    return { [arr[0]]: orderByQuery(arr.slice(1).join('.'), sort) }
}
