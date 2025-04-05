// app/api/onboarding/project-images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise, { getGridFS } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

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
    
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Create a unique file name
    const fileExtension = file.name.split('.').pop();
    const fileName = `${userId}-${projectId}-${uuidv4()}.${fileExtension}`;
    
    // Get the file as buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a readable stream from the buffer
    const stream = Readable.from(buffer);
    
    // Upload to GridFS
    const bucket = await getGridFS('projectImages');
    
    // Create an upload stream to GridFS
    const uploadStream = bucket.openUploadStream(fileName, {
      metadata: {
        userId,
        projectId,
        originalName: file.name,
        contentType: file.type,
        uploadDate: new Date()
      }
    });
    
    // Create a promise to track when the upload completes
    const uploadPromise = new Promise<string>((resolve, reject) => {
      // When the upload errors
      uploadStream.on('error', (error) => {
        reject(error);
      });
      
      // When the upload finishes
      uploadStream.on('finish', () => {
        resolve(uploadStream.id.toString());
      });
    });
    
    // Pipe the file data to GridFS
    stream.pipe(uploadStream);
    
    // Wait for the upload to complete
    const fileId = await uploadPromise;
    
    // Save image info to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'portfolio');
    
    // Find the project in the user's profile and update the image
    await db.collection('users').updateOne(
      { userId, "projects.id": projectId },
      { 
        $push: { 
          "projects.$.images": {
            id: uuidv4(),
            name: file.name,
            fileId: fileId,
            contentType: file.type,
            size: file.size,
            uploadedAt: new Date()
          }
        },
        $set: { updatedAt: new Date() }
      }
    );
    
    return NextResponse.json({ 
      success: true,
      fileId: fileId
    });
  } catch (error) {
    console.error('Error uploading project image:', error);
    return NextResponse.json(
      { error: 'Failed to upload project image' },
      { status: 500 }
    );
  }
}