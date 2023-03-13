'use client'
import { PropsWithChildren } from 'react'
import { QuestionMark } from 'tabler-icons-react'
import { useProtocolContext } from 'config/createContext'
import full from 'config/careers.json'
import { motion } from 'framer-motion'
import Input from '@protocol/elements/Input'
import Select from '@protocol/elements/Select'
import Table from '@protocol/elements/Table'
import InfoTooltip from '@protocol/elements/InfoTooltip'

const careers = full.map((x) => x.career)
// conditional
const assignments = (v: any) =>
    full
        .filter((x) => x.career === v)
        .map((x) => x.assignment)
        .flat()

const sponsors = [
    'Facultad de Ciencias Económicas y de la Administración (FACEA)',
    'Facultad de Ciencias de la Salud (FCS)',
    'Facultad de Humanidades, Educación y Ciencias Sociales (FHECIS)',
    'Facultad de Teología (FT)',
    'Consejo Nacional de Investigaciones Científicas y Técnicas (CONICET)',
    'Centro de investigación o departamento',
    'Escuela de graduados (EG)',
]

export default function Identification({
    id,
}: PropsWithChildren<{ id: string }>) {
    const form = useProtocolContext()
    const path = 'sections.' + id + '.data.'

    return (
        <motion.div
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="-translate-x-[6px] opacity-0"
        >
            <div className="flex grow items-center">
                <span className="ml-10 text-xl font-bold uppercase text-primary">
                    {form.values.sections[Number(id)].name}
                </span>
            </div>
            <Info />
            <div className="mx-auto max-w-6xl">
                <Input path={path} x="title" label="titulo" />
                <Select
                    path={path}
                    x="career"
                    options={careers}
                    label="carrera"
                    conditionalCleanup={() =>
                        (form.values.sections[Number(id)].data.assignment = '')
                    }
                />
                <Select
                    path={path}
                    x="assignment"
                    label="materia"
                    options={assignments(
                        form.values.sections[Number(id)].data.career
                    )}
                />
                <Table
                    path={path}
                    x="team"
                    label="miembros de equipo"
                    toMap={form.values.sections[Number(id)].data.team}
                    insertedItemFormat={{ role: '', name: '', hours: '' }}
                    headers={[
                        {
                            x: 'role',
                            label: 'rol',
                            options: [
                                'Director',
                                'Codirector',
                                'Investigador UAP',
                                'Investigador Externo UAP',
                                'Técnico Asistente',
                                'Técnico Asociado',
                                'Técnico Principal',
                                'Profesional Adjunto',
                                'Profesional Principal',
                                'Becario CONICET',
                            ],
                        },
                        { x: 'last_name', label: 'apellido' },
                        { x: 'name', label: 'nombre' },
                        { x: 'hours', label: 'horas' },
                    ]}
                />
                <Select
                    path={path}
                    x="sponsor"
                    label="ente patrocinante"
                    options={sponsors}
                />
            </div>
        </motion.div>
    )
}

const Info = () => (
    <InfoTooltip>
        <p>
            <b>Codirector:</b> En el caso de un proyecto tesis de posgrado,
            agregar el nombre del director o consejero.
        </p>
        <p>
            {' '}
            <b>Investigadores externos UAP:</b> Colaboradores adhonorem{' '}
        </p>
        <p>
            {' '}
            <b>Técnico y Profesionales:</b> Después de que el proyecto sea
            aprobado y asignados los técnicos y los profesionales becados,
            deberá adjuntar un archivo para justificar la participación y
            detallar exhaustivamente las actividades que llevará a cabo cada
            uno, junto con: Conocimientos previos requeridos. Datos personales:
            apellido y nombre, tipo y número de documento, dirección de correo
            electrónico y dirección postal. Estudios: cantidad de asignaturas
            regularizadas y aprobadas de la carrera en curso o título de las
            carreras de grado o posgrado terminadas. Cursos realizados. Becas
            obtenidas anteriormente. Idiomas: con qué idiomas puede trabajar y
            con qué nivel en cada caso. Carta escrita por el postulante en la
            que fundamente la solicitud de la beca.
        </p>
    </InfoTooltip>
)
