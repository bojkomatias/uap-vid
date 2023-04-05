import type { ProtocolSectionsDuration } from '@prisma/client'
import SectionViewer from '@protocol/elements/section-viewer'
import ItemListView from '@protocol/elements/item-list-view'
import ItemView from '@protocol/elements/item-view'

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
            newVal.push([
                {
                    up: 'Semestre',
                    down: item.semester,
                },
                {
                    up: 'Tarea',
                    down: item.task,
                },
            ])
            return newVal
        }, []),
    }
    return (
        <SectionViewer
            title="Duración"
            description="Detalles de la duración del proyecto"
        >
            {shortData.map((item) => (
                <ItemView
                    key={item.title}
                    title={item.title}
                    value={item.value}
                />
            ))}
            <ItemListView data={tableData} />
        </SectionViewer>
    )
}

export default DurationView
