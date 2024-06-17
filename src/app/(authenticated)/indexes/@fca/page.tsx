import { Heading } from '@components/heading'
import { getIndexByUnit } from '@repositories/finance-index'
import { IndexTable } from 'modules/indexes/index-table'
import { UpdateIndexDialog } from 'modules/indexes/update-index-dialog'

export default async function IndexesPage() {
  const index = await getIndexByUnit('FCA')
  index.values.reverse()

  return (
    <div>
      <div className="flex items-end">
        <Heading>Indice FCA</Heading>
        <UpdateIndexDialog index={'FCA'} />
      </div>

      <IndexTable values={index.values} />
    </div>
  )
}
