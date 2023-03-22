'use client'
import { canAccess } from '@utils/scopes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { navigation } from './navigation'
import { User } from '@prisma/client'

export default function Sidebar({ user }: { user: User }) {
    const pathname = usePathname()
    return (
        <div className="hidden lg:absolute lg:inset-0 lg:flex lg:w-64 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex min-h-0 flex-1 flex-col border-r bg-gray-50/20">
                <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                    <nav className="flex-1 space-y-3 px-2">
                        {navigation.map((item) =>
                            canAccess(item.scope, user.role) ? (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        {
                                            'ring-2 ring-primary/80 bg-gray-100 ring-offset-1 hover:ring-offset-2':
                                                pathname?.includes(item.href),

                                            'bg-primary text-white':
                                                pathname === item.href,
                                        },
                                        'text-base-700 hover:bg-gray-100 hover:text-black',
                                        'group flex items-center px-4 rounded py-3 text-sm font-medium'
                                    )}
                                    passHref
                                >
                                    <item.icon
                                        className={clsx(
                                            {
                                                'text-primary stroke-2':
                                                    pathname?.includes(
                                                        item.href
                                                    ),
                                                'text-white':
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
