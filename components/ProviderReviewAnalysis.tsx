// components/ProviderReviewAnalysis.tsx
'use client';

import React, { useState } from 'react';
import { SentimentAnalysisResult, ReviewData } from '@/lib/review-analysis';

interface ProviderReviewAnalysisProps {
  providerId: string;
  initialReviews?: any[]; // Make more flexible to accept both string dates and Date objects
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
  const [currentReviews, setCurrentReviews] = useState<any[]>(initialReviews);

  const handleAddReviewClick = () => {
    setAddingReview(true);
  };

  const handleNewReviewContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewReviewContent(event.target.value);
  };

  const handleNewReviewRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    setNewReviewRating(isNaN(value) ? undefined : value);
  };

  const handleSubmitNewReview = () => {
    if (!newReviewContent.trim()) {
      setError('Review content cannot be empty.');
      return;
    }
    const newReview = {
      content: newReviewContent,
      rating: newReviewRating,
      date: new Date().toISOString(), // Use ISO string format for consistency
      reviewerId: `user-${Date.now()}`, // Generate a unique ID
    };
    const updatedReviews = [...currentReviews, newReview];
    setCurrentReviews(updatedReviews);
    setNewReviewContent('');
    setNewReviewRating(undefined);
    setAddingReview(false);
    setError(null);
    analyzeReviews(updatedReviews); // Immediately analyze after submitting
  };

  const handleCancelAddReview = () => {
    setAddingReview(false);
    setNewReviewContent('');
    setNewReviewRating(undefined);
    setError(null);
  };

  const analyzeReviews = async (reviewsToAnalyze: any[]) => {
    if (reviewsToAnalyze.length === 0) {
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
        body: JSON.stringify({ reviews: reviewsToAnalyze }),
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

  const RatingBar = ({ value, label }: { value: number; label: string }) => {
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

      {addingReview ? (
        <div className="mb-4 p-4 border rounded">
          <h3 className="text-lg font-semibold mb-2">Add New Review</h3>
          <div className="mb-2">
            <label htmlFor="newReviewContent" className="block text-sm font-medium text-gray-700">
              Review Content
            </label>
            <textarea
              id="newReviewContent"
              value={newReviewContent}
              onChange={handleNewReviewContentChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-2">
            <label htmlFor="newReviewRating" className="block text-sm font-medium text-gray-700">
              Rating (0-5, optional)
            </label>
            <input
              type="number"
              id="newReviewRating"
              value={newReviewRating === undefined ? '' : newReviewRating}
              onChange={handleNewReviewRatingChange}
              min="0"
              max="5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSubmitNewReview}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1"
            >
              Submit and Analyze
            </button>
            <button
              onClick={handleCancelAddReview}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
            >
              Cancel
            </button>
          </div>
          {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
        </div>
      ) : (
        <button
          onClick={handleAddReviewClick}
          className="px-4 py-2 mb-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
        >
          Add Review
        </button>
      )}

      {!analysisResults && !addingReview && currentReviews.length > 0 && (
        <button
          onClick={() => analyzeReviews(currentReviews)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
        >
          {loading ? 'Analyzing...' : 'Analyze Existing Reviews'}
        </button>
      )}

      {error && !addingReview && (
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

      {!analysisResults && currentReviews.length === 0 && !addingReview && (
        <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-md">
          No reviews available for this provider yet.
        </div>
      )}
    </div>
  );
}