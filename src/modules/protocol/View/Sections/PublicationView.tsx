import { ProtocolSectionsPublication } from '@prisma/client'
import RichViewer from '@protocol/elements/TipTapViewer'
import ShortDataList from '@protocol/elements/ShortData/ShortDataList'
import SectionLayout from './SectionLayout'

interface PublicationViewProps {
    data: ProtocolSectionsPublication
}

const PublicationView = ({ data }: PublicationViewProps) => {
    const shortData = [
        {
            title: 'Resultado de la investigación',
            value: data.result,
        },
    ]
    return (
        <SectionLayout
            title="Publicación"
            description="Que se publicará al finalizar el proyecto"
        >
            <ShortDataList data={shortData} />
            <RichViewer title="Titulo de publicación" content={data.title} />
        </SectionLayout>
    )
}

export default PublicationView
