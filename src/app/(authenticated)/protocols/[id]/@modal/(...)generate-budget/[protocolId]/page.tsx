import { GenerateAnualBudget } from '@protocol/elements/budgets/generate-anual-budget'
import { ProtocolInterceptedModal } from '@protocol/elements/protocol-intercepted-modal'

export default async function ModalPage({
  params: { protocolId },
}: {
  params: { protocolId: string }
}) {
  return (
    <ProtocolInterceptedModal>
      <GenerateAnualBudget protocolId={protocolId} />
    </ProtocolInterceptedModal>
  )
}
