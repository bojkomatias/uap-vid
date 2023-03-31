import { ProtocolSectionsBibliography } from '@prisma/client'
import ItemListView from '@protocol/elements/item-list-view'
import SectionViewer from '../elements/section-viewer'

interface BibliographyViewProps {
    data: ProtocolSectionsBibliography
}

const BibliographyView = ({ data }: BibliographyViewProps) => {
    const tableData = {
        title: 'Fuentes de información',
        values: data.chart.reduce((newVal: any, item) => {
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