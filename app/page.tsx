'use client';

import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Bell, User, Moon, Sun, ChevronRight, Star, Clock, Shield, Users, Trophy, Grid, List } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Navbar } from '@/components/Navbar';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const { theme, setTheme } = useTheme();
  
  // Set initial state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sample data
  const username = "Alex";
  const matches = [
    {
      id: 1,
      name: "Mia",
      rating: 4.8,
      skill: "Marketing strategy",
      description: "I can help you with your marketing strategy. I'm a marketing professional with 5+ years of experience.",
      avatarUrl: "/api/placeholder/400/400"
    },
    {
      id: 2,
      name: "Ethan",
      rating: 4.7,
      skill: "UX/UI design",
      description: "I can help you with your UI/UX design. I'm a designer with 5+ years of experience.",
      avatarUrl: "/api/placeholder/400/400"
    }
  ];
  
  const pendingRequests = [
    {
      id: 1,
      skill: "Copywriting",
      description: "I need help with writing copy for my website. I'm looking for someone with experience in marketing and branding.",
      logoUrl: "/api/placeholder/400/400",
      postedDays: 2
    },
    {
      id: 2,
      skill: "Market research",
      description: "I'm conducting a market research study and need help with data analysis. I'm looking for someone with experience in statistics and research methods.",
      logoUrl: "/api/placeholder/400/400",
      postedDays: 5
    }
  ];
  
  const reputationStats = [
    { label: "Average rating", value: "4.7", icon: <Star className="h-5 w-5" /> },
    { label: "Response rate", value: "4.9", icon: <Clock className="h-5 w-5" /> },
    { label: "On-time delivery", value: "4.5", icon: <Shield className="h-5 w-5" /> },
    { label: "Total matches", value: "12", icon: <Users className="h-5 w-5" /> }
  ];
  
  const userSkills = ["Marketing", "UX/UI design", "Copywriting", "Market research", "Data analysis", "Statistics"];

  // Define routes for the navbar
  const routes = [
    { name: "Dashboard", path: "/" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Requests", path: "/requests" },
    { name: "Messages", path: "/messages" }
  ];

  // Filter categories like in the image
  const categories = [
    "All", "Time", "Value", "Rating", "Category", "Technology", 
    "Art & Design", "Personal Development", "Science & Engineering", 
    "Business & Entrepreneurship"
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900">
      {/* Navigation */}
      <Navbar 
        productName="Weave"
        routes={routes}
        userLoggedIn={true}
        userAvatar="/api/placeholder/400/400"
        userInitials={username.charAt(0)}
      />

      {/* Main Content */}
      <main className="w-full px-6 py-12 pt-24">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8 max-w-7xl mx-auto"
        >
          {/* Welcome Section */}
          <motion.section variants={itemVariants} className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Good evening, {username}</h1>
            <p className="text-gray-600">Here's what's happening in your world</p>
          </motion.section>

          {/* Filter Categories */}
          <motion.section variants={itemVariants} className="mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={category === "All" ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full px-4 py-2 ${
                    category === "All" ? "bg-gray-900 text-white" : "bg-white text-gray-700"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </motion.section>

          {/* New Matches Section */}
          <motion.section variants={itemVariants}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Users className="mr-2 h-5 w-5 text-gray-600" />
                You have new matches!
              </h2>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-md"
                >
                  <Grid className="h-4 w-4" />
                  <span className="ml-1">Grid</span>
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-md"
                >
                  <List className="h-4 w-4" />
                  <span className="ml-1">List</span>
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              {matches.map((match) => (
                <motion.div 
                  key={match.id}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/4 md:w-1/5">
                      <div className="relative h-full flex items-center justify-center aspect-square sm:aspect-auto overflow-hidden">
                        {/* Changed from Avatar to direct img with square styling */}
                        <img
                          src={match.avatarUrl}
                          alt={match.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Fallback can be handled with onError if needed */}
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <span className="text-gray-800 font-medium">{match.name}</span>
                              <span className="ml-2 flex items-center text-orange-500">
                                <Star className="h-4 w-4 mr-1 fill-orange-500 text-orange-500" />
                                {match.rating}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mt-1">{match.skill}</h3>
                          </div>
                        </div>
                        <p className="mt-2 text-gray-600">{match.description}</p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-5"
                          >
                            Message
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Pending Requests Section */}
          <motion.section variants={itemVariants} className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-600" />
              Pending requests
            </h2>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <motion.div 
                  key={request.id}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/4 md:w-1/5">
                      <div className="h-full bg-gray-50 flex items-center justify-center p-6 aspect-square sm:aspect-auto">
                        <div className="rounded-full bg-white p-4 shadow-sm">
                          <img
                            src={request.logoUrl}
                            alt={request.skill}
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Posted {request.postedDays} days ago
                          </div>
                        </div>
                        <h3 className="font-semibold text-gray-800 mt-1">{request.skill}</h3>
                        <p className="mt-2 text-gray-600">{request.description}</p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-5"
                          >
                            View
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Reputation Section */}
          <motion.section variants={itemVariants} className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Shield className="mr-2 h-5 w-5 text-gray-600" />
              Reputation
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {reputationStats.map((stat, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="bg-white text-center border-gray-200 shadow-sm overflow-hidden">
                    <CardContent className="pt-6">
                      <div className="flex justify-center mb-3">
                        <div className="bg-gray-100 p-3 rounded-full text-gray-600">
                          {stat.icon}
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                      <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Your Skills Section */}
          <motion.section variants={itemVariants} className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-gray-600" />
              Your skills
            </h2>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div>
                <div className="flex flex-wrap gap-3">
                  {userSkills.map((skill, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Badge
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 text-sm rounded-full"
                      >
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-medium text-gray-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-600"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                      75% profile completion
                    </p>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  >
                    <Progress 
                      value={75} 
                      className="h-2 bg-gray-100 rounded-full overflow-hidden"
                    />
                  </motion.div>
                  <div className="mt-4 flex justify-end">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-5"
                      >
                        Add skills
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
}