import { InputType } from './enums'

export interface Input {
    type: InputType
    title: string
    value: any
}

export interface Section {
    name: string
    data: Input[]
}

export interface Protocol {
    data: Section[]
}
