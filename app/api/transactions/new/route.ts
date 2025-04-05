import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Transaction from '@/lib/models/transaction';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const newTransaction = await Transaction.create(reqBody);
    return NextResponse.json({ success: true, data: newTransaction }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}