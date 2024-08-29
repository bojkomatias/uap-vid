import { AnualBudgetPreview } from '@protocol/budgets/anual-budget-preview'
import { GenerateAnualBudgetDialog } from '@protocol/budgets/generate-anual-budget-dialog'
import { findProtocolByIdWithResearcher } from '@repositories/protocol'

export default async function ModalPage({
  params: { protocolId },
}: {
  params: { protocolId: string }
}) {
  const protocol = await findProtocolByIdWithResearcher(protocolId)
  if (!protocol) return

  return (
    <GenerateAnualBudgetDialog>
      <AnualBudgetPreview protocol={protocol} />
    </GenerateAnualBudgetDialog>
  )
}
