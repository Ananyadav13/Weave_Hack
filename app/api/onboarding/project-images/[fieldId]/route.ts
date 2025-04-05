// app/api/onboarding/project-images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

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
    
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
    
    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);
    
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
            filePath: `/uploads/projects/${fileName}`,
            uploadedAt: new Date()
          }
        },
        $set: { updatedAt: new Date() }
      }
    );
    
    return NextResponse.json({ 
      success: true,
      filePath: `/uploads/projects/${fileName}`
    });
  } catch (error) {
    console.error('Error uploading project image:', error);
    return NextResponse.json(
      { error: 'Failed to upload project image' },
      { status: 500 }
    );
  }
}