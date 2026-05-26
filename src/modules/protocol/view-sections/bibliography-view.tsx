import type { ProtocolSectionsBibliography } from '@prisma/client'
import TextItemView from '@protocol/elements/view/text-item-view'
import { chartToBibliographyHtml } from '@utils/bibliography'
import SectionViewer from '../elements/view/section-viewer'

interface BibliographyViewProps {
  data: ProtocolSectionsBibliography
}

const BibliographyView = ({ data }: BibliographyViewProps) => {
  const content =
    data.content && data.content.trim().length > 0 ?
      data.content
    : chartToBibliographyHtml(data.chart)

  return (
    <SectionViewer
      title="Bibliografía"
      description="Recursos a ser utilizados en la investigación"
    >
      <TextItemView title="Fuentes de información" content={content || null} />
    </SectionViewer>
  )
}

export default BibliographyView
