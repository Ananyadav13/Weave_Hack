import { GoogleGenerativeAI } from "@google/generative-ai";

// For server-side components and API routes
export const serverGenAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Helper function to get the appropriate model based on context
const getModel = () => {
  return serverGenAI.getGenerativeModel({ model: "gemini-1.5-pro" });
};

// Generic content generation function
export async function generateContent(prompt: string) {
  const model = getModel();
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}

// Skill analysis function
export async function analyzeSkill(skillDescription: string) {
  const model = getModel();
  
  const prompt = `
    Analyze the following skill description and provide:
    1. A categorization of this skill (technical, creative, business, etc.)
    2. Suggested matching skills that would complement this one
    3. Estimated learning time for beginners
    4. Key applications of this skill
    
    Skill Description: ${skillDescription}
  `;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// Review summarization function
export async function summarizeReviews(reviews: string[]) {
  const model = getModel();
  
  const reviewText = reviews.join("\n\n");
  const prompt = `
    Summarize the following reviews for a skill provider:
    ${reviewText}
    
    Provide:
    1. Overall sentiment (positive/negative/mixed)
    2. Key strengths mentioned
    3. Areas for improvement
    4. Reliability score (1-10)
  `;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

// Skill suggestion function
export async function generateSkillSuggestions(userProfile: any) {
  const model = getModel();
  
  const prompt = `
    Based on the following user profile, suggest 5 skills they might be interested in learning:
    
    Current skills: ${userProfile.skills.join(", ")}
    Interests: ${userProfile.interests.join(", ")}
    Career goals: ${userProfile.careerGoals}
    
    For each suggested skill, provide:
    1. Name of the skill
    2. Why it would be valuable for this user
    3. How it connects to their existing skills or interests
  `;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}