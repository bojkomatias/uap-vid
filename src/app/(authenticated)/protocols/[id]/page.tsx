import View from '@protocol/protocol-view-template'
import { redirect } from 'next/navigation'
import { findProtocolById } from 'repositories/protocol'
import ProtocolMetadata from '@protocol/elements/protocol-metadata'

export default async function Page({ params }: { params: { id: string } }) {
  if (params.id === 'new') redirect('/protocols/new/0')
  const protocol = await findProtocolById(params.id)

  if (!protocol) {
    redirect('/protocols')
  }

  return (
    <div className="space-y-6 @container">
      <ProtocolMetadata params={params} />
      <View sections={protocol.sections} />
    </div>
  )
}
