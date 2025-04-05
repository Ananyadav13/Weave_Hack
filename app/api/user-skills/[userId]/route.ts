import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import UserSkill from '@/lib/models/userSkill';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  try {
    await dbConnect();
    const userSkills = await UserSkill.find({ user_id: userId }).populate('skill_id');
    return NextResponse.json({ success: true, data: userSkills }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function PUT(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;
  try {
    await dbConnect();
    const reqBody = await request.json();
    // Assuming reqBody contains { skill_id: string, level: number, ... }
    const { skill_id, ...updateData } = reqBody;

    const updatedUserSkill = await UserSkill.findOneAndUpdate(
      { user_id: userId, skill_id: skill_id },
      updateData,
      { upsert: true, new: true } // upsert creates if it doesn't exist, new returns the updated document
    ).populate('skill_id');

    return NextResponse.json({ success: true, data: updatedUserSkill }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}