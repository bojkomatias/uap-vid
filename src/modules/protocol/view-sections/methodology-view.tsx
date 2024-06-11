import type { ProtocolSectionsMethodology } from '@prisma/client'
import SectionViewer from '../elements/view/section-viewer'
import ItemView from '@protocol/elements/view/item-view'
import TextItemView from '@protocol/elements/view/text-item-view'

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
    <SectionViewer title="Metodología" description="Metodología del proyecto">
      {shortData.map((item) => (
        <ItemView key={item.title} title={item.title} value={item.value} />
      ))}

      {data.type ===
        'Investigaciones cuantitativas, cualitativas, mixtas o experimentales' && (
        <>
          <TextItemView
            title="Diseño y tipo de investigación"
            content={data.design}
          />
          <TextItemView title="Participantes" content={data.participants} />
          <TextItemView title="Lugar de desarrollo" content={data.place} />
          <TextItemView
            title="Instrumentos para recolección de datos"
            content={data.instruments}
          />
          <TextItemView
            title="Procedimientos para recolección de datos"
            content={data.procedures}
          />
          <TextItemView title="Análisis de datos" content={data.analysis} />
          <TextItemView title="Consideraciones" content={data.considerations} />
        </>
      )}

      {data.type === 'Investigaciones de tipo teóricas' && (
        <TextItemView title="Detalle de la metodología" content={data.detail} />
      )}
    </SectionViewer>
  )
}

export default MethodologyView
