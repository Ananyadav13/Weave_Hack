// app/api/user/profile/route.ts (for Next.js App Router)

import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user from Clerk
    const { userId } = await auth();
    const user = await currentUser();
    
    if (!userId || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
    
    // Get the database and collection
    const db = client.db(process.env.MONGODB_DB_NAME || 'weave');
    const collection = db.collection('users');
    
    // Query the database using the Clerk userId
    // Note: Make sure the userId field in your MongoDB matches how you store Clerk IDs
    const userProfile = await collection.findOne({ userId: `user_${userId}` });
    
    if (!userProfile) {
      // If user doesn't exist in MongoDB yet, return basic profile from Clerk
      await client.close();
      return NextResponse.json({
        userId: `user_${userId}`,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        skills: []
      });
    }
    
    await client.close();
    return NextResponse.json(userProfile);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}