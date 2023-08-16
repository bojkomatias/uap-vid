'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type UpdateEvent = {
    page?: number
    records?: number
    search?: string
    order?: string
    sort?: 'asc' | 'desc' | null
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
        const page = e.page !== undefined ? e.page : searchParams?.get('page')
        const records =
            e.records !== undefined ? e.records : searchParams?.get('records')
        const search =
            e.search !== undefined ? e.search : searchParams?.get('search')
        const order =
            e.order !== undefined ? e.order : searchParams?.get('order')
        const sort = e.sort !== undefined ? e.sort : searchParams?.get('sort')

        const newUrl = new URL(path as string, process.env.NEXTURL)
        if (page) newUrl.searchParams.set('page', page.toString())
        if (records) newUrl.searchParams.set('records', records.toString())
        if (search) newUrl.searchParams.set('search', search)
        if (order && sort) {
            newUrl.searchParams.set('order', order)
            newUrl.searchParams.set('sort', sort)
        }

        router.push(newUrl.href)
    }
}
