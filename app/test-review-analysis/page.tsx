'use client';
import React from 'react';
import { motion } from 'framer-motion';
import ProviderReviewAnalysis from '@/components/ProviderReviewAnalysis';

const initialReviews = [
  {
    content: 'Excellent service and fast response!',
    rating: 5,
    date: new Date().toISOString(),
    reviewerId: 'user-123'
  },
  {
    content: 'Good quality but delayed delivery',
    rating: 3,
    date: new Date().toISOString(),
    reviewerId: 'user-456'
  }
];

export default function TestPage() {
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100">
      <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-purple-800">Review Analysis</h1>
          <p className="text-purple-600 mt-2">Provider performance insights</p>
        </motion.div>
        
        {/* Main Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6 md:p-8 bg-white rounded-xl shadow-lg border border-purple-100 backdrop-blur-sm bg-opacity-95"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-purple-700 flex items-center">
            <span className="inline-block w-2 h-6 bg-purple-500 rounded mr-3"></span>
            Provider Analysis
          </h2>
          <ProviderReviewAnalysis 
            providerId="test-123"
            initialReviews={initialReviews}
          />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 md:p-8 bg-white rounded-xl shadow-lg border border-purple-100 backdrop-blur-sm bg-opacity-95"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-purple-700 flex items-center">
            <span className="inline-block w-2 h-6 bg-purple-500 rounded mr-3"></span>
            Empty State Test
          </h2>
          <ProviderReviewAnalysis 
            providerId="test-456"
            initialReviews={[]}
          />
        </motion.div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-purple-500 text-sm mt-12"
        >
          <p>© 2025 Provider Review Dashboard</p>
        </motion.div>
      </div>
    </div>
  );
}