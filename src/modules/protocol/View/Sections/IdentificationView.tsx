import { ProtocolSectionsIdentification } from '@prisma/client'
import ShortDataList from '@protocol/elements/ShortData/ShortDataList'
import TableData from '@protocol/elements/TableData/TableData'
import SectionLayout from './SectionLayout'
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
            value: data.sponsor,
        },
    ]
    const tableData = {
        title: 'Equipo',
        values: data.team.reduce((newVal:any, person) => {
            newVal.push({
                left: {
                    up: `${person.last_name}, ${person.name}`,
                    down: person.role,
                },
                right: {
                    up: "Horas",
                    down: person.hours,
                },
            })
            return newVal
        },[])
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
