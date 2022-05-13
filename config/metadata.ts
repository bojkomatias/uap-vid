import { InputType } from './enums'
import { Protocol } from './types'

export const ProtocolMetadata: Protocol = {
    data: [
        {
            // 1. Identificacion del Proyecto
            id: 1,
            name: 'identificación',
            data: [
                // 1.1 Titulo
                { type: InputType.text, title: 'titulo', value: '' },
                {
                    type: InputType.text,
                    title: 'carrera y materia',
                    value: '',
                },
                {
                    type: InputType.table,
                    title: 'miembros del equipo',
                    value: [{ role: '', name: '', hours: '' }],
                },
                {
                    type: InputType.select,
                    title: 'modalidad del proyecto',
                    value: [
                        'Proyecto regular de investigación (PRI)',
                        'Proyecto de investigación con becados (PIB)',
                        'Proyecto de investigación desde las cátedras (PIC)',
                        'Proyecto de investigación institucional (PII)',
                        'Proyecto de investigación interfacultades (PIIF)',
                        'Proyecto I + D + i (PIDi)',
                        'Tesis',
                    ],
                },
                {
                    type: InputType.select,
                    title: 'entre patrocinante',
                    value: [
                        'Facultad de Ciencias Economicas y de la Administracion (FACEA)',
                        'Facultad de Ciencias de la Salud (FCS)',
                        'Facultad de Humanidades, Educacion y Ciencias Sociales (FHECIS)',
                        'Facultad de Teología (FT)',
                        'Consejo Nacional de Investigaciones Científicas y Técnicas (CONICET)',
                        'Centro de investigación o departamento',
                        'Escuela de graduados (EG)',
                    ],
                },
            ],
        },
        {
            id: 2,
            name: 'duración del proyecto',
            data: [
                {
                    type: InputType.select,
                    title: 'escala temporal',
                    value: [
                        '12 meses',
                        '24 meses',
                        '36 meses',
                        '48 meses',
                        '60 meses',
                    ],
                },
            ],
        },
        {
            id: 3,
            name: 'cronograma de tareas',
            data: [
                {
                    type: InputType.table,
                    title: 'cronograma',
                    value: [{ task: '', date: '', duration: '' }],
                },
            ],
        },
        {
            id: 4,
            name: 'informe de avance',
            data: [
                {
                    type: InputType.textarea,
                    title: 'informe de avance',
                    value: '',
                },
            ],
        },
        {
            id: 5,
            name: 'presupuesto de gastos directos',
            data: [
                {
                    type: InputType.textarea,
                    title: 'gastos directos',
                    value: '',
                },
            ],
        },
        {
            id: 6,
            name: 'presupuesto',
            data: [
                {
                    type: InputType.table,
                    title: 'insumos de laboratorio',
                    value: [{ detail: '', amount: '', year: '' }],
                },
                {
                    type: InputType.table,
                    title: 'libros',
                    value: [{ detail: '', amount: '', year: '' }],
                },
                {
                    type: InputType.table,
                    title: 'viajes',
                    value: [{ detail: '', amount: '', year: '' }],
                },
            ],
        },
        {
            id: 7,
            name: 'descripción del proyecto',
            data: [
                {
                    type: InputType.textarea,
                    title: 'descripción del proyecto',
                    value: '',
                },
            ],
        },
        {
            id: 8,
            name: 'introducción del proyecto',
            data: [
                {
                    type: InputType.textarea,
                    title: 'introducción del proyecto',
                    value: '',
                },
            ],
        },
        {
            id: 9,
            name: 'método',
            data: [
                {
                    type: InputType.textarea,
                    title: 'método',
                    value: '',
                },
            ],
        },
        {
            id: 10,
            name: 'publicación cientifica',
            data: [
                {
                    type: InputType.textarea,
                    title: 'publicación cientifica',
                    value: '',
                },
            ],
        },
        {
            id: 11,
            name: 'lista bibliografica preeliminar',
            data: [],
        },
        {
            id: 12,
            name: 'curricullum del director',
            data: [
                {
                    type: InputType.text,
                    title: 'curriculum del director',
                    value: '',
                },
            ],
        },
    ],
}
