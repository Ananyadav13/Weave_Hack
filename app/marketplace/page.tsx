"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, MessageCircle, Globe, ChevronLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navbar } from '@/components/Navbar'; // Make sure to update the import path

export default function Marketplace() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Define routes for the navbar
  const routes = [
    { name: "Dashboard", path: "/" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Requests", path: "/requests" },
    { name: "Messages", path: "/messages" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  const categories = [
    "All", "Time", "Value", "Rating", "Category", "Technology", 
    "Art & Design", "Personal Development", 
    "Science & Engineering", "Business & Entrepreneurship"
  ];

  const skillCards = [
    {
      id: 1,
      title: "Learn to play guitar",
      instructor: "John Doe",
      image: "/guitar.jpg",
    },
    {
      id: 2,
      title: "Learn to use Photoshop",
      instructor: "Jane Smith",
      image: "/photoshop.jpg",
    },
    {
      id: 3,
      title: "Learn to cook",
      instructor: "Bob Johnson",
      image: "/cooking.jpg",
    },
    {
      id: 4,
      title: "Learn to code",
      instructor: "Sarah Davis",
      image: "/coding.jpg",
    },
    {
      id: 5,
      title: "Learn to write poetry",
      instructor: "Michael Miller",
      image: "/poetry.jpg",
    },
    {
      id: 6,
      title: "Learn to do yoga",
      instructor: "Emily Wilson",
      image: "/yoga.jpg",
    },
    {
      id: 7,
      title: "Learn to invest in stocks",
      instructor: "Chris Brown",
      image: "/stocks.jpg",
    },
    {
      id: 8,
      title: "Learn to speak Spanish",
      instructor: "Laura Taylor",
      image: "/spanish.jpg",
    },
    {
      id: 9,
      title: "Learn to paint",
      instructor: "Kevin White",
      image: "/painting.jpg",
    },
    {
      id: 10,
      title: "Learn to make a website",
      instructor: "Amanda Lee",
      image: "/website.jpg",
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Replace the original header with Navbar component */}
      <Navbar 
        productName="Weave"
        routes={routes}
        userLoggedIn={true}
        userInitials="JD"
      />

      {/* Adjust main content for navbar spacing */}
      <main className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* Filter tabs */}
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {categories.map((category) => (
              <Badge 
                key={category}
                variant={selectedTab === category.toLowerCase() ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium ${
                  selectedTab === category.toLowerCase() 
                    ? "bg-gray-900 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setSelectedTab(category.toLowerCase())}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Section title and view toggle */}
        <div className="flex justify-between items-center mt-8 mb-6">
          <h2 className="text-2xl font-bold">Most recent</h2>
          <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
            <TabsList className="bg-white">
              <TabsTrigger value="grid" className="data-[state=active]:bg-gray-100">Grid</TabsTrigger>
              <TabsTrigger value="list" className="data-[state=active]:bg-gray-100">List</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Skills Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {skillCards.map((card) => (
            <motion.div 
              key={card.id}
              variants={itemVariants}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-40 bg-gray-100 relative">
                <div className="w-full h-full bg-gray-200 overflow-hidden">
                  <img 
                    src="/api/placeholder/400/320" 
                    alt={card.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{card.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Offered by: {card.instructor}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}