import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { markRevised, updateReview } from '@repositories/review'
import { useCases } from '@utils/emailer/use-cases'
import { emailer } from '@utils/emailer'

export async function PUT(request: NextRequest) {
  const data = await request.json()
  const review = await updateReview(data)

  if (review) {
    emailer({
      useCase: useCases.onReview,
      email: review.protocol.researcher.email,
      protocolId: review.protocolId,
    })
  }
  return NextResponse.json(review)
}

// Researcher (Owner) marks as revised
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const data = await request.json()
  const review = await markRevised(params.id, data)
  if (review) {
    emailer({
      useCase: useCases.onRevised,
      email: review.reviewer.email,
      protocolId: review.protocolId,
    })
    return NextResponse.json(review)
  }
  return new Response('Error revising the review', { status: 500 })
}
