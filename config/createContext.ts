import { createFormContext } from '@mantine/form'

export interface Input {
    [key: string]: any
}

export interface Section {
    id: number
    name: string
    description?: number
    data: Input
}

export interface Protocol {
    _id?: string
    createdAt: Date
    updatedAt: Date
    sections: Section[]
}

export const [ProtocolProvider, useProtocolContext, useProtocol] =
    createFormContext<Protocol>()

export const initialProtocolValues = {
    sections: [
        {
            id: 0,
            name: 'identificación',
            data: {
                title: '1',
                career: 'Hola',
                assignment: '',
                team: [{ role: '', name: '', hours: '' }],
                sponsor: '',
            },
        },
        {
            id: 1,
            name: 'duración',
            data: {
                modality: '',
                duration: '',
                chronogram: [],
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

export const validate = {
    sections: {
        data: {
            title: (value: any, _: any, path: any) =>
                path == 'sections.0.data.title' && value.length < 6
                    ? 'El titulo debe tener mínimo 6 caracteres'
                    : null,
            career: (value: any, _: any, path: any) =>
                path == 'sections.0.data.career' && value.length > 6
                    ? 'El titulo debe tener mínimo 6 caracteres'
                    : null,
            team: {
                role: (value: any, _: any, path: any) =>
                    path.match(/sections.0.data.team.[0-99].name/) &&
                    value.length < 1
                        ? 'Este campo no puede estar vacío'
                        : null,
                name: (value: any, _: any, path: any) =>
                    path.match(/sections.0.data.team.[0-99].name/) &&
                    value.length < 1
                        ? 'Este campo no puede estar vacío'
                        : null,
                hours: (value: any, _: any, path: any) =>
                    path.match(/sections.0.data.team.[0-99].hours/) &&
                    value.match(/^[0-9]*$/)
                        ? null
                        : 'Este campo debe contener un número',
            },
        },
    },
}
