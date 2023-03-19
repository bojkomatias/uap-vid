'use client'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { ChevronRight } from 'tabler-icons-react'
import Link from 'next/link'
import { Home } from 'tabler-icons-react'

const newLinkMap: any = {
    protected: 'Inicio',
    view: 'Vista del protocolo',
    protocol: 'Panel de edición del protocolo',
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
                    name: subpath.replace(subpath, newLinkMap[subpath]),
                }
            })

            return crumblist
        },
        [pathname]
    )

    return (
        <nav className="mb-6 flex mt-6" aria-label="Breadcrumb">
            <ol role="list" className="flex rounded-md bg-white px-4">
                {pathname === '/protected' ? null : (
                    <li className="flex items-center">
                        <Link
                            href="/protected"
                            className="text-gray-500 hover:text-primary"
                            passHref
                        >
                            <Home className="h-5 w-5 flex-shrink-0" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </li>
                )}

                {breadcrumbs.slice(0, -1).map((page, idx) => (
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
