import type { ProtocolSectionsPublication } from '@prisma/client'
import RichViewer from '@protocol/elements/text-item-view'

import SectionViewer from '../elements/section-viewer'
import ItemView from '@protocol/elements/item-view'

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
        <SectionViewer
            title="Publicación"
            description="Que se publicará al finalizar el proyecto"
        >
            {shortData.map((item) => (
                <ItemView
                    key={item.title}
                    title={item.title}
                    value={item.value}
                />
            ))}
            <RichViewer title="Titulo de publicación" content={data.title} />
        </SectionViewer>
    )
}

export default PublicationView
