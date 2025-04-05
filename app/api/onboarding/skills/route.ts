// app/api/onboarding/skills/route.ts
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

    const { skills } = await req.json();
    
    if (!Array.isArray(skills)) {
      return NextResponse.json({ error: 'Invalid skills data' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || 'nextjs-app');
    
    // Check if user exists
    const existingUser = await getUserByClerkId(db, userId);
    
    if (existingUser) {
      // Update existing user's skills
      await db.collection('users').updateOne(
        { clerkId: userId },
        { 
          $set: { 
            skills, 
            updatedAt: new Date() 
          } 
        }
      );
    } else {
      // Create new user with skills
      await db.collection('users').insertOne({
        clerkId: userId,
        email: '',  // Will be updated later with Clerk webhook
        onboardingComplete: false,
        skills,
        projects: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving skills:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}