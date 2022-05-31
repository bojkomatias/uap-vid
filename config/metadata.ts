import { InputType } from './enums'
import { Protocol } from './types'
import { Helpers } from './helpers'
export const ProtocolMetadata: Protocol = {
    data: [
        {
            // 1. Identificacion del Proyecto
            sectionId: 1,
            name: 'identificación',
            description: Helpers[0],
            data: [
                // 1.1 Titulo
                { type: InputType.text, title: 'titulo', value: '' },
                {
                    type: InputType.text,
                    title: 'carrera y materia',
                    value: null,
                },
                {
                    type: InputType.table,
                    title: 'miembros del equipo',
                    options: [{ role: '', name: '', hours: '' }],
                    value: null,
                },
                {
                    type: InputType.select,
                    title: 'modalidad del proyecto',
                    options: [
                        'Proyecto regular de investigación (PRI)',
                        'Proyecto de investigación con becados (PIB)',
                        'Proyecto de investigación desde las cátedras (PIC)',
                        'Proyecto de investigación institucional (PII)',
                        'Proyecto de investigación interfacultades (PIIF)',
                        'Proyecto I + D + i (PIDi)',
                        'Tesis',
                    ],
                    value: null,
                },
                {
                    type: InputType.select,
                    title: 'entre patrocinante',

                    options: [
                        'Facultad de Ciencias Economicas y de la Administracion (FACEA)',
                        'Facultad de Ciencias de la Salud (FCS)',
                        'Facultad de Humanidades, Educacion y Ciencias Sociales (FHECIS)',
                        'Facultad de Teología (FT)',
                        'Consejo Nacional de Investigaciones Científicas y Técnicas (CONICET)',
                        'Centro de investigación o departamento',
                        'Escuela de graduados (EG)',
                    ],
                    value: null,
                },
            ],
        },
        {
            sectionId: 2,
            name: 'duración del proyecto',
            data: [
                {
                    type: InputType.select,
                    title: 'escala temporal',
                    options: [
                        '12 meses',
                        '24 meses',
                        '36 meses',
                        '48 meses',
                        '60 meses',
                    ],
                    value: null,
                },
            ],
        },
        {
            sectionId: 3,
            name: 'cronograma de tareas',
            data: [
                {
                    type: InputType.table,
                    title: 'cronograma',
                    options: [{ task: '', date: '', duration: '' }],
                    value: null,
                },
            ],
        },
        {
            sectionId: 4,
            name: 'presupuesto de gastos directos',
            description: Helpers[0],
            data: [
                {
                    type: InputType.textarea,
                    title: 'gastos directos',
                    value: null,
                },
                {
                    type: InputType.table,
                    title: 'insumos de laboratorio',
                    options: [{ type: '', detail: '', amount: '', year: '' }],
                    value: null,
                },
            ],
        },

        {
            sectionId: 5,
            name: 'descripción del proyecto',

            data: [
                {
                    type: InputType.textarea,
                    title: 'descripción del proyecto',
                    value: null,
                },
            ],
        },
        {
            sectionId: 6,
            name: 'introducción del proyecto',
            data: [
                {
                    type: InputType.textarea,
                    title: 'introducción del proyecto',
                    value: null,
                },
            ],
        },
        {
            sectionId: 7,
            name: 'método',
            data: [
                {
                    type: InputType.textarea,
                    title: 'método',
                    value: null,
                },
            ],
        },
        {
            sectionId: 8,
            name: 'publicación cientifica',
            data: [
                {
                    type: InputType.textarea,
                    title: 'publicación cientifica',
                    value: null,
                },
            ],
        },
        {
            sectionId: 9,
            name: 'lista bibliografica preeliminar',
            data: [],
        },
        {
            sectionId: 10,
            name: 'curricullum del director',
            data: [
                {
                    type: InputType.text,
                    title: 'curriculum del director',
                    value: null,
                },
            ],
        },
    ],
}
