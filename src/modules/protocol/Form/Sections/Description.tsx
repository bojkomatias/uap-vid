'use client'
import { PropsWithChildren } from 'react'
import { useProtocolContext } from 'utils/createContext'

import { motion } from 'framer-motion'
import Select from '@protocol/elements/Select'
import Input from '@protocol/elements/Input'

const disciplines = [
    'Ciencias Económicas y de la Administración',
    'Ciencias de la Salud',
    'Humanidades, Educación y Ciencias Sociales',
    'Teología',
]
const lines = (v: string) => {
    if (v === 'Ciencias Económicas y de la Administración')
        return [
            'Ética y responsabilidad social de las organizaciones',
            'Economía y desarrollo regional sustentable',
            'Estudios organizacionales y management',
            'Emprendimiento e innovación',
            'Sistemas tributarios y actuación en la justicia',
            'Contabilidad y auditoria',
            'Sistemas de información',
            'Robótica',
            'Redes y sistemas operativos',
            'Sistemas biomedical',
            'Tecnología, sociedad e innovación',
            'Informática industrial',
        ]
    if (v === 'Ciencias de la Salud')
        return [
            'Promoción de la salud',
            'Restauración de la salud',
            'Educación en ciencias de la salud',
            'Bioética',
        ]
    if (v === 'Humanidades, Educación y Ciencias Sociales')
        return [
            'Psicología general',
            'Psicología social',
            'Psicología forense',
            'Psicología clínica',
            'Psicología laboral',
            'Psicología educacional',
            'Lengua inglesa',
            'Educación física',
            'Comunicación social',
            'Filosofía',
        ]
    if (v === 'Teología')
        return [
            'Teología bíblica - Antiguo Testamento',
            'Teología bíblica - Nuevo Testamento',
            'Teología sistemática',
            'Teología histórica',
            'Teología pastoral',
        ]
}

const fields = [
    'Ciencias exactas y naturales',
    'Ingeniería y tecnología',
    'Ciencias médicas',
    'Ciencias agrícolas y veterinarias',
    'Ciencias sociales',
    'Humanidades y artes',
]

const objective = [
    'Exploración y explotación de la tierra',
    'Medio ambiente',
    'Exploración y explotación de espacio',
    'Transporte, telecomunicación y otras infraestructuras',
    'Energía',
    'Producción y tecnología industrial',
    'Salud',
    'Agricultura',
    'Educación',
    'Cultura, recreación, religión y medios de comunicación',
    'Estructuras, procesos y sistemas políticos y sociales',
]
const type = [
    'Investigación básica',
    'Investigación aplicada',
    'Desarrollo experimental',
]

export default function Description() {
    const form = useProtocolContext()
    const path = 'sections.description.'

    return (
        <motion.div
            animate={{ opacity: 1, x: 6 }}
            transition={{ duration: 0.7 }}
            className="opacity-0"
        >
            <div className="flex grow items-center">
                <span className=" ml-10 text-xl font-bold uppercase text-primary">
                    Descripción del proyecto
                </span>
            </div>
            <div className="mx-auto mt-5 max-w-[1120px]">
                <Select
                    path={path}
                    x="discipline"
                    label="disciplina general y área especifica"
                    options={disciplines}
                    conditionalCleanup={() =>
                        (form.values.sections.description.line = '')
                    }
                />
                <Select
                    path={path}
                    x="line"
                    label="línea de investigación"
                    options={lines(form.values.sections.description.discipline)}
                />
                <Input path={path} x="words" label="palabras clave" />
                <Select
                    path={path}
                    x="field"
                    options={fields}
                    label="campo de aplicación"
                />
                <Select
                    path={path}
                    x="objective"
                    label="objetivo socioeconómico"
                    options={objective}
                />
                <Select
                    path={path}
                    x="type"
                    label="tipo de investigación"
                    options={type}
                />
            </div>
        </motion.div>
    )
}
