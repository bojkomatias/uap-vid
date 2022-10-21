import { PropsWithChildren } from 'react'
import { useProtocolContext } from '../../config/createContext'
import Input from '../Atomic/Input'
import Select from '../Atomic/Select'
import { motion } from 'framer-motion'


const disciplines = ['Ejemplo anexo A', 'Ética y responsabilidad social']
const lines = [
    'Ejemplo anexo A',
    'Gestión de las organizaciones y responsabilidad social',
]
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

export default function Description({ id }: PropsWithChildren<{ id: string }>) {
    const form = useProtocolContext()
    const path = 'sections.' + id + '.data.'

    return (
        <motion.div
            animate={{ opacity: 1, x: 6 }}
            transition={{ duration: 0.7 }}
            className="opacity-0"
        >
            <div className="flex grow items-center">
                <span className=" ml-10 text-xl font-bold uppercase text-primary">
                    {form.values.sections[Number(id)].name}
                </span>
            </div>
            <div className="mx-6 mt-5 max-w-[1120px]">
                <Select
                    path={path}
                    x="discipline"
                    label="disciplina general y área especifica"
                    options={disciplines}
                />
                <Select
                    path={path}
                    x="line"
                    label="línea de investigación"
                    options={lines}
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
