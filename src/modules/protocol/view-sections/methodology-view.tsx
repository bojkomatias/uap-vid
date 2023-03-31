import { ProtocolSectionsMethodology } from '@prisma/client'
import TipTapViewer from '@protocol/elements/text-item-view'

import SectionViewer from '../elements/section-viewer'
import ItemView from '@protocol/elements/item-view'

interface MethodologyViewProps {
    data: ProtocolSectionsMethodology
}

const MethodologyView = ({ data }: MethodologyViewProps) => {
    const shortData = [
        {
            title: 'Tipo de Metodología',
            value: data.type,
        },
    ]
    return (
        <SectionViewer
            title="Metodología"
            description="Metodología del proyecto"
        >
            {shortData.map((item) => (
                <ItemView
                    key={item.title}
                    title={item.title}
                    value={item.value}
                />
            ))}

            {data.type ===
                'Investigaciones cuantitativas, cualitativas, mixtas o experimentales' && (
                <>
                    <TipTapViewer
                        title="Diseño y tipo de investigación"
                        content={data.design}
                    />
                    <TipTapViewer
                        title="Participantes"
                        content={data.participants}
                    />
                    <TipTapViewer
                        title="Lugar de desarrollo"
                        content={data.place}
                    />
                    <TipTapViewer
                        title="Instrumentos para recolección de datos"
                        content={data.instruments}
                    />
                    <TipTapViewer
                        title="Procedimientos para recolección de datos"
                        content={data.procedures}
                    />
                    <TipTapViewer
                        title="Análisis de datos"
                        content={data.analysis}
                    />
                    <TipTapViewer
                        title="Consideraciones"
                        content={data.considerations}
                    />
                </>
            )}

            {data.type === 'Investigaciones de tipo teóricas' && (
                <TipTapViewer
                    title="Detalle de la metodología"
                    content={data.detail}
                />
            )}
        </SectionViewer>
    )
}

export default MethodologyView
