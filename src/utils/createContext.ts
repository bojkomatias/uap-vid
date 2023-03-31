'use client'
import { createFormContext } from '@mantine/form'
import { Protocol, Sections } from './zod'

export const [ProtocolProvider, useProtocolContext, useProtocol] =
    createFormContext<Protocol>()

export const initialSectionValues: Sections = {
    identification: {
        assignment: '',
        career: '',
        sponsor: [],
        team: [],
        title: '',
    },
    duration: {
        chronogram: [],
        duration: '',
        modality: '',
    },
    budget: {
        expenses: [{ type: '', detail: '', amount: 0, year: '' }],
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
