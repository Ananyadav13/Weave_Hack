"use client"


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft } from 'lucide-react';

const SkillExchangePage = () => {
  const [completionPercentage,] = useState(60);
  const [rate, setRate] = useState(100);
  const [, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="max-w-4xl mx-auto pt-4 px-6 pb-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center">
            <ChevronLeft className="h-5 w-5 text-gray-800 mr-2" />
            <span className="font-semibold text-gray-800">Skill Exchange</span>
          </div>
          <div className="flex gap-6 items-center">
            <nav className="flex gap-6">
              <span className="text-gray-700 text-sm">How it works</span>
              <span className="text-gray-700 text-sm">Explore</span>
              <span className="text-gray-700 text-sm">For experts</span>
              <span className="text-gray-700 text-sm">For learners</span>
            </nav>
            <div className="flex gap-3 items-center">
              <button className="p-2 rounded-full border border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500"></div>
            </div>
          </div>
        </div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Progress section */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">Complete your profile</h2>
              <span className="text-gray-600">{completionPercentage}%</span>
            </div>
            <Progress 
              value={completionPercentage} 
              className="h-2 bg-blue-100 rounded-full mb-2"
            />
            <p className="text-sm text-gray-600">This will help us get to know you and connect you with the right people</p>
          </motion.div>
          
          {/* What's your time worth? */}
          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-bold text-gray-800 mb-4"> What&apos;s your time worth?</h2>
            <p className="text-gray-700 mb-6">
              Experts on Skill Exchange charge between $10 and $200 per hour. To help you set a fair rate, let&apos;s compare your hourly rate to common services and products.
            </p>
            
            {/* Image placeholder */}
            <div className="bg-gray-100 rounded-lg h-32 w-full mb-8 flex items-center justify-end pr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M2 8v-.5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-16a2 2 0 0 1-2-2V15"/><rect x="6" y="14" width="12" height="4" rx="1"/><path d="M8 12V4h8v8"/></svg>
            </div>
          </motion.div>
          
          {/* Set your hourly rate */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-medium text-gray-800 mb-6">Set your hourly rate</h2>
            
            <div className="mb-8">
              <div className="mb-2">
                <p className="text-gray-700 mb-6">Expert hourly rate</p>
              </div>
              <div className="relative">
                <Slider
                  defaultValue={[rate]}
                  min={10}
                  max={200}
                  step={1}
                  onValueChange={(value) => setRate(value[0])}
                  className="mb-2"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm font-medium text-gray-700">$10</span>
                  <span className="text-sm font-medium text-gray-700">$200</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Compare your rate */}
          <motion.div variants={itemVariants}>
            <h2 className="text-lg font-medium text-gray-800 mb-6">Compare your rate</h2>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-6">
                <div className="flex justify-between">
                  <div>
                    <p className="text-blue-600 text-sm mb-1">Hourly rate for a personal chef</p>
                    <p className="text-gray-800 font-medium">$20-$50</p>
                  </div>
                  <div>
                    <p className="text-blue-600 text-sm mb-1">Price of a one-hour massage</p>
                    <p className="text-gray-800 font-medium">$60-$120</p>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-blue-600 text-sm mb-1">Average cost of a video game</p>
                <p className="text-gray-800 font-medium">$50</p>
              </div>
            </div>
          </motion.div>
          
          {/* Save button */}
          <motion.div 
            variants={itemVariants}
            className="pt-6"
          >
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium"
            >
              Save and continue
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SkillExchangePage;