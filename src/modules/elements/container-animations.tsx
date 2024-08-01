'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { animationsSwapAtom } from '@shared/animations-swapper'

export function ContainerAnimations({
  children,
  duration,
  delay,
  animation,
  className,
  id,
}: {
  children: React.ReactNode
  duration?: number
  delay?: number
  animation?: number
  className?: string
  id?: string
}) {
  const [value] = useAtom(animationsSwapAtom)

  if (value === 'false') {
    return (
      <div id={id} className={className}>
        {children}
      </div>
    )
  }

  const getAnimationProps = () => {
    const baseProps = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: duration ?? 0.4, delay: delay ?? 0 },
    }

    switch (animation) {
      case 1:
        return {
          ...baseProps,
          initial: { ...baseProps.initial, y: -5 },
          animate: { ...baseProps.animate, y: 0 },
          exit: { ...baseProps.exit, y: -5 },
        }
      case 2:
        return {
          ...baseProps,
          initial: { ...baseProps.initial, y: 5 },
          animate: { ...baseProps.animate, y: 0 },
          exit: { ...baseProps.exit, y: 5 },
        }
      case 3:
        return {
          ...baseProps,
          initial: { opacity: 0, y: -50, scale: 0.9, rotateX: 45 },
          animate: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
          exit: { opacity: 0, y: 50, scale: 0.9, rotateX: -45 },
          transition: {
            duration: 0.3,
            delay: delay ?? 0,
            ease: [0.6, 0.01, -0.05, 0.95],
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          },
        }
      case 4:
        return {
          ...baseProps,
          initial: { ...baseProps.initial, x: -10 },
          animate: { ...baseProps.animate, x: 0 },
          exit: { ...baseProps.exit, x: -10 },
        }
      case 5:
        return {
          ...baseProps,
          initial: { opacity: 0, y: 50, scale: 0.9, rotateX: 45 },
          animate: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
          exit: { opacity: 0, y: 50, scale: 0.9, rotateX: -45 },
          transition: {
            duration: 0.3,
            delay: 0,
            ease: [0.6, 0.01, -0.05, 0.95],
            opacity: { duration: 0.4 },
            scale: { duration: 0.4 },
          },
        }
      default:
        return {
          ...baseProps,
          initial: { ...baseProps.initial, x: -5 },
          animate: { ...baseProps.animate, x: 0 },
          exit: { ...baseProps.exit, x: -5 },
        }
    }
  }

  return (
    <motion.div id={id} className={className} {...getAnimationProps()}>
      {children}
    </motion.div>
  )
}
