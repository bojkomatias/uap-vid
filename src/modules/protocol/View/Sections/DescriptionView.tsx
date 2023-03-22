import { ProtocolSectionsDescription } from '@prisma/client'
import ShortDataList from '@protocol/elements/ShortData/ShortDataList'
import SectionLayout from './SectionLayout'
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
        <SectionLayout
            title="Descripción"
            description="Descripción del proyecto"
        >
            <ShortDataList data={shortData} />
        </SectionLayout>
    )
}

export default DescriptionView
