// app/test-review-analysis/page.tsx
'use client';

import React, { useEffect } from 'react';
import ProviderReviewAnalysis from '@/components/ProviderReviewAnalysis';
import { ReviewData } from '@/lib/review-analysis';

const TestReviewAnalysisPage = () => {
  // Accessing NEXT_PUBLIC_GEMINI_API_KEY on the client-side
  const nextPublicGeminiApiKeyClient = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  useEffect(() => {
    console.log('NEXT_PUBLIC_GEMINI_API_KEY (test page - client-side):', nextPublicGeminiApiKeyClient ? 'Present' : 'Not Found');
    // You would typically NOT log your API key in a real application.
    // This is for demonstration purposes only.
  }, [nextPublicGeminiApiKeyClient]);

  // Fixed initialReviews: string dates will be converted to Date objects in the API route
  const initialReviews = [
    {
      content: 'The service was excellent and delivered on time!',
      rating: 5,
      date: '2025-04-01',
      reviewerId: 'user1',
    },
    {
      content: 'Communication could have been better, but the quality was good.',
      rating: 4,
      date: '2025-03-25',
      reviewerId: 'user2',
    },
    {
      content: 'Not satisfied with the outcome, it didn\'t meet my expectations.',
      rating: 2,
      date: '2025-03-15',
      reviewerId: 'user3',
    },
  ];

  // Fixed: Properly typing the empty array
  const emptyReviews: any[] = [];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Provider Review Analysis Component</h1>
      <div style={{ marginBottom: '30px' }}>
        <h2>With Initial Reviews:</h2>
        <ProviderReviewAnalysis providerId="testProvider1" initialReviews={initialReviews} />
      </div>
      <div>
        <h2>Without Initial Reviews:</h2>
        <ProviderReviewAnalysis providerId="testProvider2" initialReviews={emptyReviews} />
      </div>
    </div>
  );
};

export default TestReviewAnalysisPage;