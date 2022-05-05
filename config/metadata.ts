import { InputType } from './enums'
import { Protocol } from './types'

export const ProtocolMetadata: Protocol = {
    content: [
        {
            // 1. Identificacion del Proyecto
            name: 'identification',
            content: [
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
                    keys: ['director', 'integrantes'],
                    value: [
                        { role: 'director', name: '' },
                        { role: 'codirector', name: '' },
                    ],
                },
            ],
        },
        {
            name: 'duración del proyecto',
            content: [
                { type: InputType.text, title: 'escala temporal', value: '' },
                {
                    type: InputType.text,
                    title: 'dias',
                    value: '',
                },
            ],
        },
    ],
}
