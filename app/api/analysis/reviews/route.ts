import { NextResponse } from 'next/server';
import { analyzeProviderReviews } from '@/lib/review-analysis';

export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error('GOOGLE_API_KEY not set');

    const { reviews } = await req.json();
    
    if (!Array.isArray(reviews)) {
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    const parsedReviews = reviews.map((r: any) => ({
      content: r.content,
      rating: r.rating ? Number(r.rating) : undefined,
      date: new Date(r.date).toISOString(),
      reviewerId: r.reviewerId || `anon-${Date.now()}`,
    }));

    const { aggregate, individual } = await analyzeProviderReviews(parsedReviews, apiKey);
    
    return NextResponse.json({
      analysis: {
        aggregateResults: aggregate,
        individualResults: individual
      }
    });

  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}