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

export const Breadcrumb = ({ className }: { className: string }) => {
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
        <nav className="mb-6 flex" aria-label="Breadcrumb">
            <ol role="list" className="flex rounded-md bg-white px-4 shadow">
                {pathname === '/protected' ? null : (
                    <li className="flex">
                        <div className="flex h-[44px] items-center">
                            <Link
                                href="/protected"
                                className="text-primary/70 hover:text-primary"
                            >
                                <Home className="h-5 w-5 flex-shrink-0" />
                                <span className="sr-only">Home</span>
                            </Link>
                        </div>
                    </li>
                )}

                {breadcrumbs.slice(0, -1).map((page, idx) => (
                    <li key={page.name} className="flex">
                        {page.name == 'Inicio' ? null : (
                            <div className="flex items-center">
                                <svg
                                    className="h-full w-6 flex-shrink-0 text-gray-300"
                                    viewBox="0 0 24 44"
                                    preserveAspectRatio="none"
                                    fill="currentColor"
                                >
                                    <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                                </svg>
                                <Link
                                    href={page.href}
                                    className="ml-4 text-sm font-medium text-primary/70 hover:text-primary"
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
