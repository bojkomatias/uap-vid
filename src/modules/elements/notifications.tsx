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
    background: 'after:bg-teal-500/10 dark:after:bg-teal-900/5',
    text: 'text-teal-700',
    icon: <CircleCheck className="mt-0.5 size-6 shrink-0 stroke-teal-600" />,
  },
  error: {
    background: 'after:bg-red-500/10 dark:after:bg-red-900/5',
    text: 'text-red-700',
    icon: <CircleX className="mt-0.5 size-6 shrink-0 stroke-red-600" />,
  },
  info: {
    background: 'after:bg-primary-500/10 dark:after:bg-transparent',
    text: 'text-primary-950',
    icon: (
      <InfoCircle className="mt-0.5 size-6 shrink-0 stroke-primary-950 dark:stroke-primary-900" />
    ),
  },
}

/**
 * Notification Component
 */
function Notification({ title, message, intent }: NotificationProps) {
  const id = useId()

  const closeNotification = () => {
    document.getElementById(id)?.classList.add('fade-out-right')
  }

  useEffect(() => {
    setTimeout(() => {
      closeNotification()
    }, duration_default)
  })

  return (
    <div
      id={id}
      className={cx(
        'fade-in-right fixed bottom-4 right-4 w-[22rem] rounded-lg bg-white px-4 py-3 shadow-lg dark:bg-gray-900 dark:shadow-none',
        'after:absolute after:inset-0 after:z-10 after:rounded-lg after:border after:border-gray-200 after:dark:border-gray-800',
        intents[intent].background
      )}
    >
      <X
        onClick={closeNotification}
        className={cx(
          'absolute -left-1.5 -top-1.5 z-20 size-[18px] cursor-pointer rounded-full border border-gray-200 bg-white stroke-gray-500 p-0.5 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-700'
        )}
      />
      <div className="flex justify-between">
        <div>
          <Subheading className={cx('mb-0.5', intents[intent].text)}>
            {title}
          </Subheading>
          <Text className="!text-xs/4">{message}</Text>
        </div>
        {intents[intent].icon}
      </div>
    </div>
  )
}
