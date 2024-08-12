import { Heading } from '@components/heading'
import { Text } from '@components/text'
import { getIndexByUnit } from '@repositories/finance-index'
import { DialogTableIndex } from 'modules/indexes/dialog-index-table'
import { IndexTable } from 'modules/indexes/index-table'
import { UpdateIndexDialog } from 'modules/indexes/update-index-dialog'

export default async function IndexesPage() {
  // const index = await getIndexByUnit('FMR')
  // index.values.reverse()

  return (
    <div>
      {/* <div className="flex items-end">
        <Heading>Indice FMR</Heading>
        <UpdateIndexDialog index={'FMR'} />
      </div>
      <Text>
        Mostrando los 3 registros más recientes de {index.values.length} valores
        historicos en total, acá puede ver{' '}
        <DialogTableIndex values={index.values} />
      </Text>

      <IndexTable values={index.values} /> */}
    </div>
  )
}
