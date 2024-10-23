import { notifications } from '@elements/notifications'
import { AnualBudgetPreview } from '@protocol/budgets/anual-budget-preview'
import { ErrorParsingTeamMembers } from '@protocol/budgets/error-parsing-team-members'
import { GenerateAnualBudgetDialog } from '@protocol/budgets/generate-anual-budget-dialog'
import { findProtocolByIdWithResearcher } from '@repositories/protocol'
import { TeamMemberRelation } from '@utils/zod'

export default async function ModalPage({
  params: { protocolId },
}: {
  params: { protocolId: string }
}) {
  const protocol = await findProtocolByIdWithResearcher(protocolId)
  if (!protocol) return

  const parsedObject = TeamMemberRelation.safeParse(
    protocol.sections.identification.team
  )

  if (!parsedObject.success) return <ErrorParsingTeamMembers />

  return (
    <GenerateAnualBudgetDialog>
      <AnualBudgetPreview protocol={protocol} parsedData={parsedObject.data!} />
    </GenerateAnualBudgetDialog>
  )
}
