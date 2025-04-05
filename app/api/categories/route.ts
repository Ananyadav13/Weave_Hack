import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SkillCategory from '@/lib/models/skillCategory';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const categories = await SkillCategory.find({});
    return NextResponse.json({ success: true, data: categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const reqBody = await request.json();
    const category = await SkillCategory.create(reqBody);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 400 });
  }
}