// app/api/onboarding/certificates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/db/mongodb';
import { getUserByClerkId } from '@/lib/models/user';
import S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid';

// Configure S3 client
const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const skillId = formData.get('skillId') as string;

    if (!file || !skillId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/certificates/${uuidv4()}.${fileExtension}`;

    // Upload to S3
    const uploadResult = await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET || 'your-bucket-name',
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    }).promise();

    const fileUrl = uploadResult.Location;

    // Update the certificate URL in MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || 'nextjs-app');
    const user = await getUserByClerkId(db, userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the skill and certificate to update
    const skills = user.skills || [];
    const skill = skills.find(s => s.id === skillId);
    
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Find the certificate by name and update its URL
    const certificates = skill.certificates || [];
    const certificateIndex = certificates.findIndex(c => c.name === file.name);
    
    if (certificateIndex >= 0) {
      // Update existing certificate
      await db.collection('users').updateOne(
        {
          clerkId: userId,
          'skills.id': skillId,
          'skills.certificates.name': file.name
        },
        {
          $set: {
            'skills.$.certificates.$[cert].fileUrl': fileUrl,
            updatedAt: new Date()
          }
        },
        {
          arrayFilters: [{ 'cert.name': file.name }]
        }
      );
    } else {
      // Add new certificate if it doesn't exist
      await db.collection('users').updateOne(
        {
          clerkId: userId,
          'skills.id': skillId
        },
        {
          $push: {
            'skills.$.certificates': {
              name: file.name,
              fileUrl: fileUrl,
              createdAt: new Date()
            }
          },
          $set: {
            updatedAt: new Date()
          }
        }
      );
    }

    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    console.error('Error uploading certificate:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}