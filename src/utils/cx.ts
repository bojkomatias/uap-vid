import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Utility function to efficiently merge Tailwind CSS classes in JS without style conflicts. */
export const cx = (...classes: ClassValue[]) => twMerge(clsx(...classes))
