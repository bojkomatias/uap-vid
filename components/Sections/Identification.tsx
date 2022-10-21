import { PropsWithChildren } from 'react'
import { QuestionMark } from 'tabler-icons-react'
import { useProtocolContext } from '../../config/createContext'
import Input from '../Atomic/Input'
import Select from '../Atomic/Select'
import full from '../../config/careers.json'
import Table from '../Atomic/Table'
import { motion } from 'framer-motion'

const careers = full.map((x) => x.career)
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
            animate={{ opacity: 1, x: 6 }}
            transition={{ duration: 0.7 }}
            className="opacity-0"
        >
            <div className="flex grow items-center">
                <span className="ml-10 text-xl font-bold uppercase text-primary">
                    {form.values.sections[Number(id)].name}
                </span>

                <div className="group relative hover:w-2/3">
                    <QuestionMark className="pointer-events-none ml-2 h-4 w-4 cursor-pointer text-primary transition-all duration-300 group-hover:scale-[1.4]" />

                    <div className="prose prose-sm prose-zinc absolute top-5 left-5 z-10 hidden bg-base-200 p-3 shadow-lg transition-all duration-200 group-hover:block prose-p:pl-6">
                        <p>
                            <b>Codirector:</b> En el caso de un proyecto tesis
                            de posgrado, agregar el nombre del director o
                            consejero.
                        </p>
                        <p>
                            {' '}
                            <b>Investigadores externos UAP:</b> Colaboradores
                            adhonorem{' '}
                        </p>
                        <p>
                            {' '}
                            <b>Técnico y Profesionales:</b> Después de que el
                            proyecto sea aprobado y asignados los técnicos y los
                            profesionales becados, deberá adjuntar un archivo
                            para justificar la participación y detallar
                            exhaustivamente las actividades que llevará a cabo
                            cada uno, junto con: Conocimientos previos
                            requeridos. Datos personales: apellido y nombre,
                            tipo y número de documento, dirección de correo
                            electrónico y dirección postal. Estudios: cantidad
                            de asignaturas regularizadas y aprobadas de la
                            carrera en curso o título de las carreras de grado o
                            posgrado terminadas. Cursos realizados. Becas
                            obtenidas anteriormente. Idiomas: con qué idiomas
                            puede trabajar y con qué nivel en cada caso. Carta
                            escrita por el postulante en la que fundamente la
                            solicitud de la beca.
                        </p>
                    </div>
                </div>
            </div>
            <div className="mx-6 mt-5 max-w-[1120px]">
                <Input path={path} x="title" label="titulo" />
                <Select
                    path={path}
                    x="career"
                    options={careers}
                    label="carrera"
                />
                <Select
                    path={path}
                    x="assignment"
                    label="materia"
                    options={assignments(
                        form.values.sections[Number(id)].data.carrera
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
