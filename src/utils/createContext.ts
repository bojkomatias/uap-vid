import { createFormContext } from '@mantine/form'
import { protocol, ProtocolSections } from '@prisma/client'

export const [ProtocolProvider, useProtocolContext, useProtocol] =
    createFormContext<protocol>()

export const initialProtocolValues: { sections: ProtocolSections } = {
    sections: {
        identification: {
            assignment: '',
            career: '',
            sponsor: '',
            team: [
                {
                    hours: '',
                    last_name: '',
                    name: '',
                    role: '',
                },
                {
                    hours: '',
                    last_name: '',
                    name: '',
                    role: '',
                },
                {
                    hours: '',
                    last_name: '',
                    name: '',
                    role: '',
                },
            ],
            title: '',
        },
        duration: {
            chronogram: [
                { semester: '', task: '' },
                { semester: '', task: '' },
            ],
            duration: '',
            modality: '',
        },
        budget: {
            expenses: [
                {
                    amount: '',
                    detail: '',
                    type: '',
                    year: '',
                },
                {
                    amount: '',
                    detail: '',
                    type: '',
                    year: '',
                },
            ],
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
            analysis: '',
            considerations: '',
            design: '',
            instruments: '',
            participants: '',
            place: '',
            procedures: '',
            type: '',
        },
        publication: {
            plan: '',
            result: '',
        },
        bibliography: {
            chart: [
                {
                    author: '',
                    title: '',
                    year: '',
                },
                {
                    author: '',
                    title: '',
                    year: '',
                },
            ],
        },
    },
}
