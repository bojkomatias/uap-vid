// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'
import { createReview } from "@repositories/review";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
   const data = await request.json();
   const review = await createReview(params.id, data);
   return NextResponse.json(review);
}