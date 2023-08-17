import type { ClassValue } from 'clsx';
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'
export const cx = (...classes: ClassValue[]) => twMerge(clsx(...classes))
