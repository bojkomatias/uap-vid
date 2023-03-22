'use client'

import { useEffect, useMemo, useState } from 'react'

export function Timer({
    label,
    dateString,
}: {
    label: string
    dateString: Date
}) {
    const date = useMemo(() => new Date(dateString), [])

    const [today, setToday] = useState(new Date())
    useEffect(() => {
        setTimeout(() => {
            setToday(new Date())
        }, 60000)
    }, [today])

    const differenceInMilliseconds = useMemo(
        () => date.getTime() - today.getTime(),
        [today, date]
    )
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000)
    const differenceInMinutes = Math.floor(differenceInSeconds / 60)
    const differenceInHours = Math.floor(differenceInMinutes / 60)
    const differenceInDays = Math.floor(differenceInHours / 24)

    const remainingHours = differenceInHours % 24
    const remainingMinutes = differenceInMinutes % 60
    const remainingSeconds = differenceInSeconds % 60

    return (
        <div className="float-right flex flex-col scale-75">
            <span className="label">{label}</span>
            <div className="flex flex-col md:flex-row items-center">
                <div className="grid grid-cols-4 gap-1 place-items-stretch w-fit flex-shrink-0 opacity-80 font-light scale-90 md:scale-100">
                    <div className="text-center bg-gray-400/10 rounded-lg">
                        <div className="mt-1  font-bold">
                            {differenceInDays}
                        </div>
                        <div className="text-[0.6rem] ">Días</div>
                    </div>
                    <div className="text-center bg-gray-400/10 rounded-lg">
                        <div className="mt-1 font-normal ">
                            {remainingHours}
                        </div>
                        <div className="text-[0.6rem] ">Horas</div>
                    </div>
                    <div className="text-center bg-gray-400/10 rounded-lg px-2">
                        <div className="mt-1  font-light">
                            {remainingMinutes}
                        </div>
                        <div className="text-[0.6rem] ">Minutos</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
