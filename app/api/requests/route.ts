// pages/api/requests.ts
import { getAuth } from '@clerk/nextjs/server';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

// Define the Request interface
interface Request {
  _id?: ObjectId;
  userId: string;
  title: string;
  description: string;
  skill?: string;
  toolAccess?: string;
  type?: string;
  reputation?: string;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get authenticated user
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Connect to MongoDB
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB_NAME || 'portfolio');
    const requestsCollection = db.collection<Request>('requests');

    // Handle different HTTP methods
    switch (req.method) {
      case 'POST':
        return await handlePostRequest(req, res, userId, requestsCollection);
      case 'GET':
        return await handleGetRequests(req, res, userId, requestsCollection);
      case 'PUT':
        return await handleUpdateRequest(req, res, userId, requestsCollection);
      case 'DELETE':
        return await handleDeleteRequest(req, res, userId, requestsCollection);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handlePostRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  collection: any
) {
  try {
    const { title, description, skill, toolAccess, type, reputation } = req.body;
    
    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    
    // Create new request document
    const newRequest: Request = {
      userId,
      title,
      description,
      skill: skill || '',
      toolAccess: toolAccess || '',
      type: type || '',
      reputation: reputation || '',
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert into database
    const result = await collection.insertOne(newRequest);
    
    return res.status(201).json({
      message: 'Request created successfully',
      requestId: result.insertedId,
      request: { ...newRequest, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating request:', error);
    return res.status(500).json({ error: 'Error creating request' });
  }
}

async function handleGetRequests(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  collection: any
) {
  try {
    // Parse query parameters
    const { all, status } = req.query;
    let query: any = {};
    
    // If all is not specified or false, show only the user's requests
    if (!all || all === 'false') {
      query.userId = userId;
    }
    
    // Filter by status if provided
    if (status && ['open', 'assigned', 'completed', 'cancelled'].includes(status as string)) {
      query.status = status;
    }
    
    // Fetch requests
    const requests = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
      
    return res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching requests:', error);
    return res.status(500).json({ error: 'Error fetching requests' });
  }
}

async function handleUpdateRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  collection: any
) {
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Request ID is required' });
    }
    
    // Find the request to ensure it belongs to the user
    const existingRequest = await collection.findOne({
      _id: new ObjectId(id)
    });
    
    if (!existingRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Only allow updates to user's own requests unless adding admin role check here
    if (existingRequest.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this request' });
    }
    
    const { title, description, skill, toolAccess, type, reputation, status } = req.body;
    
    // Build update object with only provided fields
    const updateData: Partial<Request> = {
      updatedAt: new Date()
    };
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (skill !== undefined) updateData.skill = skill;
    if (toolAccess !== undefined) updateData.toolAccess = toolAccess;
    if (type !== undefined) updateData.type = type;
    if (reputation !== undefined) updateData.reputation = reputation;
    if (status !== undefined && ['open', 'assigned', 'completed', 'cancelled'].includes(status)) {
      updateData.status = status;
    }
    
    // Update the request
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'No changes made' });
    }
    
    return res.status(200).json({
      message: 'Request updated successfully',
      requestId: id
    });
  } catch (error) {
    console.error('Error updating request:', error);
    return res.status(500).json({ error: 'Error updating request' });
  }
}

async function handleDeleteRequest(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  collection: any
) {
  try {
    const { id } = req.query;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Request ID is required' });
    }
    
    // Find the request to ensure it belongs to the user
    const existingRequest = await collection.findOne({
      _id: new ObjectId(id)
    });
    
    if (!existingRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Only allow deletion of user's own requests unless adding admin role check here
    if (existingRequest.userId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this request' });
    }
    
    // Delete the request
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(400).json({ error: 'Request could not be deleted' });
    }
    
    return res.status(200).json({
      message: 'Request deleted successfully',
      requestId: id
    });
  } catch (error) {
    console.error('Error deleting request:', error);
    return res.status(500).json({ error: 'Error deleting request' });
  }
}