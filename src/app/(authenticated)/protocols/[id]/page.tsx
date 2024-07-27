import View from '@protocol/protocol-view-template'
import { redirect } from 'next/navigation'
import { findProtocolById } from 'repositories/protocol'
import { PDF } from 'modules/protocol-pdf'
import ChatFullComponent from 'modules/chat/ChatFullComponent'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import ProtocolMetadata from '@protocol/elements/protocol-metadata'
import { ContainerAnimations } from '@elements/container-animations'

export default async function Page({ params }: { params: { id: string } }) {
  if (params.id === 'new') redirect('/protocols/new/0')
  const protocol = await findProtocolById(params.id)

  if (!protocol) {
    redirect('/protocols')
  }

  const session = await getServerSession(authOptions)

  return (
    <>
      <ProtocolMetadata params={params} />

      <ContainerAnimations animation={2} delay={0.2}>
        <PDF />
        <ChatFullComponent user={session!.user} protocolId={protocol.id} />
        <View sections={protocol.sections} />
      </ContainerAnimations>
    </>
  )
}
