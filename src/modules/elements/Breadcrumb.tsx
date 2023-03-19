'use client'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { ChevronRight } from 'tabler-icons-react'
import { Button } from './Button'
import Link from 'next/link'

export const Breadcrumb = ({ className }: { className: string }) => {
    const pathname = usePathname()

    if (!pathname) {
        /**This if is because typescript says that pathname is possibly null */
        return null
    }
    const breadcrumbs = useMemo(
        function generateBreadcrumbs() {
            const asPathNestedRoutes = pathname
                .split('/')
                .filter((v) => v.length > 0)

            const crumblist = asPathNestedRoutes.map((subpath, idx) => {
                const href = `/${asPathNestedRoutes
                    .slice(0, idx + 1)
                    .join('/')}`
                return { href, text: subpath }
            })

            return crumblist
        },
        [pathname]
    )

    return (
        <nav aria-label="Breadcrumb" className={className}>
            <ol
                role="list"
                className="flex items-center text-xs capitalize text-base-500/70"
            >
                {breadcrumbs.map((page, _) => (
                    <li key={page.text}>
                        <div className="flex items-baseline">
                            {_ === 0 ? null : (
                                <ChevronRight
                                    className="h-2 w-2 "
                                    aria-hidden="true"
                                />
                            )}
                            <Button intent="secondary">
                                <Link href={page.href}>{page.text}</Link>
                            </Button>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    )
}
