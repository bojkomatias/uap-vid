import { createFormContext } from '@mantine/form'
import { protocol } from 'utils/zod/protocolSchema'

export const [ProtocolProvider, useProtocolContext, useProtocol] =
    createFormContext<protocol>()

export const initialProtocolValues = {
    sections: [
        {
            id: 0,
            name: 'identificación',
            data: {
                title: '1',
                career: '',
                assignment: '',
                team: [{ role: '', last_name: '', name: '', hours: '' }],
                sponsor: '',
            },
        },
        {
            id: 1,
            name: 'duración',
            data: {
                modality: '',
                duration: '',
                chronogram: [{ semester: '', task: '' }],
            },
        },
        {
            id: 2,
            name: 'presupuesto de gastos directos',
            data: {
                expenses: [
                    {
                        type: '',
                        detail: '',
                        amount: '',
                        year: '',
                    },
                ],
            },
        },
        {
            id: 3,
            name: 'descripción del proyecto',
            data: {
                discipline: '',
                line: '',
                words: '',
                field: '',
                objective: '',
                type: '',
            },
        },
        {
            id: 4,
            name: 'introducción del proyecto',
            data: {
                state: '',
                justification: '',
                problem: '',
                objetives: '',
            },
        },
        {
            id: 5,
            name: 'método',
            data: {
                type: '',
                // conditionals
                detail: '',
                design: '',
                participants: '',
                place: '',
                instruments: '',
                procedures: '',
                analysis: '',
                considerations: '',
            },
        },
        {
            id: 6,
            name: 'publicación científica',
            data: {
                result: '',
                plan: '',
            },
        },
        {
            id: 7,
            name: 'lista bibliográfica preliminar ',
            data: {
                chart: [{ author: '', title: '', year: '' }],
            },
        },
    ],
}
