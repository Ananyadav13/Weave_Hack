import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ReviewData {
  content: string;
  rating?: number;
  date: string | Date;
  reviewerId: string;
}

export interface SentimentAnalysisResult {
  responseRating: number;
  onTimeDeliveryRating: number;
  qualityRating: number;
  communicationRating: number;
  sentimentScore: number;
  keyStrengths: string[];
  areasForImprovement: string[];
  summary: string;
}

export interface ReviewAnalysis extends SentimentAnalysisResult {
  reviewId: string;
  originalContent: string;
}

export async function analyzeProviderReviews(
  reviews: ReviewData[],
  apiKey: string
): Promise<{ aggregate: SentimentAnalysisResult; individual: ReviewAnalysis[] }> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const analysisPromises = reviews.map(async (review) => {
    const prompt = `Analyze this service review in depth:
    "${review.content}"
    ${review.rating ? `Rating: ${review.rating}/5` : ''}
    
    Provide JSON with:
    - sentimentScore: 1-10
    - responseRating: 1-10
    - onTimeDeliveryRating: 1-10
    - qualityRating: 1-10 
    - communicationRating: 1-10
    - keyStrengths: array
    - areasForImprovement: array
    - summary: string`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    try {
      // Fix: Improved JSON extraction with better error handling
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      const analysis: SentimentAnalysisResult = jsonMatch 
        ? JSON.parse(jsonMatch[1]) 
        : JSON.parse(text);

      return {
        reviewId: review.reviewerId,
        originalContent: review.content,
        ...analysis
      };
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      console.log('Response text:', text);
      
      // Provide a fallback with default values
      return {
        reviewId: review.reviewerId,
        originalContent: review.content,
        responseRating: 0,
        onTimeDeliveryRating: 0,
        qualityRating: 0,
        communicationRating: 0,
        sentimentScore: 0,
        keyStrengths: [],
        areasForImprovement: [],
        summary: 'Failed to analyze review'
      };
    }
  });

  const individualResults = await Promise.all(analysisPromises);
  
  // Calculate aggregate results
  const aggregateResults: SentimentAnalysisResult = {
    responseRating: individualResults.reduce((sum, r) => sum + r.responseRating, 0) / individualResults.length,
    onTimeDeliveryRating: individualResults.reduce((sum, r) => sum + r.onTimeDeliveryRating, 0) / individualResults.length,
    qualityRating: individualResults.reduce((sum, r) => sum + r.qualityRating, 0) / individualResults.length,
    communicationRating: individualResults.reduce((sum, r) => sum + r.communicationRating, 0) / individualResults.length,
    sentimentScore: individualResults.reduce((sum, r) => sum + r.sentimentScore, 0) / individualResults.length,
    keyStrengths: Array.from(new Set(individualResults.flatMap(r => r.keyStrengths))).slice(0, 5),
    areasForImprovement: Array.from(new Set(individualResults.flatMap(r => r.areasForImprovement))).slice(0, 5),
    summary: 'Aggregate analysis of all reviews'
  };

  return { aggregate: aggregateResults, individual: individualResults };
}