import { ProtocolSectionsDuration } from '@prisma/client'
import ShortDataList from '@protocol/elements/ShortData/ShortDataList'
import TableData from '@protocol/elements/TableData/TableData'
import React from 'react'
import SectionLayout from './SectionLayout'

interface DurationViewProps {
    data: ProtocolSectionsDuration
}
const DurationView = ({ data }: DurationViewProps) => {
    const shortData = [
        {
            title: 'Duración',
            value: data.duration,
        },
        {
            title: 'Modalidad',
            value: data.modality,
        },
    ]
    const tableData = {
        title: 'Cronograma',
        values: data.chronogram.reduce((newVal: any, item) => {
            newVal.push({
                left: {
                    up: 'Semestre',
                    down: item.semester,
                },
                right: {
                    up: 'Tarea',
                    down: item.task,
                },
            })
            return newVal
        }, []),
    }
    return (
        <SectionLayout
            title="Duración"
            description="Detalles de la duración del proyecto"
        >
            <ShortDataList data={shortData} />
            <TableData data={tableData} />
        </SectionLayout>
    )
}

export default DurationView
