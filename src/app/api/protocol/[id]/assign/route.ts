// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { assignReviewerToProtocol } from "@repositories/review";
import { ReviewType, State } from '@prisma/client';
import { updateProtocolStateById } from '@repositories/protocol';

const newStateByReviewType = {
   [ReviewType.METHODOLOGICAL]: State.METHODOLOGICAL_EVALUATION,
   [ReviewType.SCIENTIFIC_INTERNAL]: State.SCIENTIFIC_EVALUATION,
   [ReviewType.SCIENTIFIC_EXTERNAL]: State.SCIENTIFIC_EVALUATION,
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
   const data = await request.json() as { reviewerId: string, type: ReviewType }
   if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
   }
   const review = await assignReviewerToProtocol(params.id, data.reviewerId, data.type);

   if (!review) {
      return NextResponse.json({ error: "Error assigning reviewer to protocol" }, { status: 500 });
   }

   const protocol = await updateProtocolStateById(params.id, newStateByReviewType[data.type]);

   return NextResponse.json({ review, protocol }, { status: 200 });
}