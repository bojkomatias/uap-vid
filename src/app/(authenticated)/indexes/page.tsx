import { Heading, Subheading } from '@components/heading'
import { getIndexes } from '@repositories/finance-index'
import { UpdateIndexDialog } from 'modules/indexes/update-index-dialog'

export default async function IndexesPage() {
  const indexes = await getIndexes()

  return (
    <>
      <div className="flex items-end">
        <Heading>Indices</Heading>
        <UpdateIndexDialog />
      </div>
      <Subheading>
        Los indices FCA y FMR de la aplicación, por debajo los presupuestos,
        categorías y gastos directos son guardados mediante indices. Estos no se
        muestran directamente al usuario final de manera explicita.
      </Subheading>

      <pre>{JSON.stringify(indexes, null, 2)}</pre>
    </>
  )
}
