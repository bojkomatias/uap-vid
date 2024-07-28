'use client'
import { Heading, Subheading } from '@components/heading'
import { Text } from '@components/text'
import { cx } from '@utils/cx'
import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Check, InfoCircle, X } from 'tabler-icons-react'

type NotificationProps = {
  title: string
  message: string
  intent: 'primary' | 'success' | 'error'
}

const duration_default = 5000

class Notifications {
  show(props: NotificationProps) {
    const root = createRoot(document.getElementById('notifications-container')!)
    root.render(<Notification {...props} />)
    setTimeout(() => {
      root.unmount()
    }, duration_default)
  }
}

export const notifications = new Notifications()

const colors = {
  primary: 'primary',
  success: 'green-800',
  error: 'red-500',
}

/**
 * Notification Component
 */
function Notification({ title, message, intent }: NotificationProps) {
  useEffect(() => {
    setTimeout(() => {
      document
        .getElementById('custom-notification')
        ?.classList.add('fade-out-right')
    }, duration_default - 600)
  })

  return (
    <div
      id="custom-notification"
      className="fade-in-right fixed bottom-[3%] right-[2%] z-[150] mx-auto flex w-[20rem] gap-2 rounded-md border bg-white p-2 text-sm shadow-lg dark:border-gray-700 dark:bg-gray-800"
    >
      <div
        className={cx(
          'min-h-[5rem] min-w-[4px] rounded-sm',
          `bg-${colors[intent]}`
        )}
      ></div>
      <div className="flex flex-grow flex-col">
        <div className="flex items-center gap-1 border-b pb-1 dark:border-gray-700">
          {intent == 'error' ?
            <X className={cx(`text-${colors[intent]}`)} />
          : intent == 'primary' ?
            <InfoCircle className={cx(`text-${colors[intent]}`)} />
          : <Check className={cx(`text-${colors[intent]}`)} />}
          <Subheading className={cx('font-semibold', `text-${colors[intent]}`)}>
            {title}
          </Subheading>
        </div>
        <Text className="my-auto font-semibold">{message}</Text>
      </div>
    </div>
  )
}
