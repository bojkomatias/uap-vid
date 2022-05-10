/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { navigation } from '../../config/navigation'
import { Button } from '../Atomic/Button'
import AccountBoxIcon from '@mui/icons-material/AccountBox'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    return (
        <nav className="bg-primary  w-screen">
            <div className="text-white m-auto flex h-28 w-[1280px] items-center justify-between">
                <div className="text-center text-[10px] uppercase tracking-wider transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
                    <a href="/">
                        <img src="/UAP-logo-home.png"></img>
                        <p>Vicerrectoría de Investigación y Desarrollo</p>
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <p>
                        Bienvenido <b>John Doe</b>
                    </p>
                    <div className="transition-all duration-150 hover:scale-[1.07]">
                        <a href="/profile">
                            <AccountBoxIcon fontSize="large"></AccountBoxIcon>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    )
}
