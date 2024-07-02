import type { ProtocolSectionsBibliography } from '@prisma/client'
import type { ListRowValues } from '@protocol/elements/view/item-list-view'
import ItemListView from '@protocol/elements/view/item-list-view'
import SectionViewer from '../elements/view/section-viewer'

interface BibliographyViewProps {
  data: ProtocolSectionsBibliography
}

const BibliographyView = ({ data }: BibliographyViewProps) => {
  const tableData = {
    title: 'Fuentes de información',
    values: data.chart.reduce((newVal: ListRowValues[], item) => {
      newVal.push([
        {
          up: item.title,
          down: item.author,
        },
        {
          up: 'Año',
          down: item.year,
        },
      ])
      return newVal
    }, []),
  }

  return (
    <SectionViewer
      title="Bibliografía"
      description="Recursos a ser utilizados en la investigación"
    >
      <ItemListView data={tableData} />
    </SectionViewer>
  )
}

export default BibliographyView
