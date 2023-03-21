'use client'
import { canAccess } from '@utils/scopes'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { navigation } from './navigation'
import { user } from '@prisma/client'

export default function Sidebar({ user }: { user: user }) {
    const pathname = usePathname()
    return (
        <div className="hidden lg:absolute lg:inset-0 lg:flex lg:w-64 lg:flex-col">
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="flex min-h-0 flex-1 flex-col border-r border-base-200 bg-white">
                <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                    <nav className="mt-10 flex-1 space-y-3 bg-white px-2">
                        {navigation.map((item) =>
                            canAccess(item.scope, user.role) ? (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={clsx(
                                        pathname === item.href
                                            ? 'bg-primary text-white'
                                            : 'text-base-700 hover:bg-base-100 hover:text-black',
                                        'group flex items-center px-4 rounded py-3 text-sm font-medium'
                                    )}
                                    passHref
                                >
                                    <item.icon
                                        className={clsx(
                                            pathname === item.href
                                                ? 'text-base-100'
                                                : 'text-base-700 group-hover:text-black',
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
