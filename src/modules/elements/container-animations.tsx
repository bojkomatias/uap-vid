'use client'
import React from 'react'
import { motion } from 'framer-motion'

/**
 * @param Default_animation: 5px smooth entrance from left to right, opacity from 0 to 1 too.
 * @param Animation1: 5px smooth entrance from top to bottom, opacity from 0 to 1 too.
 * @param Animation2: 5px smooth entrance from bottom to top, opacity from 0 to 1 too.
 * @param Animation3: Awesome animation!!!.
 */
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
  if (!animation)
    return (
      <motion.div
        id={id}
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: duration ?? 0.4, delay: delay ?? 0 }}
      >
        {children}
      </motion.div>
    )
  if (animation == 1)
    return (
      <motion.div
        id={id}
        className={className}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration ?? 0.4, delay: delay ?? 0 }}
      >
        {children}
      </motion.div>
    )

  if (animation == 2)
    return (
      <motion.div
        id={id}
        className={className}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration ?? 0.4, delay: delay ?? 0 }}
      >
        {children}
      </motion.div>
    )
  if (animation == 3)
    return (
      <motion.div
        id={id}
        className={className}
        initial={{ opacity: 0, y: -50, scale: 0.9, rotateX: 45 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        transition={{
          duration: 0.3,
          delay: 0,
          ease: [0.6, 0.01, -0.05, 0.95],
          opacity: { duration: 0.4 },
          scale: { duration: 0.4 },
        }}
      >
        {children}
      </motion.div>
    )

  if (animation == 4)
    return (
      <motion.div
        id={id}
        className={className}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: duration ?? 0.4, delay: delay ?? 0 }}
      >
        {children}
      </motion.div>
    )
}
