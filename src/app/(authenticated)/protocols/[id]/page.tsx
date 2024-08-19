import View from '@protocol/protocol-view-template'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({ params }: { params: { id: string } }) {
  if (params.id === 'new') redirect('/protocols/new/0')
  const protocol = await findProtocolById(params.id)

  if (!protocol) {
    redirect('/protocols')
  }

  return (
    <>
      <Link href={`/logs?protocolId=${params.id}`}>LOG</Link>
      <View sections={protocol.sections} />
    </>
  )
}
