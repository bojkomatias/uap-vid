'use server'

import { prisma } from '../utils/bd'
import { IndexSchema } from '@utils/zod'
import type { HistoricIndex } from '@prisma/client'
import { cache } from 'react'
import { recalculateSpecialCategories } from './team-member-category'

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

    const oldIndexValue = index.values.at(-1)

    // If array contains any item, update it's last to
    if (index.values.length > 0) oldIndexValue!.to = new Date()

    index.values.push(newIndexValue)

    const { id, ...restIndex } = IndexSchema.parse(index)

    const updated = await prisma.index.update({
      where: { id },
      data: restIndex,
    })

    await recalculateSpecialCategories(
      unit,
      oldIndexValue!.price,
      newIndexValue.price
    )

    return updated
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function getLatestIndexPriceByUnit(unit: 'FCA' | 'FMR') {
  const index = await getIndexByUnit(unit)

  const price = index.values.find((value) => value.to === null)?.price

  return price
}
