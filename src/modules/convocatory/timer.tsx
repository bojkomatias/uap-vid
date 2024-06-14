'use client'

import type { Convocatory } from '@prisma/client'
import { useEffect, useMemo, useState } from 'react'

export function CurrentConvocatory({
    convocatory,
}: {
    convocatory: Convocatory
}) {
    const date = useMemo(() => new Date(convocatory.to), [convocatory])
    const [today, setToday] = useState(new Date())
    useEffect(() => {
        const timeout = setTimeout(() => {
            setToday(new Date())
        }, 3600000)
        return () => clearTimeout(timeout)
    }, [today])

    const differenceInMilliseconds = useMemo(
        () => date.getTime() - today.getTime(),
        [today, date]
    )

    const differenceInHours = Math.floor(differenceInMilliseconds / 3600000)
    const differenceInDays = Math.floor(differenceInHours / 24)

    const remainingHours = differenceInHours % 24

    return (
        <>
            <div className="label">{convocatory.name}</div>
            <div className="flex gap-1">
                <div className="flex-grow rounded-lg bg-gray-400/10 px-2 py-1 text-center">
                    <div className="mt-1  font-bold">{differenceInDays}</div>
                    <div className="text-[0.6rem] ">Días</div>
                </div>
                <div className="flex-grow rounded-lg bg-gray-400/10 px-2 py-1 text-center">
                    <div className="mt-1 font-normal ">{remainingHours}</div>
                    <div className="text-[0.6rem] ">Horas</div>
                </div>
            </div>
        </>
    )
}
