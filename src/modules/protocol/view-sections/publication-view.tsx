import type { ProtocolSectionsPublication } from '@prisma/client'

import SectionViewer from '../elements/view/section-viewer'
import ItemView from '@protocol/elements/view/item-view'

interface PublicationViewProps {
  data: ProtocolSectionsPublication
}

const PublicationView = ({ data }: PublicationViewProps) => {
  const shortData = [
    {
      title: 'Producción científica',
      value: data.result,
    },
    {
      title: 'Producción tecnológica',
      value: data.technologicalResult ?? '',
    },
  ]
  return (
    <SectionViewer
      title="Producción"
      description="Producción esperada del proyecto"
    >
      {shortData.map((item) => (
        <ItemView key={item.title} title={item.title} value={item.value} />
      ))}
    </SectionViewer>
  )
}

export default PublicationView
