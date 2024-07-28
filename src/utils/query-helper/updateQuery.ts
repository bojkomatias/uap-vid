'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type UpdateEvent = {
  page?: string
  records?: string
  search?: string
  sort?: string
  order?: 'asc' | 'desc' | ''
} & { [key: string]: string } // This is to add stackable filters (eg: Academic Unit + Protocol State) without having to add every single key

export const useUpdateQuery = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (e: UpdateEvent) => {
    const newUrl = new URL(
      pathname + '?' + searchParams.toString(),
      process.env.NEXT_PUBLIC_URL ?? 'http:localhost:3000'
    )
    Object.entries(e).map((param) => {
      if (param[1]) newUrl.searchParams.set(param[0], param[1])
      else newUrl.searchParams.delete(param[0])
    })

    router.push(newUrl.pathname + newUrl.search, { scroll: false })
  }
}
