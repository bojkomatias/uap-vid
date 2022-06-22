import { Input, Section } from './types'
import c from '././careers.json'
import { InputType } from './enums'

const filterMateria = (value: string) => {
    if (!value) {
        return [] as Input[]
    }
    const assignments = c
        .filter((x) => x.career === value)
        .map((x) => x.assignment)
        .flat()

    return [
        {
            type: InputType.select,
            title: 'materia',
            options: assignments,
            parent: 'carrera',
            value: null,
        },
    ] as Input[]
}

const getConditionalValues = (
    title: string,
    value: any,
    conditionalData?: Input[]
): Input[] => {
    if (!title) {
        return []
    }
    //TODO: Mejorar switch
    switch (title) {
        case 'carrera':
            return filterMateria(value)
        case 'Tipo de investigación':
            return (
                conditionalData?.filter((x: Input) => x.parent === value) || []
            )
        default:
            return []
    }
}

export { getConditionalValues }
