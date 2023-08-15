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
    console.log(searchParams)
    return ({ page = 1, records = 8, search, order, sort }: UpdateEvent) => {
        if (search) return router.push(`${path}?search=${search}`)
        if (order) return router.push(`${path}?order=${order}&sort=${sort}`)
        if (page) return router.push(`${path}?page=${page}&records=${records}`)
        return router.push(path)
    }
}
