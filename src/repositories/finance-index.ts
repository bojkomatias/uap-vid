'use server'

import { prisma } from '../utils/bd'
import { IndexSchema } from '@utils/zod'
import type { HistoricIndex } from '@prisma/client'

export async function getIndexes() {
  try {
    return await prisma.index.findMany()
  } catch (error) {
    console.log(error)
    return null
  }
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
