'use client'
import Notification from '@elements/notification'

export type NotificationType = {
    title: string
    message: string
    intent: 'primary' | 'success' | 'error'
    ms_duration: number
}

const NotificationComponent = ({
    title,
    message,
    intent,
    ms_duration,
}: NotificationType) => {
    const NotificationWithData = (
        <Notification
            title={title}
            message={message}
            intent={intent}
            ms_duration={ms_duration}
        />
    )

    return NotificationWithData
}

export const useCustomNotification = () => {
    return ({ title, message, intent, ms_duration }: NotificationType) => {
        return NotificationComponent({
            title: title,
            message: message,
            intent: intent,
            ms_duration: ms_duration,
        })
    }
}
