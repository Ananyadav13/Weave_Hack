// app/api/analysis/reviews/route.ts
import { NextResponse } from 'next/server';
import { analyzeProviderReviews, ReviewData } from '@/lib/review-analysis';

export async function POST(req: Request) {
  try {
    const { reviews } = await req.json();
    
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return NextResponse.json(
        { error: 'Valid reviews array is required' }, 
        { status: 400 }
      );
    }
    
    const parsedReviews: ReviewData[] = reviews.map(review => ({
      ...review,
      date: new Date(review.date)
    }));
    
    const analysisResults = await analyzeProviderReviews(parsedReviews);
    
    return NextResponse.json({
      success: true,
      analysis: analysisResults
    });
  } catch (error) {
    console.error('Review analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze reviews' },
      { status: 500 }
    );
  }
}