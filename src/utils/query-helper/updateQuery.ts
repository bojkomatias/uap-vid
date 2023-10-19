'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type UpdateEvent = {
    page?: number
    records?: number
    search?: string
    sort?: string
    order?: 'asc' | 'desc' | null
    filter?: string
    values?: string
    units?: string
}
/**
 * Priority in query updates:
 *   - Search
 *   - Order
 *   - Page
 */
export const useUpdateQuery = () => {
    const router = useRouter()
    const path = usePathname()
    const searchParams = useSearchParams()

    return (e: UpdateEvent) => {
        const page = e.page !== undefined ? e.page : 1
        const records =
            e.records !== undefined ? e.records : searchParams?.get('records')
        const search =
            e.search !== undefined ? e.search : searchParams?.get('search')
        const order =
            e.order !== undefined ? e.order : searchParams?.get('order')
        const sort = e.sort !== undefined ? e.sort : searchParams?.get('sort')
        const filter =
            e.filter !== undefined ? e.filter : searchParams?.get('filter')
        const values =
            e.values !== undefined ? e.values : searchParams?.get('values')
        const units =
            e.units !== undefined ? e.units : searchParams?.get('units')

        const newUrl = new URL(
            path as string,
            process.env.NEXT_PUBLIC_URL ?? 'http:localhost:3000'
        )
        if (page) newUrl.searchParams.set('page', page.toString())
        if (records) newUrl.searchParams.set('records', records.toString())
        if (search) newUrl.searchParams.set('search', search)
        if (order && sort) {
            newUrl.searchParams.set('order', order)
            newUrl.searchParams.set('sort', sort)
        }
        if (filter && values) {
            newUrl.searchParams.set('filter', filter)
            newUrl.searchParams.set('values', values)
        }
        if (units) newUrl.searchParams.set('units', units)

        router.push(newUrl.pathname + newUrl.search, { scroll: false })
    }
}
