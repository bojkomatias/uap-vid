import type { ProtocolSectionsDuration } from '@prisma/client'
import SectionViewer from '@protocol/elements/view/section-viewer'
import type { ListRowValues } from '@protocol/elements/view/item-list-view'
import ItemListView from '@protocol/elements/view/item-list-view'
import ItemView from '@protocol/elements/view/item-view'

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
        deepValues: data.chronogram.map((item) => {
            return {
                groupLabel: item.semester,
                data: item.data.reduce((newVal: ListRowValues[], item) => {
                    newVal.push([
                        {
                            up: '',
                            down: '• ' + item.task,
                            inverted: true,
                        },
                    ])
                    return newVal
                }, []),
            }
        }),
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
