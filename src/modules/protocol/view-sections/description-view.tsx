import type { ProtocolSectionsDescription } from '@prisma/client'

import SectionViewer from '../elements/view/section-viewer'
import ItemView from '@protocol/elements/view/item-view'
import TextItemView from '@protocol/elements/view/text-item-view'
interface DescriptionViewProps {
  data: ProtocolSectionsDescription
}
const DescriptionView = ({ data }: DescriptionViewProps) => {
  const shortData = [
    {
      title: 'Campo de aplicación',
      value: data.field,
    },
    {
      title: 'Área de investigación',
      value: data.discipline,
    },
    {
      title: 'Línea de investigación',
      value: data.line,
    },
    {
      title: 'Tipo de investigación según el propósito',
      value: data.type,
    },
    {
      title: 'Tipo de investigación según el enfoque metodológico',
      value: data.methodologicalApproach ?? '',
    },
    {
      title: 'Tipo de investigación según el diseño metodológico',
      value: data.methodologicalDesign ?? '',
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
    <SectionViewer title="Descripción" description="Descripción del proyecto">
      {shortData.map((item) => (
        <ItemView key={item.title} title={item.title} value={item.value} />
      ))}
      <TextItemView title="Resumen Técnico" content={data.technical} />
    </SectionViewer>
  )
}

export default DescriptionView
