// app/api/onboarding/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/db/mongodb';


export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projects } = await req.json();
    
    if (!Array.isArray(projects)) {
      return NextResponse.json({ error: 'Invalid projects data' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || 'nextjs-app');
    
    // Update user's projects
    await db.collection('users').updateOne(
      { clerkId: userId },
      { 
        $set: { 
          projects, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}