'use server'

import { prisma } from '../utils/bd'
import { IndexSchema } from '@utils/zod'
import type { HistoricIndex } from '@prisma/client'
import { cache } from 'react'

export const getCurrentIndexes = cache(async () => {
  const [FCAValues, FMRValues] = await prisma.$transaction([
    prisma.index.findFirstOrThrow({
      where: { unit: 'FCA' },
      select: { values: true },
    }),
    prisma.index.findFirstOrThrow({
      where: { unit: 'FMR' },
      select: { values: true },
    }),
  ])

  const [currentFCA, currentFMR] = [
    FCAValues.values.at(-1)!.price,
    FMRValues.values.at(-1)!.price,
  ]

  return { currentFCA, currentFMR }
})

export async function getIndexByUnit(unit: 'FCA' | 'FMR') {
  return await prisma.index.findFirstOrThrow({
    where: { unit },
  })
}

export async function updateIndexByUnit(
  unit: 'FCA' | 'FMR',
  newIndexValue: HistoricIndex
) {
  try {
    const index = await prisma.index.findFirstOrThrow({ where: { unit } })

    // If array contains any item, update it's last to
    if (index.values.length > 0) index.values.at(-1)!.to = new Date()

    index.values.push(newIndexValue)

    const { id, ...restIndex } = IndexSchema.parse(index)

    return await prisma.index.update({
      where: { id },
      data: restIndex,
    })
  } catch (error) {
    console.error(error)
    return null
  }
}
