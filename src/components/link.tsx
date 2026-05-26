'use client'

import * as Headless from '@headlessui/react'
import React from 'react'
import NextLink, { type LinkProps } from 'next/link'

export const Link = React.forwardRef(function Link(
  { as: _as, ...props }: LinkProps & React.ComponentPropsWithoutRef<'a'>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  // NextLink's deprecated `as` URL alias collides with Headless's `as`
  // render prop and is unused in this codebase — drop it.
  return <Headless.DataInteractive as={NextLink} {...props} ref={ref} />
})
