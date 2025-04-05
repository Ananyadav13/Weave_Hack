// app/api/onboarding/complete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    // Get user information from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'portfolio');
    
    // Mark onboarding as complete
    await db.collection('users').updateOne(
      { userId },
      { 
        $set: { 
          onboardingCompleted: true,
          onboardingCompletedAt: new Date(),
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}