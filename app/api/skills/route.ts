// src/app/api/onboarding/skills/route.ts
import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';
import Skill from '@/lib/models/skill';
import { z } from 'zod';

// Input validation schema using Zod
const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category_id: z.string().min(1, 'Category ID is required'),
});

// Improved MongoDB connection with proper error handling
let clientPromise: Promise<MongoClient>;

const connectToDatabase = async () => {
  try {
    // Use environment variable for connection string
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    // Create MongoDB client with proper options
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      ssl: true,
      tlsAllowInvalidCertificates: process.env.NODE_ENV !== 'production', // Only for development
    });
    
    // Connect the client
    await client.connect();
    console.log('Connected to MongoDB successfully');
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error(`Failed to connect to database: ${(error as Error).message}`);
  }
};

// Initialize connection once
if (!global._mongoClientPromise) {
  global._mongoClientPromise = connectToDatabase();
}
clientPromise = global._mongoClientPromise;

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'portfolio');
    const skillsCollection = db.collection('skills');
    
    const skills = await skillsCollection.find({}).toArray();
    
    // Populate category information if needed
    // This is a simplified example - you might need to adjust based on your actual schema
    
    return NextResponse.json({ success: true, data: skills }, { status: 200 });
  } catch (error) {
    console.error('GET /api/onboarding/skills error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 } // Use 500 for server errors
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'portfolio');
    const skillsCollection = db.collection('skills');
    
    const reqBody = await request.json();
    const parsed = skillSchema.safeParse(reqBody);
    
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors.map(e => e.message).join(', ') },
        { status: 400 }
      );
    }
    
    const result = await skillsCollection.insertOne(parsed.data);
    
    if (!result.acknowledged) {
      throw new Error('Failed to insert skill');
    }
    
    return NextResponse.json(
      { success: true, data: { _id: result.insertedId, ...parsed.data } }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/onboarding/skills error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 } // Use 500 for server errors
    );
  }
}

// OPTIONAL: Update a skill
export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'portfolio');
    const skillsCollection = db.collection('skills');
    
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Skill ID is required' }, { status: 400 });
    }
    
    const { ObjectId } = require('mongodb');
    
    const result = await skillsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error('PUT /api/onboarding/skills error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// OPTIONAL: Delete a skill
export async function DELETE(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'portfolio');
    const skillsCollection = db.collection('skills');
    
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ success: false, error: 'Skill ID is required' }, { status: 400 });
    }
    
    const { ObjectId } = require('mongodb');
    
    const result = await skillsCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Skill not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Skill deleted' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/onboarding/skills error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// CORS headers setup (optional if needed in middleware.ts)
export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};