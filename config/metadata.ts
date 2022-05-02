import { InputType } from './enums'
import { Protocol } from './types'

export const ProtocolMetadata: Protocol = {
    content: [
        {
            // 1. Identificacion del Proyecto
            name: 'Identification',
            content: [
                // 1.1 Titulo
                { type: InputType.text, title: 'Titulo', value: '' },
                {
                    type: InputType.number,
                    title: 'Carrera',
                    value: '',
                },
            ],
        },
        {
            name: 'Duración del proyecto',
            content: [
                { type: InputType.text, title: 'Titulo', value: '' },
                {
                    type: InputType.text,
                    title: 'Carrera',
                    value: '',
                },
            ],
        },
    ],
}
