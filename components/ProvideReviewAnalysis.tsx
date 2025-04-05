'use client';

import React, { useState } from 'react';
import { SentimentAnalysisResult } from '@/lib/review-analysis';

interface ProviderReviewAnalysisProps {
  providerId: string;
  initialReviews?: Array<{
    content: string;
    rating?: number;
    date: string;
    reviewerId: string;
  }>;
}

export default function ProviderReviewAnalysis({ providerId, initialReviews = [] }: ProviderReviewAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<{
    aggregateResults: SentimentAnalysisResult;
    individualResults: SentimentAnalysisResult[];
  } | null>(null);
  
  const analyzeReviews = async () => {
    if (initialReviews.length === 0) {
      setError('No reviews available to analyze');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/analysis/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviews: initialReviews }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      setAnalysisResults(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze reviews');
    } finally {
      setLoading(false);
    }
  };
  
  // Rating component with color coding
  const RatingBar = ({ value, label }: { value: number; label: string }) => {
    // Determine color based on rating value
    const getColor = (val: number) => {
      if (val >= 8) return 'bg-green-500';
      if (val >= 6) return 'bg-blue-500';
      if (val >= 4) return 'bg-yellow-500';
      return 'bg-red-500';
    };
    
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm font-medium">{value}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${getColor(value)}`} 
            style={{ width: `${value * 10}%` }}
          ></div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Provider Review Analysis</h2>
      
      {!analysisResults && (
        <button
          onClick={analyzeReviews}
          disabled={loading || initialReviews.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
        >
          {loading ? 'Analyzing...' : 'Analyze Reviews'}
        </button>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {analysisResults && (
        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="text-lg font-semibold mb-3">Overall Provider Rating</h3>
            
            <div className="flex items-center justify-center mb-6">
              <div className="text-4xl font-bold text-blue-600">
                {analysisResults.aggregateResults.averageRating}
                <span className="text-lg text-gray-500">/10</span>
              </div>
            </div>
            
            <RatingBar 
              value={analysisResults.aggregateResults.responseRating} 
              label="Response Rating" 
            />
            <RatingBar 
              value={analysisResults.aggregateResults.onTimeDeliveryRating} 
              label="On-time Delivery" 
            />
            <RatingBar 
              value={analysisResults.aggregateResults.qualityRating} 
              label="Quality Rating" 
            />
            <RatingBar 
              value={analysisResults.aggregateResults.communicationRating} 
              label="Communication" 
            />
            <RatingBar 
              value={analysisResults.aggregateResults.sentimentScore} 
              label="Overall Sentiment" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3">Key Strengths</h3>
              <ul className="list-disc pl-5 space-y-1">
                {analysisResults.aggregateResults.keyStrengths.map((strength, idx) => (
                  <li key={idx} className="text-sm">{strength}</li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-3">Areas for Improvement</h3>
              <ul className="list-disc pl-5 space-y-1">
                {analysisResults.aggregateResults.areasForImprovement.map((area, idx) => (
                  <li key={idx} className="text-sm">{area}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      {initialReviews.length === 0 && (
        <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-md">
          No reviews available for this provider yet.
        </div>
      )}
    </div>
  );
}