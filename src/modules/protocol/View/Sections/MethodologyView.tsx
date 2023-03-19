import { ProtocolSectionsMethodology } from '@prisma/client'
import RTEViewer from '@protocol/elements/form/RTEViewer'
import ShortDataList from '@protocol/elements/ShortData/ShortDataList'
import SectionLayout from './SectionLayout'

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
        <SectionLayout
            title="Metodología"
            description="Metodología del proyecto"
        >
            <ShortDataList data={shortData} />

            {data.type ===
                'Investigaciones cuantitativas, cualitativas, mixtas o experimentales' && (
                <>
                    <RTEViewer
                        title="Diseño y tipo de investigación"
                        content={data.design}
                    />
                    <RTEViewer
                        title="Participantes"
                        content={data.participants}
                    />
                    <RTEViewer
                        title="Lugar de desarrollo"
                        content={data.place}
                    />
                    <RTEViewer
                        title="Instrumentos para recolección de datos"
                        content={data.instruments}
                    />
                    <RTEViewer
                        title="Procedimientos para recolección de datos"
                        content={data.procedures}
                    />
                    <RTEViewer
                        title="Análisis de datos"
                        content={data.analysis}
                    />
                    <RTEViewer
                        title="Consideraciones"
                        content={data.considerations}
                    />
                </>
            )}

            {data.type === 'Investigaciones de tipo teóricas' && (
                <RTEViewer
                    title="Detalle de la metodología"
                    content={data.detail}
                />
            )}
        </SectionLayout>
    )
}

export default MethodologyView
