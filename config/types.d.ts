import { InputType } from './enums'

export interface Input {
    type: InputType
    title: string
    keys?: string[]
    value: any
}

export interface Section {
    name: string
    content: Input[]
}

export interface Protocol {
    content: Section[]
}
