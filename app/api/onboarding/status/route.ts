// app/api/onboarding/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/db/mongodb';
import { isOnboardingComplete } from '@/lib/models/user';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerkId = req.nextUrl.searchParams.get('clerkId');
    if (!clerkId || clerkId !== userId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || 'nextjs-app');
    
    const onboardingComplete = await isOnboardingComplete(db, clerkId);
    
    return NextResponse.json({ isComplete: !!onboardingComplete });
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}