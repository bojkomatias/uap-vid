import type { ReactNode } from 'react'
import { Subheading, Heading } from '@components/heading'

export default function Layout({
  fca,
  fmr,
}: {
  fca: ReactNode
  fmr: ReactNode
}) {
  return (
    <>
      <Heading>Indices</Heading>
      <Subheading>
        Los indices de la aplicación. Por debajo los presupuestos, categorías y
        gastos directos son guardados en indices. Estos no se muestran
        directamente al usuario final sino la conversion a valor nominal en
        pesos de acuerdo al indice vigente en el momento.
      </Subheading>
      <div className="space-y-10 pt-10">
        {fca}
        {fmr}
      </div>
    </>
  )
}
