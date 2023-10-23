'use client'
import { cx } from '@utils/cx'
import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Check, InfoCircle, X } from 'tabler-icons-react'

type NotificationProps = {
    title: string
    message: string
    intent: 'primary' | 'success' | 'error'
    ms_duration?: number
}

const duration_default = 5000

class Notifications {
    show(props: NotificationProps) {
        const root = createRoot(
            document.getElementById('notifications-container')!
        )
        root.render(<Notification {...props} />)
        setTimeout(() => {
            root.unmount()
        }, props.ms_duration ?? duration_default)
    }
}

export const notifications = new Notifications()

const colors = {
    primary: 'primary',
    success: 'success-600',
    error: 'error-500',
}

/**
 * Notification Component
 */
function Notification({
    title,
    message,
    intent,
    ms_duration = duration_default,
}: NotificationProps) {
    useEffect(() => {
        setTimeout(() => {
            document
                .getElementById('custom-notification')
                ?.classList.add('fade-out-right')
        }, ms_duration - 600)
    })
    //It has the max value permitted for the z-index to ensure it'll always be on top
    return (
        <div
            id="custom-notification"
            className="fade-in-right fixed bottom-[3%] right-[2%] z-50 mx-auto flex w-[20rem] gap-2 rounded-md border bg-white p-2 text-sm shadow-lg"
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
