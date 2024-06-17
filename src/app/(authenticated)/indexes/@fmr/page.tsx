import { Heading } from '@components/heading'
import { getIndexByUnit } from '@repositories/finance-index'
import { IndexTable } from 'modules/indexes/index-table'
import { UpdateIndexDialog } from 'modules/indexes/update-index-dialog'

export default async function IndexesPage() {
  const index = await getIndexByUnit('FMR')
  index.values.reverse()

  return (
    <div>
      <div className="flex items-end">
        <Heading>Indice FMR</Heading>
        <UpdateIndexDialog index={'FMR'} />
      </div>

      <IndexTable values={index.values} />
    </div>
  )
}
