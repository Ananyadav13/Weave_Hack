import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Token from '@/lib/models/token';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  try {
    await dbConnect();
    const token = await Token.findOne({ user_id: userId });
    if (token) {
      return NextResponse.json({ success: true, data: token }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, error: 'Token balance not found for this user' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

// You might add PUT/PATCH here to update token balance if needed, with proper authorization