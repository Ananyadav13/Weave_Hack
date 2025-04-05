// app/api/webhooks/clerk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';
import { Webhook } from 'svix';

export async function POST(req: NextRequest) {
  // Verify the webhook signature
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id') || '',
    'svix-timestamp': req.headers.get('svix-timestamp') || '',
    'svix-signature': req.headers.get('svix-signature') || '',
  };
  
  const payload = await req.text();
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');
  let evt: any;
  
  try {
    evt = wh.verify(payload, svixHeaders);
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }
  
  const eventType = evt.type;
  
  if (eventType === 'user.created') {
    try {
      const { id, email_addresses, first_name, last_name } = evt.data;
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DATABASE || 'nextjs-app');
      
      // Check if user already exists
      const existingUser = await db.collection('users').findOne({ clerkId: id });
      
      if (!existingUser) {
        // Create new user
        await db.collection('users').insertOne({
          clerkId: id,
          email: email_addresses[0]?.email_address || '',
          name: first_name && last_name ? `${first_name} ${last_name}` : '',
          onboardingComplete: false,
          skills: [],
          projects: [],
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error processing user creation webhook:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  
  // Handle other event types if needed
  return NextResponse.json({ success: true });
}