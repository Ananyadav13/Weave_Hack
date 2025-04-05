// In pages/api/onboarding/complete.ts
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  
  const { userId } = getAuth(req);
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Update the user's metadata to mark onboarding as complete
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating user metadata', error);
    return res.status(500).json({ error: 'Failed to update user metadata' });
  }
}