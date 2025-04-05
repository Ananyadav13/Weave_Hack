// src/app/api/skills/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Skill from '@/lib/models/skill';
import { z } from 'zod';

// Input validation schema using Zod
const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category_id: z.string().min(1, 'Category ID is required'),
});

export async function GET() {
  try {
    await dbConnect();
    const skills = await Skill.find().populate('category_id');
    return NextResponse.json({ success: true, data: skills }, { status: 200 });
  } catch (error) {
    console.error('GET /api/skills error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const reqBody = await request.json();

    const parsed = skillSchema.safeParse(reqBody);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors.map(e => e.message).join(', ') },
        { status: 400 }
      );
    }

    const skill = await Skill.create(parsed.data);
    return NextResponse.json({ success: true, data: skill }, { status: 201 });
  } catch (error) {
    console.error('POST /api/skills error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

// OPTIONAL: Update a skill
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const { id, ...updateData } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Skill ID is required' }, { status: 400 });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, data: updatedSkill }, { status: 200 });
  } catch (error) {
    console.error('PUT /api/skills error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

// OPTIONAL: Delete a skill
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: 'Skill ID is required' }, { status: 400 });
    }

    await Skill.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Skill deleted' }, { status: 200 });
  } catch (error) {
    console.error('DELETE /api/skills error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

/*
// CORS headers setup (optional if needed in middleware.ts)
export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};
*/
