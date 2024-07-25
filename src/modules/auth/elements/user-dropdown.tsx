'use client'

import { signOut } from 'next-auth/react'
import { MenuButton } from '@headlessui/react'
import { useEffect, useState } from 'react'
import type { User } from '@prisma/client'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import {
    Logout,
    Moon,
    Moon2,
    Selector,
    Settings,
    Sun,
} from 'tabler-icons-react'
import {
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DropdownDivider,
    DropdownHeader,
    DropdownLabel,
} from '@components/dropdown'
import { Avatar } from '@components/avatar'

export function UserDropdown({ user }: { user: User }) {
    const [loading, setLoading] = useState(false)

    return (
        <Dropdown>
            <MenuButton
                className="border-transparent flex items-center gap-3 rounded-xl border p-1 data-[active]:border-gray-200 data-[hover]:border-gray-200 data-[active]:bg-gray-950/5 data-[hover]:bg-gray-950/5 dark:data-[active]:border-gray-700 dark:data-[hover]:border-gray-700"
                aria-label="Account options"
            >
                {loading ? (
                    <div className="flex size-10 items-center justify-center">
                        <span className="loader size-8 text-gray-300 dark:text-gray-700"></span>
                    </div>
                ) : user.image ? (
                    <Avatar square className="size-10" src={user.image} />
                ) : (
                    <Avatar
                        square
                        initials={
                            user.name.split(' ')[0].substring(0, 1) +
                            user.name.split(' ').at(-1)?.substring(0, 1)
                        }
                        className="size-10 bg-primary-950 text-white dark:bg-white dark:text-primary-950"
                    />
                )}
                <span className="block text-left">
                    <span className="block text-sm/5 font-medium">
                        {user.name.split(' ')[0]} {user.name.split(' ')[2]}
                    </span>
                    <span className="text-zinc-500 block text-xs/5">
                        {RolesDictionary[user.role]}
                    </span>
                </span>
                <Selector className="ml-auto mr-1 size-4 shrink-0 stroke-gray-400" />
            </MenuButton>
            <DropdownMenu className="min-w-[--button-width]">
                <DropdownHeader>
                    <div className="pr-6">
                        <div className="text-zinc-500 dark:text-zinc-400 text-xs">
                            Autenticado como
                        </div>
                        <div className="text-zinc-800 text-xs/6 font-medium dark:text-white">
                            {user.email}
                        </div>
                    </div>
                </DropdownHeader>
                <DropdownDivider />
                <DropdownItem href="/profile">
                    <Settings data-slot="icon" />
                    <DropdownLabel>Cuenta</DropdownLabel>
                </DropdownItem>
                <DarkModeToggler />
                <DropdownDivider />
                <DropdownItem
                    onClick={() => {
                        setLoading(true)
                        signOut({ callbackUrl: '/' })
                    }}
                >
                    <Logout data-slot="icon" />
                    <DropdownLabel>Cerrar sesión</DropdownLabel>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}

const DarkModeToggler = () => {
    const htmlTag = document.querySelector('html')!
    const isDark = htmlTag.classList.contains('dark')

    useEffect(() => {}, [])

    return (
        <DropdownItem
            onClick={() => {
                if (isDark) {
                    htmlTag.classList.remove('dark')
                    localStorage.removeItem('dark-mode')
                } else {
                    htmlTag.classList.add('dark')
                    localStorage.setItem('dark-mode', 'true')
                }
            }}
        >
            {isDark ? <Sun data-slot="icon" /> : <Moon data-slot="icon" />}
            <DropdownLabel>
                {' '}
                {isDark ? 'Modo claro' : 'Modo oscuro'}
            </DropdownLabel>
        </DropdownItem>
    )
}
