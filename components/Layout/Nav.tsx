/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useState } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { MenuIcon, UserIcon, XIcon } from '@heroicons/react/outline'
import { ChevronDownIcon } from '@heroicons/react/solid'
import { navigation } from '../../config/navigation'
import { Button } from '../Atomic/Button'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function Example() {
    return (
        <nav className="w-screen  bg-primary">
            <div className="mx-20 flex h-28 max-w-[1280px] items-center justify-between text-white 2xl:m-auto">
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
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.1}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    )
}
