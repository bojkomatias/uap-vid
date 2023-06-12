import { ReviewType } from "@prisma/client";

export default {
   [ReviewType.METHODOLOGICAL]: "Evaluación Metodológica",
   [ReviewType.SCIENTIFIC_INTERNAL]: "Evaluación Interna",
   [ReviewType.SCIENTIFIC_EXTERNAL]: "Evaluación Externa",
   [ReviewType.SCIENTIFIC_THIRD]: "Evaluación Extraordinaria",
} as const;