// types/mongodb.ts
export interface Certificate {
    id: string;
    name: string;
    fileId?: string;
    contentType?: string;
    size?: number;
    uploadedAt?: Date;
  }
  
  export interface Skill {
    id: string;
    name: string;
    level: string;
    certificates: Certificate[];
  }
  
  export interface ProjectImage {
    id: string;
    name: string;
    fileId?: string;
    contentType?: string;
    size?: number;
    preview?: string;  // This will be used only client-side before upload
    uploadedAt?: Date;
  }
  
  export interface Project {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    images: ProjectImage[];
  }
  
  export interface UserProfile {
    _id?: string;
    userId: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
    skills: Skill[];
    projects: Project[];
    onboardingCompleted?: boolean;
    onboardingCompletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }