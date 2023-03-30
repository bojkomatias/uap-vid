import { ReviewType } from "@prisma/client";

export const EvaluatorsByReviewType = {
   [ReviewType.METHODOLOGICAL]: "Metodólogo",
   [ReviewType.SCIENTIFIC_INTERNAL]: "Evaluador Interno",
   [ReviewType.SCIENTIFIC_EXTERNAL]: "Evaluador Externo",
}