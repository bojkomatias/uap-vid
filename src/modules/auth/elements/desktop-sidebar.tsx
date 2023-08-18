'use client'
import {
    BuildingCommunity,
    CalendarEvent,
    List,
    Users,
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
        <div className="hidden lg:sticky lg:inset-0 lg:flex lg:h-full lg:max-h-screen lg:w-16 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex min-h-0 flex-1 flex-col border-r bg-base-50 pt-8">
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
                                        buttonStyle('primary')
                                )}
                                passHref
                            >
                                <div
                                    className={cx(
                                        'invisible absolute left-12 z-50 truncate rounded-md bg-white px-3 py-2 text-sm ring-1 ring-gray-200 group-hover:visible'
                                    )}
                                >
                                    {item.name}
                                </div>
                                <item.icon
                                    className={cx(
                                        'pointer-events-auto h-6 flex-shrink-0 stroke-[1.5px] text-base-700',
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
        name: 'Lista de usuarios',
        icon: Users,
        href: '/users',
        scope: ACCESS.USERS,
    },
]
