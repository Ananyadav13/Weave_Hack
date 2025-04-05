'use client';

import React from 'react';
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { CheckCircle2, ChevronRight } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ProfileCompletionCard() {
  const router = useRouter();
  const completionPercentage = 50;
  
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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="w-full"
    >
      <Card className="overflow-hidden border border-indigo-100 shadow-sm bg-gradient-to-r from-white to-indigo-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-indigo-900">Complete Your Profile</h3>
            <span className="text-xs font-medium text-indigo-800">{completionPercentage}%</span>
          </div>
          
          <Progress 
            value={completionPercentage} 
            className="h-1.5 bg-indigo-100" 
          />
          
          <div className="space-y-2 mt-3">
            {[1, 2].map((step) => (
              <div 
                key={step} 
                className={`flex items-center p-2 rounded text-xs ${
                  step === 1 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-indigo-50 text-indigo-800'
                }`}
              >
                <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 ${
                  step === 1 
                    ? 'bg-green-100' 
                    : 'bg-indigo-100'
                }`}>
                  {step === 1 ? (
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  ) : (
                    <span className="text-indigo-600 text-xs font-bold">{step}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{step === 1 ? 'Basic Info' : 'Skills'}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="px-4 py-3 bg-white border-t border-indigo-100">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full"
          >
            <Button 
              onClick={handleContinueProfile}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-1 text-xs"
              size="sm"
            >
              Continue
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}