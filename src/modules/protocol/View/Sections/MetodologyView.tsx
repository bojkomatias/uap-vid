import { ProtocolSectionsMethodology } from '@prisma/client'
import RichViewer from '@protocol/elements/RichViewer'
import ShortDataList from '@protocol/elements/ShortData/ShortDataList'
import React from 'react'
import SectionLayout from './SectionLayout'

interface MetodologyViewProps {
    data: ProtocolSectionsMethodology
}

const MetodologyView = ({ data }: MetodologyViewProps) => {
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

            
            {data.type === 'Investigaciones cuantitativas, cualitativas, mixtas o experimentales' && (
                <>
                    <RichViewer title='Diseño y tipo de investigación' content={data.design} />
                    <RichViewer title='Participantes' content={data.participants} />
                    <RichViewer title='Lugar de desarrollo' content={data.place} />
                    <RichViewer title='Instrumentos para recolección de datos' content={data.instruments} />
                    <RichViewer title='Procedimientos para recolección de datos' content={data.procedures} />
                    <RichViewer title='Análisis de datos' content={data.analysis} />
                    <RichViewer title='Consideraciones' content={data.considerations} />
                </>
            )}


            {data.type === "Investigaciones de tipo teóricas" && (
                <RichViewer title='Detalle de la metodología' content={data.detail} />
            )}

        </SectionLayout>
    )
}

export default MetodologyView
