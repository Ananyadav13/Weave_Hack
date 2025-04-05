// app/api/onboarding/complete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/db/mongodb';
import { getUserByClerkId } from '@/lib/models/user';

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || 'nextjs-app');
    
    // Mark onboarding as complete
    await db.collection('users').updateOne(
      { clerkId: userId },
      { 
        $set: { 
          onboardingComplete: true,
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}