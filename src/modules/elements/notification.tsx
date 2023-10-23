'use client'
import { cx } from '@utils/cx'
import React, { useEffect } from 'react'
import { Check, InfoCircle, X } from 'tabler-icons-react'

const colors = {
    primary: 'primary',
    success: 'success-600',
    error: 'error-500',
}

export default function Notification({
    title = 'Testeando notificaciones',
    message = 'Revisá tu bandeja de entrada y copiá el código y pegalo en la entrada de texto que dice "código"',
    intent = 'success',
    ms_duration = 5000,
}: {
    title?: string
    message?: string
    intent?: 'primary' | 'success' | 'error'
    ms_duration?: number
}) {
    useEffect(() => {
        setTimeout(() => {
            document
                .getElementById('custom-notification')
                ?.classList.add('fade-out-right')
        }, ms_duration)
    })
    //It has the max value permitted for the z-index to ensure it'll always be on top
    return (
        <div
            key="custom-notification-key"
            id="custom-notification"
            className=" fixed bottom-[3%] right-[2%] z-[2147483647] mx-auto flex w-[20rem] gap-2  rounded-md border bg-white p-2 text-sm shadow-lg"
        >
            <div
                className={cx(
                    'min-h-[5rem] min-w-[4px] rounded-sm',
                    `bg-${colors[intent]}`
                )}
            ></div>
            <div className="flex flex-grow flex-col">
                <div className="flex items-center gap-1 border-b pb-1">
                    {intent == 'error' ? (
                        <X className={cx(`text-${colors[intent]}`)} />
                    ) : intent == 'primary' ? (
                        <InfoCircle className={cx(`text-${colors[intent]}`)} />
                    ) : (
                        <Check className={cx(`text-${colors[intent]}`)} />
                    )}
                    <h3
                        className={cx(
                            'font-semibold',
                            `text-${colors[intent]}`
                        )}
                    >
                        {title}
                    </h3>
                </div>
                <p className="my-auto py-1 text-[13px] font-[500] text-black/70">
                    {message}
                </p>
            </div>
        </div>
    )
}
