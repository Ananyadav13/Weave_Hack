// app/api/onboarding/skills/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    // Get user information from Clerk
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { skills } = await req.json();
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'portfolio');
    
    // Get user profile or create if it doesn't exist
    const userProfile = await db.collection('users').findOne({ userId });
    
    if (userProfile) {
      // Update existing user profile with skills
      await db.collection('users').updateOne(
        { userId },
        { $set: { skills, updatedAt: new Date() } }
      );
    } else {
      // Create new user profile with skills and clerk profile data
      await db.collection('users').insertOne({
        userId,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        skills,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving skills:', error);
    return NextResponse.json(
      { error: 'Failed to save skills' },
      { status: 500 }
    );
  }
}