'use client'

import { createFormContext } from '@mantine/form'
import type { ProtocolSchema, SectionsSchema } from './zod'
import type { z } from 'zod'

export const [ProtocolProvider, useProtocolContext, useProtocol] =
  createFormContext<z.infer<typeof ProtocolSchema>>()

export const initialSectionValues: z.infer<typeof SectionsSchema> = {
  identification: {
    courseId: null,
    careerId: '',
    academicUnitIds: [],
    team: [
      {
        hours: 0,
        last_name: null,
        name: null,
        role: 'Director',
        teamMemberId: null,
        workingMonths: 12,
        confirmed: true,
        categoryToBeConfirmed: null,
      },
    ],
    title: '',
  },
  duration: {
    chronogram: [],
    duration: '',
    modality: '',
  },
  budget: {
    expenses: [
      { type: 'Insumos', data: [] },
      { type: 'Libros', data: [] },
      {
        type: 'Materiales de Impresión',
        data: [],
      },
      { type: 'Viajes', data: [] },
      {
        type: 'Gastos por publicación',
        data: [],
      },
      { type: 'Otros', data: [] },
    ],
  },
  description: {
    discipline: '',
    field: '',
    line: '',
    technical: '',
    objective: '',
    type: '',
    words: '',
  },
  introduction: {
    justification: '',
    objectives: '',
    problem: '',
    state: '',
  },
  methodology: {
    considerations: null,
    analysis: null,
    detail: null,
    instruments: null,
    participants: null,
    procedures: null,
    design: null,
    humanAnimalOrDb: null,
    place: null,
    type: '',
  },
  publication: {
    title: '',
    result: '',
  },
  bibliography: {
    chart: [{ title: '', author: '', year: 0 }],
  },
}
