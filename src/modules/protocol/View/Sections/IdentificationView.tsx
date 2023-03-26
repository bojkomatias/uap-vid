import { ProtocolSectionsIdentification } from '@prisma/client'
import ShortDataList from '@protocol/elements/ShortData/ShortDataList'
import TableData from '@protocol/elements/TableData/TableData'
import SectionLayout from './SectionLayout'
export interface IdentificationProps {
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
            value: data.sponsor.reduce((allSponsors, sponsor) => {
                if (allSponsors === '') allSponsors += `${sponsor}`
                allSponsors += `, ${sponsor}`
                return allSponsors
            }, ''),
        },
    ]
    const tableData = {
        title: 'Equipo',
        values: data.team.reduce((newVal: any, person) => {
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
            <SectionLayout
                title="Identification"
                description="Datos del proyecto"
            >
                <>
                    {/* Details of project */}
                    <ShortDataList data={shortData} />
                    {/* Team details */}
                    <TableData data={tableData} />
                </>
            </SectionLayout>
        </>
    )
}
