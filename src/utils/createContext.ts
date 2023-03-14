'use client'
import { createFormContext } from '@mantine/form'
import { Protocol } from './zod'

export const [ProtocolProvider, useProtocolContext, useProtocol] =
    createFormContext<Protocol>()

export const initialProtocolValues: Protocol = {
    sections: {
        identification: {
            assignment: '',
            career: '',
            sponsor: '',
            team: [],
            title: '',
        },
        duration: {
            chronogram: [],
            duration: '',
            modality: '',
        },
        budget: {
            expenses: [],
        },
        description: {
            discipline: '',
            field: '',
            line: '',
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
            type: '',
        },
        publication: {
            plan: '',
            result: '',
        },
        bibliography: {
            chart: [],
        },
    },
}
