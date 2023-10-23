'use client'
import Notification from '@elements/notification'

export type NotificationType = {
    title: string
    message: string
    intent: 'primary' | 'success' | 'error'
    ms_duration: number
}

//La razón por la cual cree esta variable que devuelve lo mismo que podría devolver el useCustomNotification es porque me jodía con el error "Component definition is missing display name".
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
