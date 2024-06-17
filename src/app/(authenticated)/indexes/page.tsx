import { Heading } from '@components/heading'
import { UpdateIndexDialog } from 'modules/indexes/update-index-dialog'

export default async function IndexesPage() {
  return (
    <>
      <div className="flex items-end">
        <Heading>Convocatorias</Heading>
        <UpdateIndexDialog />
      </div>
    </>
  )
}
