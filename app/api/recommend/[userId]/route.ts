// app/api/recommend/[userId]/route.ts

import { NextResponse } from 'next/server';

type Recommendation = {
  provider: number;
  score: number;
};

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid userId provided' },
        { status: 400 }
      );
    }

    // ------------------------------------------------------------------
    // MOCKED RECOMMENDATION LOGIC:
    // Replace this with actual calls to your Spark-based Python service
    // or your own Node-based ML logic.
    //
    // For example, you could do:
    // const response = await fetch(`http://your-flask-service:5001/recommend/${userId}`);
    // const data = await response.json();
    // if (data.error) {
    //   return NextResponse.json({ error: data.error }, { status: 404 });
    // }
    // return NextResponse.json(data);
    // ------------------------------------------------------------------

    // Simple mock: Generate 5 random "providers" with random "scores"
    const recommendations: Recommendation[] = Array.from({ length: 5 }).map(
      () => ({
        provider: Math.floor(Math.random() * 500), // mock: 0-499
        score: Number((Math.random() * 5).toFixed(2)), // mock: 0.00-5.00
      })
    );

    return NextResponse.json({
      user: userId,
      recommendations,
    });
  } catch (error) {
    console.error('[recommend] Error:', error);
    return NextResponse.json(
      { error: 'Something went wrong generating recommendations.' },
      { status: 500 }
    );
  }
}
