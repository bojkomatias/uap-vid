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

    const updated = await prisma.index.update({
      where: { id },
      data: restIndex,
    })

    await recalculateSpecialCategories()

    return updated
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function recalculateSpecialCategories() {
  try {
    const { currentFCA, currentFMR } = await getCurrentIndexes()
    const specialTeamMembers = await prisma.teamMemberCategory.findMany({
      where: { specialCategory: true },
    })

    const updatedCategories = specialTeamMembers.map((category) => {
      const price = category.specialCategoryPrices.find(x=>!x.to)!.price
      return {
        id: category.id,
        amountIndex: {
          FCA: price / currentFCA,
          FMR: price / currentFMR,
        },
      }})

      const promises = updatedCategories.map((category) =>
        prisma.teamMemberCategory.update({
          where: { id: category.id },
          data: { amountIndex: category.amountIndex },
        })
      )

      await Promise.all(promises)
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
