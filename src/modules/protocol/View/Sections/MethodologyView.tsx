import { ProtocolSectionsMethodology } from '@prisma/client'
import TipTapViewer from '@protocol/elements/TipTapViewer'
import ShortDataList from '@protocol/elements/ShortData/ShortDataList'
import SectionLayout from './SectionLayout'

export interface MethodologyViewProps {
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
        <SectionLayout
            title="Metodología"
            description="Metodología del proyecto"
        >
            <ShortDataList data={shortData} />

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
        </SectionLayout>
    )
}

export default MethodologyView
