import { NextRequest, NextResponse } from 'next/server';
import * as tf from '@tensorflow/tfjs';
import { pipeline } from '@xenova/transformers';

// Sample static data – replace with real DB or file source
const data = [
  {
    user: 'UserA',
    provided_skills: 'marketing strategy social media branding',
    needed_skills: 'data analysis statistics research',
  },
  {
    user: 'UserB',
    provided_skills: 'data analysis machine learning statistics',
    needed_skills: 'creative design copywriting',
  },
  {
    user: 'UserC',
    provided_skills: 'ux ui design product design user research',
    needed_skills: 'marketing strategy branding',
  },
  {
    user: 'UserD',
    provided_skills: 'copywriting content creation storytelling',
    needed_skills: 'marketing design digital advertising',
  },
];

let encoder: any = null;

// Load transformer model once
async function loadEncoder() {
  if (!encoder) {
    encoder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return encoder;
}

function l2Distance(a: number[], b: number[]) {
  return Math.sqrt(a.reduce((sum, ai, i) => sum + (ai - b[i]) ** 2, 0));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user: requester, top_n = 3 } = body;

  const encoder = await loadEncoder();

  const requesterEntry = data.find((u) => u.user === requester);
  if (!requesterEntry) {
    return NextResponse.json({ error: 'Requester not found' }, { status: 400 });
  }

  const requesterVec = await encoder(requesterEntry.needed_skills);
  const requesterEmbedding = requesterVec[0][0]; // shape: [1][tokens][dims]

  const results: { user: string; provided_skills: string; similarity: number }[] = [];

  for (const entry of data) {
    if (entry.user === requester) continue;

    const providedVec = await encoder(entry.provided_skills);
    const providedEmbedding = providedVec[0][0];

    const dist = l2Distance(requesterEmbedding, providedEmbedding);
    const similarity = 1 / (1 + dist); // Similar to your Python logic

    results.push({
      user: entry.user,
      provided_skills: entry.provided_skills,
      similarity,
    });
  }

  // Sort and return top N
  results.sort((a, b) => b.similarity - a.similarity);

  return NextResponse.json(results.slice(0, top_n));
}
