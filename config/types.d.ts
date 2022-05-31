import { InputType } from './enums'

export interface Input {
    type: InputType
    title: string
    options?: any
    value: any
}

export interface Section {
    sectionId: number
    name: string
    description?: any
    data: Input[]
}

export interface Protocol {
    _id?: string
    data: Section[]
}
