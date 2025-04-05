'use client';
import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@clerk/nextjs";

interface Skill {
  _id: string;
  name: string;
  level: string;
  certificates?: any[];
}

interface UserProfile {
  _id?: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  skills: Skill[];
}

export default function ProfileCompletionCard() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [skillsCount, setSkillsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Only fetch profile if auth is loaded and we have a userId
    if (!isLoaded || !userId) {
      return;
    }
    
    const fetchUserProfile = async () => {
      try {
        // Add a cache-busting query parameter to prevent caching issues
        const response = await fetch(`/api/user/profile?t=${new Date().getTime()}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            console.log('Profile not found for user');
            // Handle the case where profile doesn't exist yet
            setProfile({
              userId: `user_${userId}`,
              email: '',
              firstName: '',
              lastName: '',
              skills: []
            });
            setSkillsCount(0);
            return;
          }
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Profile data:', data);
        setProfile(data);
        
        // Direct count from the skills array in database structure
        if (data && Array.isArray(data.skills)) {
          setSkillsCount(data.skills.length);
          console.log(`Found ${data.skills.length} skills`);
        } else {
          console.log('No skills array found in profile data');
          setSkillsCount(0);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [isLoaded, userId]);
  
  // Calculate completion percentage based on profile completion
  const calculateCompletionPercentage = () => {
    if (!profile) return 0;
    
    let completed = 0;
    let total = 2; // Basic info and skills are the two steps
    
    // Check if basic info is complete
    if (profile.firstName && profile.lastName && profile.email) {
      completed++;
    }
    
    // Check if skills are added
    if (Array.isArray(profile.skills) && profile.skills.length > 0) {
      completed++;
    }
    
    return Math.round((completed / total) * 100);
  };
  
  const completionPercentage = calculateCompletionPercentage();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: {
      y: -3,
      boxShadow: "0 8px 20px -5px rgba(59, 130, 246, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  const handleContinueProfile = () => {
    router.push('/onboarding');
  };

  // If auth isn't loaded yet, show a loading state
  if (!isLoaded) {
    return (
      <Card className="overflow-hidden border shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="text-sm">Loading authentication...</div>
        </CardContent>
      </Card>
    );
  }

  // If no auth userId, show login prompt
  if (!userId) {
    return (
      <Card className="overflow-hidden border shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="text-sm">Please sign in to view your profile.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="w-full"
    >
      <Card className="overflow-hidden border shadow-sm bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-purple-900">Complete Your Profile</h3>
            <span className="text-xs font-medium text-purple-800">{completionPercentage}%</span>
          </div>
          <Progress
            value={completionPercentage}
            className="h-1.5 bg-purple-100"
          />
          
          {loading ? (
            <div className="py-2 text-xs text-gray-500">Loading profile...</div>
          ) : error ? (
            <div className="py-2 text-xs text-red-500">{error}</div>
          ) : (
            <div className="space-y-2 mt-3">
              {/* Basic Info Step */}
              <div
                className={`flex items-center p-2 rounded text-xs ${
                  profile && profile.firstName && profile.lastName && profile.email
                    ? 'bg-purple-50 text-purple-800'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${
                  profile && profile.firstName && profile.lastName && profile.email
                    ? 'bg-purple-100'
                    : 'bg-gray-100'
                }`}>
                  {profile && profile.firstName && profile.lastName && profile.email ? (
                    <CheckCircle2 className="h-3 w-3 text-purple-600" />
                  ) : (
                    <span className="text-gray-600 text-xs font-bold">1</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">Basic Info</p>
                </div>
              </div>
              
              {/* Skills Step */}
              <div
                className={`flex items-center p-2 rounded text-xs ${
                  skillsCount > 0
                    ? 'bg-purple-50 text-purple-800'
                    : 'bg-gray-50 text-gray-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${
                  skillsCount > 0
                    ? 'bg-purple-100'
                    : 'bg-gray-100'
                }`}>
                  {skillsCount > 0 ? (
                    <CheckCircle2 className="h-3 w-3 text-purple-600" />
                  ) : (
                    <span className="text-gray-600 text-xs font-bold">2</span>
                  )}
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <p className="font-medium">Skills</p>
                  {skillsCount > 0 && (
                    <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                      {skillsCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="px-4 py-3 bg-white border-t">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full"
          >
            <Button
              onClick={handleContinueProfile}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full py-1 text-xs"
              size="sm"
            >
              {completionPercentage === 100 ? 'Update Profile' : 'Continue'}
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}