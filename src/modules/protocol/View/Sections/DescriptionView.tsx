import { ProtocolSectionsDescription } from '@prisma/client'
import TipTapViewer from '@protocol/elements/TipTapViewer'
import ShortDataList from '@protocol/elements/ShortData/ShortDataList'
import SectionLayout from './SectionLayout'
export interface DescriptionViewProps {
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
        <SectionLayout
            title="Descripción"
            description="Descripción del proyecto"
        >
            <ShortDataList data={shortData} />
            <TipTapViewer title="Resumen Técnico" content={data.technical} />
        </SectionLayout>
    )
}

export default DescriptionView
