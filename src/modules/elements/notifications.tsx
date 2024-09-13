'use client'

import { Subheading } from '@components/heading'
import { Text } from '@components/text'
import { cx } from '@utils/cx'
import React, { useEffect, useId } from 'react'
import { createRoot } from 'react-dom/client'
import { CircleCheck, CircleX, InfoCircle, X } from 'tabler-icons-react'

type NotificationProps = {
  title: string
  message: string
  intent: 'info' | 'success' | 'error'
  duration?: number
}

const duration_default = 5000

class Notifications {
  show(props: NotificationProps) {
    const root = createRoot(document.getElementById('notifications-container')!)
    root.render(<Notification {...props} />)
  }
}

export const notifications = new Notifications()

const intents = {
  success: {
    background:
      'after:bg-teal-500/5 after:border-teal-500/20 dark:after:border-teal-800/20 dark:after:bg-teal-800/10',
    text: 'text-teal-700',
    icon: <CircleCheck className="mt-0.5 size-6 shrink-0 stroke-teal-600" />,
  },
  error: {
    background:
      'after:bg-red-500/5 after:border-red-500/20 dark:after:border-red-800/20 dark:after:bg-red-800/10',
    text: 'text-red-700',
    icon: <CircleX className="mt-0.5 size-6 shrink-0 stroke-red-600" />,
  },
  info: {
    background:
      'after:bg-primary-500/5 after:border-primary-500/20 dark:after:border-primary-800/20 dark:after:bg-primary-800/10',
    text: 'text-primary-950',
    icon: (
      <InfoCircle className="mt-0.5 size-6 shrink-0 stroke-primary-950 dark:stroke-primary-900" />
    ),
  },
}

/**
 * Notification Component
 */
function Notification({ title, message, intent, duration }: NotificationProps) {
  const id = useId()

  const closeNotification = () => {
    document.getElementById(id)?.classList.add('fade-out-right')
  }

  useEffect(() => {
    setTimeout(() => {
      document
        .getElementById('notification-timer')
        ?.classList.add('-translate-x-full')
    }, 100)
    setTimeout(() => {
      closeNotification()
    }, duration ?? duration_default)
  })

  return (
    <div
      id={id}
      className={cx(
        'fade-in-right fixed bottom-4 right-4 z-50 w-[24rem] rounded-md bg-white px-5 pb-4 pt-3 shadow-lg dark:bg-gray-800 dark:shadow-none',
        'overflow-hidden after:absolute after:inset-0 after:z-10 after:rounded-md after:border',
        intents[intent].background
      )}
    >
      <div className="flex justify-between">
        <div>
          <Subheading className={cx('!text-base/8', intents[intent].text)}>
            {title}
          </Subheading>
          <Text className="!text-xs/4">{message}</Text>
        </div>
        {intents[intent].icon}
      </div>
      <div
        id="notification-timer"
        className={cx(
          'absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-current transition-all duration-[4800ms] ease-linear',
          intents[intent].text
        )}
      ></div>
    </div>
  )
}
