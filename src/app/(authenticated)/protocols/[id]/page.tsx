import View from '@protocol/protocol-view-template'
import { redirect } from 'next/navigation'
import { findProtocolById } from 'repositories/protocol'
import { ContainerAnimations } from '@elements/container-animations'

export default async function Page({ params }: { params: { id: string } }) {
  if (params.id === 'new') redirect('/protocols/new/0')
  const protocol = await findProtocolById(params.id)

  if (!protocol) {
    redirect('/protocols')
  }

  return (
    <ContainerAnimations animation={2} delay={0.2}>
      <div className="space-y-6 @container">
        <View sections={protocol.sections} />
      </div>
    </ContainerAnimations>
  )
}
