'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type UpdateEvent = {
    page?: number
    records?: number
    search?: string
    order?: string
    sort?: 'asc' | 'desc'
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
        const page = e.page !== undefined ? e.page : searchParams.get('page')
        const records =
            e.records !== undefined ? e.records : searchParams.get('records')
        const search =
            e.search !== undefined ? e.search : searchParams.get('search')
        const order =
            e.order !== undefined ? e.order : searchParams.get('order')

        const newUrl = new URL(path, 'http://localhost:3000')
        if (page) newUrl.searchParams.set('page', page.toString())
        if (records) newUrl.searchParams.set('records', records.toString())
        if (search) newUrl.searchParams.set('search', search)
        if (order) {
            if (searchParams.get('sort') === 'asc') {
                newUrl.searchParams.set('order', order)
                newUrl.searchParams.set('sort', 'desc')
            } else if (searchParams.get('sort') === 'desc') {
                newUrl.searchParams.delete('order')
                newUrl.searchParams.delete('sort')
            } else {
                newUrl.searchParams.set('order', order)
                newUrl.searchParams.set('sort', 'asc')
            }
            if (order !== searchParams.get('order')) {
                newUrl.searchParams.set('order', order)
                newUrl.searchParams.set('sort', 'asc')
            }
        }

        router.push(newUrl.href)
    }
}
