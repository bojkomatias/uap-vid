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

const createSemesterTable = (value: string) => {
    if (!value) {
        return [] as Input[]
    }
    const semesterTable = []
    const quantity = Number(value.substring(0, 2)) / 6 // 1 per semester
    for (let index = 0; index < quantity; index++) {
        semesterTable.push({
            type: InputType.table,
            parent: 'escala temporal',
            title: `cronograma ${index + 1}° semestre`,
            options: [
                {
                    name: 'task',
                    header: 'Tarea',
                    type: InputType.text,
                },
                {
                    name: 'from',
                    header: 'Desde',
                    type: InputType.date,
                },
                {
                    name: 'to',
                    header: 'Hasta',
                    type: InputType.date,
                },
            ],
            value: [{ task: '', from: '', to: '' }],
        })
    }

    return semesterTable as Input[]
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
        case 'modalidad del proyecto':
            return (
                conditionalData?.filter((x: Input) => x.parent === value) || []
            )
        case 'escala temporal':
            return createSemesterTable(value)
        default:
            return []
    }
}

export { getConditionalValues }
