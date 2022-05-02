import type { ReactElement } from 'react'
import Layout from '../components/Layout'
import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'

export default function Page() {
    return (
        <div className="mx-auto my-16 min-h-screen max-w-7xl px-4 sm:my-24 sm:px-6">
            <div className="text-center">
                <h1 className="text-gray-900 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                    <span className="block">Data to enrich your</span>
                    <span className="text-indigo-600 block">
                        online business
                    </span>
                </h1>
                <p className="text-gray-500 mx-auto mt-3 max-w-md text-base sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
                    Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure
                    qui lorem cupidatat commodo. Elit sunt amet fugiat veniam
                    occaecat fugiat aliqua.
                </p>
            </div>

            <div className="relative mt-8">
                <div
                    className="absolute inset-0 flex flex-col"
                    aria-hidden="true"
                >
                    <div className="flex-1" />
                    <div className="bg-gray-800 w-full flex-1" />
                </div>
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <img
                        className="rounded relative shadow-lg"
                        src="https://tailwindui.com/img/component-images/top-nav-with-multi-column-layout-screenshot.jpg"
                        alt="App screenshot"
                    />
                </div>
            </div>
        </div>
    )
}

// ! If need use for custom per page layout
// Page.getLayout = function getLayout(page: ReactElement) {
//     return <NestedLayout>{page}</NestedLayout>
// }
