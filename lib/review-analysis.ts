// lib/review-analysis.ts
import { generateContent } from './gemini';

export interface ReviewData {
  content: string;
  rating?: number; // Optional numerical rating if already provided
  date: Date;
  reviewerId: string;
}

export interface SentimentAnalysisResult {
  overallSentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  sentimentScore: number; // 0-10 scale
  responseRating: number; // 0-10 scale
  onTimeDeliveryRating: number; // 0-10 scale
  qualityRating: number; // 0-10 scale
  communicationRating: number; // 0-10 scale
  averageRating: number; // Overall average of all metrics
  keyStrengths: string[];
  areasForImprovement: string[];
}

/**
 * Analyzes sentiment of a single review using Gemini API
 */
export async function analyzeSingleReview(review: ReviewData): Promise<SentimentAnalysisResult> {
  const prompt = `
    Analyze the following skill provider review to extract sentiment and ratings:
    
    Review: "${review.content}"
    ${review.rating ? `Numerical Rating: ${review.rating}/5` : ''}
    
    Provide a detailed analysis with the following metrics:
    1. Overall sentiment (positive, negative, neutral, or mixed)
    2. Sentiment score (0-10 scale)
    3. Response rating - how quickly and effectively the provider responded (0-10 scale)
    4. On-time delivery rating - whether the provider delivered on schedule (0-10 scale)
    5. Quality rating - the overall quality of the service provided (0-10 scale)
    6. Communication rating - effectiveness of provider's communication (0-10 scale)
    7. Key strengths mentioned (list)
    8. Areas for improvement (list)
    
    Format the response as JSON.
  `;

  try {
    const response = await generateContent(prompt);
    // Parse the response as JSON
    const analysisResult = JSON.parse(response);
    
    // Calculate average rating
    const ratingMetrics = [
      analysisResult.sentimentScore,
      analysisResult.responseRating,
      analysisResult.onTimeDeliveryRating,
      analysisResult.qualityRating,
      analysisResult.communicationRating
    ];
    
    analysisResult.averageRating = Number(
      (ratingMetrics.reduce((a, b) => a + b, 0) / ratingMetrics.length).toFixed(1)
    );
    
    return analysisResult as SentimentAnalysisResult;
  } catch (error) {
    console.error("Error analyzing review:", error);
    throw new Error("Failed to analyze review sentiment");
  }
}

/**
 * Analyzes multiple reviews and provides aggregated results
 */
export async function analyzeProviderReviews(reviews: ReviewData[]): Promise<{
  aggregateResults: SentimentAnalysisResult;
  individualResults: SentimentAnalysisResult[];
}> {
  if (reviews.length === 0) {
    throw new Error("No reviews provided for analysis");
  }
  
  // Analyze each review individually
  const individualAnalyses: SentimentAnalysisResult[] = [];
  for (const review of reviews) {
    const analysis = await analyzeSingleReview(review);
    individualAnalyses.push(analysis);
  }
  
  // Aggregate the results
  const aggregateResults = aggregateAnalysisResults(individualAnalyses);
  
  return {
    aggregateResults,
    individualResults: individualAnalyses
  };
}

/**
 * Aggregates individual review analyses into a single result
 */
function aggregateAnalysisResults(analyses: SentimentAnalysisResult[]): SentimentAnalysisResult {
  // Count sentiment occurrences
  const sentimentCounts = {
    positive: 0,
    negative: 0,
    neutral: 0,
    mixed: 0
  };
  
  analyses.forEach(analysis => {
    sentimentCounts[analysis.overallSentiment]++;
  });
  
  // Determine the most common sentiment
  const overallSentiment = Object.entries(sentimentCounts)
    .sort((a, b) => b[1] - a[1])[0][0] as 'positive' | 'negative' | 'neutral' | 'mixed';
  
  // Calculate average scores
  const sentimentScore = average(analyses.map(a => a.sentimentScore));
  const responseRating = average(analyses.map(a => a.responseRating));
  const onTimeDeliveryRating = average(analyses.map(a => a.onTimeDeliveryRating));
  const qualityRating = average(analyses.map(a => a.qualityRating));
  const communicationRating = average(analyses.map(a => a.communicationRating));
  
  // Calculate overall average rating
  const averageRating = Number(
    ((sentimentScore + responseRating + onTimeDeliveryRating + qualityRating + communicationRating) / 5).toFixed(1)
  );
  
  // Aggregate strengths and improvement areas (with frequency counting)
  const strengthsMap: Record<string, number> = {};
  const improvementsMap: Record<string, number> = {};
  
  analyses.forEach(analysis => {
    analysis.keyStrengths.forEach(strength => {
      strengthsMap[strength] = (strengthsMap[strength] || 0) + 1;
    });
    
    analysis.areasForImprovement.forEach(improvement => {
      improvementsMap[improvement] = (improvementsMap[improvement] || 0) + 1;
    });
  });
  
  // Sort by frequency and take top items
  const keyStrengths = Object.entries(strengthsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([strength]) => strength);
    
  const areasForImprovement = Object.entries(improvementsMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([improvement]) => improvement);
  
  return {
    overallSentiment,
    sentimentScore,
    responseRating,
    onTimeDeliveryRating,
    qualityRating,
    communicationRating,
    averageRating,
    keyStrengths,
    areasForImprovement
  };
}

// Helper function to calculate average
function average(values: number[]): number {
  return Number((values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1));
}