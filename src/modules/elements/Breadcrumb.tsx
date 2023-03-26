'use client'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { ChevronRight } from 'tabler-icons-react'
import Link from 'next/link'
import { Home } from 'tabler-icons-react'

const newLinkMap: any = {
    users: 'Lista de usuarios',
    protocols: 'Lista de protocolos',
}

export const Breadcrumb = () => {
    const pathname = usePathname()
    const breadcrumbs = useMemo(
        function generateBreadcrumbs() {
            const asPathNestedRoutes = pathname!
                .split('/')
                .filter((v) => v.length > 0)

            const crumblist = asPathNestedRoutes.map((subpath, idx) => {
                const href = `/${asPathNestedRoutes
                    .slice(0, idx + 1)
                    .join('/')}`
                return {
                    href,
                    name: subpath.replace(
                        subpath,
                        newLinkMap[subpath]
                            ? newLinkMap[subpath]
                            : 'Vista de protocolo'
                    ),
                }
            })

            return crumblist
        },
        [pathname]
    )

    return (
        <nav className="flex absolute top-8 left-10" aria-label="Breadcrumb">
            <ol role="list" className="flex rounded-md bg-white">
                {pathname !== '/protocols' ? (
                    <li className="flex items-center">
                        <Link
                            href="/"
                            className="text-gray-500 hover:text-primary"
                            passHref
                        >
                            <Home className="h-5 w-5 flex-shrink-0" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </li>
                ) : null}

                {breadcrumbs.slice(0, -1).map((page) => (
                    <li key={page.name} className="flex">
                        {page.name == 'Inicio' ? null : (
                            <div className="flex items-center">
                                <ChevronRight className="ml-2 text-gray-500 h-4" />
                                <Link
                                    href={page.href}
                                    className="ml-4 text-sm font-medium text-gray-500 hover:text-primary"
                                >
                                    {page.name}
                                </Link>
                            </div>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}
