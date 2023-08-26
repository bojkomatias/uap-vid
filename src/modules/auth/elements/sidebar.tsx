'use client'
import {
    BuildingCommunity,
    CalendarEvent,
    List,
    UserSearch,
    Users,
    Category,
} from 'tabler-icons-react'
import { ACCESS } from '@utils/zod'
import { usePathname } from 'next/navigation'
import type { User } from '@prisma/client'
import { canAccess } from '@utils/scopes'
import Link from 'next/link'
import { cx } from '@utils/cx'
import { buttonStyle } from '@elements/button/styles'

export function DesktopNavigation({ user }: { user: User }) {
    const pathname = usePathname()
    return (
        <div className="absolute inset-0 left-0 z-20 h-full w-16 border-r bg-gray-50">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="sticky inset-0 flex min-h-0 flex-1 flex-col pt-8">
                <nav className="flex-1 space-y-3 px-1.5">
                    {navigation.map((item) =>
                        canAccess(item.scope, user.role) ? (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cx(
                                    'pointer-events-none relative',
                                    buttonStyle('secondary'),
                                    pathname?.includes(item.href) &&
                                        buttonStyle('primary'),
                                    'p-0'
                                )}
                                passHref
                            >
                                <div className="invisible absolute left-16 z-40 rounded-md shadow-sm brightness-110 after:absolute after:-left-1 after:top-3.5 after:h-2 after:w-2 after:rotate-45 after:rounded-[1px] after:bg-primary group-hover:visible">
                                    <div className="truncate rounded-md bg-primary px-3 py-2 text-sm text-white">
                                        {item.name}
                                    </div>
                                </div>
                                <item.icon
                                    className={cx(
                                        'pointer-events-auto h-12 w-12 flex-shrink-0 stroke-[1.5px] p-3 text-gray-700',
                                        pathname?.includes(item.href) &&
                                            'text-white'
                                    )}
                                    aria-hidden="true"
                                />
                                {/* {item.name} */}
                            </Link>
                        ) : null
                    )}
                </nav>
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
        name: 'Panel de convocatorias',
        icon: CalendarEvent,
        href: '/convocatories',
        scope: ACCESS.CONVOCATORIES,
    },
    {
        name: 'Unidades académicas',
        icon: BuildingCommunity,
        href: '/academic-units',
        scope: ACCESS.ACADEMIC_UNITS,
    },
    {
        name: 'Miembros de investigación',
        icon: UserSearch,
        href: '/team-members',
        scope: ACCESS.TEAM_MEMBERS,
    },
    {
        name: 'Lista de usuarios',
        icon: Users,
        href: '/users',
        scope: ACCESS.USERS,
    },
    {
        name: 'Categorías de miembros de equipo de investigación',
        icon: Category,
        href: '/categories',
        scope: ACCESS.USERS,
    },
]
