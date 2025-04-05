import { getAuth } from '@clerk/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';
import { UserProfile } from '@/types/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Get authenticated user ID from Clerk
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get MongoDB client
    const client = await clientPromise;
    
    // Get database - using the MongoDB object directly
    const db = client.db(process.env.MONGODB_DB_NAME || 'portfolio');
    
    // Find the user profile
    const userProfile = await db.collection<UserProfile>('userProfiles').findOne({ userId });

    if (!userProfile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Return the profile
    return res.status(200).json(userProfile);
    
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}