'use client'
import { motion } from 'framer-motion'
import InfoTooltip from '@protocol/elements/tooltip'
import SectionTitle from '@protocol/elements/form-section-title'

import { BudgetList } from '@protocol/elements/inputs/budget-list-form'

export function BudgetForm() {
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
        <BudgetList />
      </>
    </motion.div>
  )
}

const Info = () => (
  <InfoTooltip>
    Debe detallar todos los insumos y sus costos. Aquellos insumos que fueren
    adquiridos a través del presupuesto asignado por la UAP, una vez concluido
    el proyecto, deberán ser entregados en la VID para que esta defina el
    destino que se les dará.
    <p>
      Recuerde que, al solicitar reintegros por gastos directos de
      investigación, se aprobarán solo aquellos que figuren en el presupuesto
      que presente en este protocolo, por lo que se solicita que detalle de
      manera exhaustiva los rubros que considere pertinentes, por ejemplo:
      insumos de laboratorio, libros, fotocopias, materiales de impresión,
      correo postal, artículos de librería, papelería, viajes, test,
      traducciones, publicación, etc.
    </p>{' '}
    <p>
      Para tener derecho al reembolso de cualquier otro gasto que no esté
      contemplado dentro del presupuesto original, deberá presentar la solicitud
      al secretario de investigación de la unidad académica para que este
      gestione la autorización de la Vicerrectoría de Investigación y
      Desarrollo. Si el investigador efectuara el gasto sin contar con dicha
      autorización, no podrá exigir su reembolso.
    </p>
  </InfoTooltip>
)
