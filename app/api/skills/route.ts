import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Skill from '@/lib/models/skill';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const skills = await Skill.find().populate('category_id'); // Example of populating related data
    return NextResponse.json({ success: true, data: skills }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const skill = await Skill.create(reqBody);
    return NextResponse.json({ success: true, data: skill }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}