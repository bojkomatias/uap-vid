import type { ProtocolSectionsIdentification } from '@prisma/client'
import type { ListRowValues } from '@protocol/elements/item-list-view'
import ItemListView from '@protocol/elements/item-list-view'
import SectionViewer from '../elements/section-viewer'
import ItemView from '@protocol/elements/item-view'
interface IdentificationProps {
    data: ProtocolSectionsIdentification
}
export default function IdentificationView({ data }: IdentificationProps) {
    const shortData = [
        {
            title: 'Título',
            value: data.title,
        },
        {
            title: 'Carrera',
            value: data.career,
        },
        {
            title: 'Materia',
            value: data.assignment,
        },
        {
            title: 'Ente Patrocinante',
            value: data.sponsor.join(' | '),
        },
    ]
    const tableData = {
        title: 'Equipo',
        values: data.team.reduce((newVal: ListRowValues[], person) => {
            newVal.push([
                {
                    up: `${person.last_name}, ${person.name}`,
                    down: person.role,
                },
                {
                    up: 'Horas',
                    down: person.hours,
                },
            ])
            return newVal
        }, []),
    }
    return (
        <>
            <SectionViewer
                title="Identificación"
                description="Datos del proyecto"
            >
                <>
                    {/* Details of project */}
                    {shortData.map((item) => (
                        <ItemView
                            key={item.title}
                            title={item.title}
                            value={item.value}
                        />
                    ))}
                    {/* Team details */}
                    <ItemListView data={tableData} />
                </>
            </SectionViewer>
        </>
    )
}
