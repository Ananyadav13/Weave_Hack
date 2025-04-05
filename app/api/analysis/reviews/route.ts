// app/api/analysis/reviews/route.ts
import { NextResponse } from 'next/server';
import { analyzeProviderReviews } from '@/lib/review-analysis';

export async function POST(req: Request) {
  // Accessing GOOGLE_API_KEY on the server-side
  const googleApiKey = process.env.GOOGLE_API_KEY;
  console.log('GOOGLE_API_KEY (server-side):', googleApiKey ? 'Present' : 'Not Found');

  // Accessing NEXT_PUBLIC_GEMINI_API_KEY on the server-side
  const nextPublicGeminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  console.log('NEXT_PUBLIC_GEMINI_API_KEY (server-side):', nextPublicGeminiApiKey ? 'Present' : 'Not Found');

  try {
    const { reviews } = await req.json();

    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: 'Valid reviews array is required' },
        { status: 400 }
      );
    }

    // Convert string dates to Date objects
    const parsedReviews = reviews.map(review => ({
      ...review,
      date: new Date(review.date)
    }));

    const analysisResults = await analyzeProviderReviews(parsedReviews);

    return NextResponse.json({
      success: true,
      analysis: analysisResults
    });
  } catch (error: any) {
    console.error('Review analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze reviews', details: error.message || String(error) },
      { status: 500 }
    );
  }
}