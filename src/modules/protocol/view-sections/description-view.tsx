import type { ProtocolSectionsDescription } from '@prisma/client'

import SectionViewer from '../elements/section-viewer'
import ItemView from '@protocol/elements/item-view'
import TextItemView from '@protocol/elements/text-item-view'
interface DescriptionViewProps {
    data: ProtocolSectionsDescription
}
const DescriptionView = ({ data }: DescriptionViewProps) => {
    const shortData = [
        {
            title: 'Campo',
            value: data.field,
        },
        {
            title: 'Disciplina',
            value: data.discipline,
        },
        {
            title: 'Línea de investigación',
            value: data.line,
        },
        {
            title: 'Tipo de investigación',
            value: data.type,
        },
        {
            title: 'Objetivo',
            value: data.objective,
        },
        {
            title: 'Palabras clave',
            value: data.words,
        },
    ]

    return (
        <SectionViewer
            title="Descripción"
            description="Descripción del proyecto"
        >
            {shortData.map((item) => (
                <ItemView
                    key={item.title}
                    title={item.title}
                    value={item.value}
                />
            ))}
            <TextItemView title="Resumen Técnico" content={data.technical} />
        </SectionViewer>
    )
}

export default DescriptionView
