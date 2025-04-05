'use client';

import React, { useState } from 'react';
import { SentimentAnalysisResult, ReviewData } from '@/lib/review-analysis';

interface ProviderReviewAnalysisProps {
  providerId: string;
  initialReviews?: ReviewData[];
}

export default function ProviderReviewAnalysis({ providerId, initialReviews = [] }: ProviderReviewAnalysisProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<{
    aggregateResults: SentimentAnalysisResult;
    individualResults: SentimentAnalysisResult[];
  } | null>(null);
  const [newReviewContent, setNewReviewContent] = useState('');
  const [newReviewRating, setNewReviewRating] = useState<number | undefined>(undefined);
  const [addingReview, setAddingReview] = useState(false);
  const [currentReviews, setCurrentReviews] = useState<ReviewData[]>(initialReviews);

  const handleAddReview = () => {
    setAddingReview(true);
  };

  const handleCancelReview = () => {
    setAddingReview(false);
    setNewReviewContent('');
    setNewReviewRating(undefined);
  };

  const handleSubmitReview = () => {
    if (!newReviewContent) {
      return;
    }
    
    const newReview: ReviewData = {
      content: newReviewContent,
      rating: newReviewRating,
      date: new Date().toISOString(),
      reviewerId: `user-${Date.now()}`, // Generate a temporary ID
    };
    
    const updatedReviews = [...currentReviews, newReview];
    setCurrentReviews(updatedReviews);
    setAddingReview(false);
    setNewReviewContent('');
    setNewReviewRating(undefined);
  };

  const analyzeReviews = async (reviewsToAnalyze: ReviewData[]) => {
    if (reviewsToAnalyze.length === 0) {
      setError('No reviews available to analyze');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formattedReviews = reviewsToAnalyze.map((review) => ({
        ...review,
        date: review.date instanceof Date ? review.date.toISOString() : review.date,
        rating: review.rating ? Number(review.rating) : undefined,
      }));

      const response = await fetch('/api/analysis/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: formattedReviews }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      
      if (!data?.analysis?.aggregateResults) {
        throw new Error('Invalid analysis results');
      }

      setAnalysisResults(data.analysis);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const RatingBar = ({ value, label }: { value: number; label: string }) => {
    const roundedValue = Math.round(value * 10) / 10;
    const percentage = (roundedValue / 10) * 100;
    
    return (
      <div className="mb-3">
        <div className="flex justify-between mb-1">
          <span className="text-sm">{label}</span>
          <span className="text-sm font-semibold">{roundedValue}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Review Analysis</h2>
      
      {/* Reviews Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Reviews ({currentReviews.length})</h3>
          {!addingReview && (
            <button
              onClick={handleAddReview}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Add Review
            </button>
          )}
        </div>

        {/* Add Review Form */}
        {addingReview && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium mb-3">Add New Review</h4>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setNewReviewRating(rating)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      newReviewRating === rating ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Review</label>
              <textarea
                value={newReviewContent}
                onChange={(e) => setNewReviewContent(e.target.value)}
                placeholder="Write your review..."
                className="w-full p-2 border rounded-md h-24"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSubmitReview}
                disabled={!newReviewContent}
                className={`px-4 py-2 bg-blue-600 text-white rounded ${
                  !newReviewContent ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                } transition`}
              >
                Submit
              </button>
              <button
                onClick={handleCancelReview}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Review List */}
        {currentReviews.length > 0 ? (
          <div className="space-y-4">
            {currentReviews.map((review, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between">
                  <div className="flex space-x-2 items-center mb-2">
                    {review.rating && (
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium">
                        {review.rating}/5
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">ID: {review.reviewerId}</div>
                </div>
                <p className="text-gray-700">{review.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 border rounded-lg bg-gray-50">
            <p className="text-gray-500">No reviews available yet.</p>
          </div>
        )}
      </div>

      {/* Analysis Section */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">AI Analysis</h3>
          <button
            onClick={() => analyzeReviews(currentReviews)}
            disabled={loading || currentReviews.length === 0}
            className={`px-4 py-2 bg-green-600 text-white rounded ${
              loading || currentReviews.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
            } transition`}
          >
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {!loading && analysisResults && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-semibold text-lg mb-4">Aggregate Results</h4>
            
            {/* Rating Bars */}
            <div className="mb-6">
              <RatingBar value={analysisResults.aggregateResults.sentimentScore} label="Overall Sentiment" />
              <RatingBar value={analysisResults.aggregateResults.responseRating} label="Response" />
              <RatingBar value={analysisResults.aggregateResults.onTimeDeliveryRating} label="On-time Delivery" />
              <RatingBar value={analysisResults.aggregateResults.qualityRating} label="Quality" />
              <RatingBar value={analysisResults.aggregateResults.communicationRating} label="Communication" />
            </div>
            
            {/* Strengths and Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-2 text-green-700">Key Strengths</h5>
                <ul className="list-disc pl-5 space-y-1">
                  {analysisResults.aggregateResults.keyStrengths.map((strength, index) => (
                    <li key={index} className="text-sm">{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2 text-amber-700">Areas for Improvement</h5>
                <ul className="list-disc pl-5 space-y-1">
                  {analysisResults.aggregateResults.areasForImprovement.map((area, index) => (
                    <li key={index} className="text-sm">{area}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {analysisResults.aggregateResults.summary && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium mb-2">Summary</h5>
                <p className="text-sm text-gray-700">{analysisResults.aggregateResults.summary}</p>
              </div>
            )}
          </div>
        )}

        {!loading && !analysisResults && !error && (
          <div className="text-center p-8 border rounded-lg bg-gray-50">
            <p className="text-gray-500">Run analysis to see results.</p>
          </div>
        )}
      </div>
    </div>
  );
}