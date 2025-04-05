import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  clerkId: string;
  email: string;
  name?: string;
  onboardingComplete: boolean;
  skills: Skill[];
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  certificates: Certificate[];
}

export interface Certificate {
  id: string;
  name: string;
  fileUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  images: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  name: string;
  fileUrl: string;
}

// Helper function to check if user exists
export async function getUserByClerkId(db: any, clerkId: string) {
  return db.collection('users').findOne({ clerkId });
}

// Helper function to check if onboarding is completed
export async function isOnboardingComplete(db: any, clerkId: string) {
  const user = await getUserByClerkId(db, clerkId);
  return user && user.onboardingComplete;
}