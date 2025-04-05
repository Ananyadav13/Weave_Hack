// app/api/analyze_sentiment/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { review } = await request.json();

    if (!review) {
      return NextResponse.json(
        { error: 'Review text required' },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------------
    // MOCKED SENTIMENT ANALYSIS LOGIC:
    // Replace this with actual calls to your Spark-based Python service
    // or your own Node-based ML logic.
    //
    // For example, you could do:
    // const response = await fetch("http://your-flask-service:5001/analyze_sentiment", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ review }),
    // });
    // const { sentiment, confidence } = await response.json();
    // ------------------------------------------------------------------

    // Simple mock: random classification
    const isPositive = Math.random() > 0.5;
    const sentiment = isPositive ? 'positive' : 'negative';
    const confidence = Number((Math.random()).toFixed(3));

    return NextResponse.json({ sentiment, confidence });
  } catch (error) {
    console.error('[analyze_sentiment] Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong analyzing sentiment.' },
      { status: 500 }
    );
  }
}
