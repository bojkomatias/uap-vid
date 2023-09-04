import type { AnualBudgetItem, AnualBudgetTeamMember } from "@prisma/client";

type AnualBudgetItemWithoutExecutions = Omit<AnualBudgetItem, 'executions'>
type AnualBudgetTeamMemberItemWithoutExecutions = Omit<
    AnualBudgetTeamMember,
    'executions'
>
export const generateAnualBudgetExecutions = async (protocolId:string, ABI:AnualBudgetItemWithoutExecutions[], ABT:AnualBudgetTeamMemberItemWithoutExecutions[], year:string) => {
  throw new Error('Not implemented');
}
