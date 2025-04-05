// app/api/onboarding/project-images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/db/mongodb';
import { getUserByClerkId } from '@/lib/models/user';
import S3 from 'aws-sdk/clients/s3';
import { v4 as uuidv4 } from 'uuid'; // Missing import for uuidv4

// Initialize S3 client
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
    const projectId = formData.get('projectId') as string;

    if (!file || !projectId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}/projects/${projectId}/${uuidv4()}.${fileExtension}`;

    // Upload to S3
    const uploadResult = await s3.upload({
      Bucket: process.env.AWS_S3_BUCKET || 'your-bucket-name',
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    }).promise();

    const fileUrl = uploadResult.Location;

    // Update the project image URL in MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE || 'nextjs-app');
    const user = await getUserByClerkId(db, userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the project and image to update
    const projects = user.projects || [];
    const project = projects.find(p => p.id === projectId);
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Find the image by name and update its URL
    const images = project.images || [];
    const imageIndex = images.findIndex(img => img.name === file.name);
    
    if (imageIndex >= 0) {
      // Update existing image
      await db.collection('users').updateOne(
        {
          clerkId: userId,
          'projects.id': projectId,
          'projects.images.name': file.name
        },
        {
          $set: {
            'projects.$.images.$[img].fileUrl': fileUrl,
            updatedAt: new Date()
          }
        },
        {
          arrayFilters: [{ 'img.name': file.name }]
        }
      );
    } else {
      // Add new image - this was missing in your original code
      await db.collection('users').updateOne(
        {
          clerkId: userId,
          'projects.id': projectId
        },
        {
          $push: {
            'projects.$.images': {
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
    console.error('Error uploading project image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}