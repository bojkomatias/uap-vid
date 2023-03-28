// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { assignReviewerToProtocol, reassignReviewerToProtocol } from "@repositories/review";
import { Review, ReviewType, State } from '@prisma/client';
import { updateProtocolStateById } from '@repositories/protocol';

const newStateByReviewType = {
   [ReviewType.METHODOLOGICAL]: State.METHODOLOGICAL_EVALUATION,
   [ReviewType.SCIENTIFIC_INTERNAL]: State.SCIENTIFIC_EVALUATION,
   [ReviewType.SCIENTIFIC_EXTERNAL]: State.SCIENTIFIC_EVALUATION,
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
   const data = await request.json() as { review: Review, reviewerId: string, type: ReviewType }
   if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
   }

   //If is new review, create it
   if (!data.review) {
      const newReview = await assignReviewerToProtocol(params.id, data.reviewerId, data.type);
      if (!newReview) {
         return NextResponse.json({ error: "Error assigning reviewer to protocol" }, { status: 500 });
      }
      const protocol = await updateProtocolStateById(params.id, newStateByReviewType[data.type]);
      return NextResponse.json({ newReview, protocol }, { status: 200 });
   }

   //If is existing review, update it
   const updatedReview = await reassignReviewerToProtocol(data.review.id, params.id, data.reviewerId, data.type);

   return NextResponse.json({ updatedReview }, { status: 200 });
}