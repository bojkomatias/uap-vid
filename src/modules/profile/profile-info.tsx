'use client'
import React from 'react'
import Image from 'next/image'
import type { User } from '@prisma/client'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import { Edit } from 'tabler-icons-react'
import PopoverComponent from '@elements/popover'
import { Button } from '@elements/button'

export default function ProfileInfo({ user }: { user: User }) {
    return (
        <div className="mt-4 flex items-center justify-between rounded-md border border-gray-200 p-4">
            <div
                key={user?.name}
                className=" flex flex-col gap-10   sm:flex-row"
            >
                <div className="flex items-center gap-x-6">
                    <Image
                        className="h-16 w-16 rounded-full"
                        src={user.image as string}
                        alt=""
                        height={200}
                        width={200}
                    />
                    <div>
                        <h3 className="text-base font-semibold leading-7 tracking-tight text-gray-900">
                            {user.name}
                        </h3>
                        <p className="text-indigo-600 text-sm font-semibold leading-6">
                            {RolesDictionary[user.role]}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                {' '}
                <p className="text-indigo-600 text-sm font-semibold leading-6">
                    {user.email}
                </p>
                <PopoverComponent
                    className="absolute right-0 rounded-md border border-gray-100 bg-white p-3 py-2 shadow-md"
                    actionButton={
                        <Button className="py-2 text-xs" intent="secondary">
                            Actualizar
                        </Button>
                    }
                    title={<Edit />}
                >
                    <div className="flex min-w-[18rem] items-center gap-2 text-xs">
                        <label className="whitespace-nowrap">Nuevo email</label>
                        <input
                            placeholder="ejemplo@uap.edu.ar"
                            className="input my-auto py-1.5 text-xs placeholder:lowercase"
                        />
                    </div>
                </PopoverComponent>
            </div>
        </div>
    )
}
