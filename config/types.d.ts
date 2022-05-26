import { InputType } from './enums'

export interface Input {
    type: InputType
    title: string
    value: any
}

export interface Section {
    id: number
    name: string
    description?: any
    data: Input[]
}

export interface Protocol {
    data: Section[]
}
