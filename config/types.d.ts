import { InputType } from './enums'

export interface Input {
    type: InputType
    title: string
    options?: any
    conditionalValues?: Input[]
    conditional?: boolean
    parent?: string
    value: any
}

export interface Section {
    sectionId: number
    name: string
    description?: number
    data: Input[]
}

export interface Protocol {
    _id?: string
    data: Section[]
}
