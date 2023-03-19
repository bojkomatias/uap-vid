import { ProtocolSectionsBibliography } from '@prisma/client'
import TableData from '@protocol/elements/TableData/TableData'
import SectionLayout from './SectionLayout'

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
        <SectionLayout
            title="Bibliografía"
            description="Recursos a ser utilizados en la investigación"
        >
            <TableData data={tableData} />
        </SectionLayout>
    )
}

export default BibliographyView
