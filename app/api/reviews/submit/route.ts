import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Review from '@/lib/models/review';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const newReview = await Review.create(reqBody);
    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}