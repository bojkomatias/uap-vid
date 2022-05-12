import { InputType } from './enums'
import { Protocol } from './types'

export const ProtocolMetadata: Protocol = {
    data: [
        {
            // 1. Identificacion del Proyecto
            name: 'identification',
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
                    value: [{ role: 'Director', name: '', hours: '' }],
                },
                {
                    type: InputType.select,
                    title: 'modalidad del proyecto',
                    value: [
                        'Proyecto regular de investigacion (PRI)',
                        'Proyecto de investigacion con becados (PIB)',
                    ],
                },
                {
                    type: InputType.select,
                    title: 'entre patrocinante',
                    value: [
                        'Facultad de Ciencias Economicas y de la Administracion (FACEA)',
                        'Facultad de Ciencias de la Salud (FCS)',
                        'Facultad de Humanidades, Educacion y Ciencias Sociales (FHECIS)',
                    ],
                },
            ],
        },
        {
            name: 'duración del proyecto',
            data: [
                {
                    type: InputType.select,
                    title: 'escala temporal',
                    value: ['Doce (12) meses', 'Veinticuatro (24) meses'],
                },
            ],
        },
        {
            name: 'cronograma de tareas (se puede pensar mejor para el sistema)',
            data: [
                {
                    type: InputType.table,
                    title: 'escala temporal',
                    value: [{ task: '', date: '', duration: '' }],
                },
            ],
        },
        {
            name: 'informe de avance (ver que onda)',
            data: [
                {
                    type: InputType.text,
                    title: '4.1',
                    value: '',
                },
                {
                    type: InputType.text,
                    title: '4.2',
                    value: '',
                },
                {
                    type: InputType.text,
                    title: '4.3',
                    value: '',
                },
                {
                    type: InputType.text,
                    title: '4.4',
                    value: '',
                },
            ],
        },
        {
            name: 'presupuesto de gastos directos',
            data: [
                {
                    type: InputType.text,
                    title: '5.1',
                    value: '',
                },
                {
                    type: InputType.text,
                    title: '5.1.1',
                    value: '',
                },
                {
                    type: InputType.text,
                    title: '5.1.2',
                    value: '',
                },
            ],
        },
        {
            name: 'presupuesto (puede haber un selector de tipos en vez de muchas tablas)',
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
            name: 'descripcion del proyecto',
            data: [
                {
                    type: InputType.text,
                    title: '7.1',
                    value: '',
                },
            ],
        },
        {
            name: 'introduccion del proyecto',
            data: [
                {
                    type: InputType.text,
                    title: '8.1',
                    value: '',
                },
            ],
        },
        {
            name: 'método',
            data: [
                {
                    type: InputType.text,
                    title: '9.1',
                    value: '',
                },
            ],
        },
        {
            name: 'publicación cientifica',
            data: [
                {
                    type: InputType.text,
                    title: '10.1',
                    value: '',
                },
            ],
        },
        {
            name: 'lista bibliografica preeliminar',
            data: [],
        },
        {
            name: 'curricullum del director (ver que onda)',
            data: [
                {
                    type: InputType.text,
                    title: '12.1',
                    value: '',
                },
            ],
        },
    ],
}
