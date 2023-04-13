'use client'
import {
    CalendarEvent,
    ClipboardList,
    List,
    ListDetails,
    ReportSearch,
    Users,
} from 'tabler-icons-react'
import { ACCESS } from '@utils/zod'
import { usePathname } from 'next/navigation'
import type { User } from '@prisma/client'
import { canAccess } from '@utils/scopes'
import Link from 'next/link'
import clsx from 'clsx'

export function DesktopNavigation({ user }: { user: User }) {
    const pathname = usePathname()
    return (
        <div className="hidden lg:sticky lg:inset-0 lg:flex lg:h-full lg:max-h-screen lg:w-64 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex min-h-0 flex-1 flex-col border-r bg-base-50">
                <div className="flex flex-1 flex-col overflow-y-auto pb-4 pt-5">
                    <nav className="flex-1 space-y-3 px-1.5">
                        {navigation.map((item) =>
                            canAccess(item.scope, user.role) ? (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        {
                                            'bg-primary text-white ':
                                                pathname?.includes(item.href),

                                            'ring-2 ring-primary ':
                                                pathname === item.href,
                                        },
                                        'text-base-700 ring-gray-300 ring-offset-2 hover:bg-gray-200 hover:text-black hover:ring-2 focus:outline-none focus:ring-2',
                                        'group flex items-center rounded px-4 py-3 text-sm font-medium transition'
                                    )}
                                    passHref
                                >
                                    <item.icon
                                        className={clsx(
                                            {
                                                'text-white':
                                                    pathname?.includes(
                                                        item.href
                                                    ),
                                                'stroke-[3px]':
                                                    pathname === item.href,
                                            },
                                            'text-base-700 group-hover:text-black',
                                            'mr-3 h-5 flex-shrink-0'
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            ) : null
                        )}
                    </nav>
                </div>
            </div>
        </div>
    )
}

export const navigation = [
    {
        name: 'Proyectos de investigación',
        icon: List,
        href: '/protocols',
        scope: ACCESS.PROTOCOLS,
    },
    {
        name: 'Lista base de datos evaluadores',
        icon: ClipboardList,
        href: '#',
        scope: ACCESS.USERS,
    },
    {
        name: 'Seguimiento de proyectos aprobados',
        icon: ListDetails,
        href: '#',
        scope: ACCESS.USERS,
    },
    {
        name: 'Información de publicaciones científicas',
        icon: ReportSearch,
        href: '#',
        scope: ACCESS.USERS,
    },
    {
        name: 'Lista de usuarios',
        icon: Users,
        href: '/users',
        scope: ACCESS.USERS,
    },
    {
        name: 'Panel de convocatorias',
        icon: CalendarEvent,
        href: '/convocatories',
        scope: ACCESS.CONVOCATORIES,
    },
]
