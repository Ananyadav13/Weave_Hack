// app/api/onboarding/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import clientPromise from '@/lib/mongodb';

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

    const { projects } = await req.json();
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'portfolio');
    
    // Save projects to user profile
    // We'll store project metadata in the user document
    // Image files will be handled separately
    const processedProjects = projects.map(project => ({
      ...project,
      // Remove file objects from images, we'll store just metadata
      images: project.images.map(img => ({
        id: img.id,
        name: img.name,
        preview: img.preview
      }))
    }));
    
    await db.collection('users').updateOne(
      { userId },
      { 
        $set: { 
          projects: processedProjects,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving projects:', error);
    return NextResponse.json(
      { error: 'Failed to save projects' },
      { status: 500 }
    );
  }
}