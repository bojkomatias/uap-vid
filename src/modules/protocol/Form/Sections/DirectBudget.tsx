'use client'
import { useProtocolContext } from 'utils/createContext'
import { motion } from 'framer-motion'
import List from '@protocol/elements/form/List'
import InfoTooltip from '@protocol/elements/form/InfoTooltip'
import SectionTitle from '@protocol/elements/form/SectionTitle'

const years = (v: string) => {
    let yearQuantity = Number(v.substring(0, 2)) / 12
    let currentYear = new Date().getFullYear()
    let years: string[] = [String(currentYear)]
    for (let i = 0; i < yearQuantity; i++) {
        years.push(String(currentYear + i + 1))
    }
    return years
}

export default function DirectBudget() {
    const form = useProtocolContext()
    const path = 'sections.budget.'

    return (
        <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-3"
        >
            <SectionTitle title="Presupuesto de gastos directos" />
            <>
                <Info />
                <List
                    path={path + 'expenses'}
                    label="gastos"
                    toMap={form.values.sections.budget.expenses}
                    insertedItemFormat={{
                        type: '',
                        detail: '',
                        amount: '',
                        year: '',
                    }}
                    headers={[
                        {
                            x: 'type',
                            label: 'tipo',
                            options: [
                                'Insumos',
                                'Libros',
                                'Fotocopias, materiales de impresión, papelería',
                                'Viajes',
                            ],
                        },
                        { x: 'detail', label: 'detalle', class: 'flex-grow' },
                        {
                            x: 'amount',
                            label: 'monto',
                            currency: true,
                        },
                        {
                            x: 'year',
                            label: 'año',
                            options: years(
                                form.values.sections.duration.duration
                            ),
                        },
                    ]}
                />
            </>
        </motion.div>
    )
}

const Info = () => (
    <InfoTooltip>
        Debe detallar todos los insumos y sus costos. Aquellos insumos que
        fueren adquiridos a través del presupuesto asignado por la UAP, una vez
        concluido el proyecto, deberán ser entregados en la VID para que esta
        defina el destino que se les dará.
        <p>
            Recuerde que, al solicitar reintegros por gastos directos de
            investigación, se aprobarán solo aquellos que figuren en el
            presupuesto que presente en este protocolo, por lo que se solicita
            que detalle de manera exhaustiva los rubros que considere
            pertinentes, por ejemplo: insumos de laboratorio, libros,
            fotocopias, materiales de impresión, correo postal, artículos de
            librería, papelería, viajes, test, traducciones, publicación, etc.
        </p>{' '}
        <p>
            Para tener derecho al reembolso de cualquier otro gasto que no esté
            contemplado dentro del presupuesto original, deberá presentar la
            solicitud al secretario de investigación de la unidad académica para
            que este gestione la autorización de la Vicerrectoría de
            Investigación y Desarrollo. Si el investigador efectuara el gasto
            sin contar con dicha autorización, no podrá exigir su reembolso.
        </p>
    </InfoTooltip>
)
