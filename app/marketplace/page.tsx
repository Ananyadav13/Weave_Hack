"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar"; // Now importing the separate Navbar component
import { motion } from "framer-motion";
import { Filter, Grid, List, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample marketplace data
const marketplaceItems = [
  {
    id: 1,
    title: "Website Redesign",
    description: "Looking for an experienced designer to revamp our company website",
    budget: "$1,000 - $2,500",
    postedBy: "TechCorp Inc.",
    rating: 4.8,
    reviews: 156,
    skills: ["UI/UX", "React", "Figma"]
  },
  {
    id: 2,
    title: "Mobile App Development",
    description: "Need a developer to build an iOS food delivery application",
    budget: "$3,000 - $5,000",
    postedBy: "FoodFast",
    rating: 4.5,
    reviews: 89,
    skills: ["Swift", "iOS", "API Integration"]
  },
  {
    id: 3,
    title: "Marketing Campaign",
    description: "Seeking a marketing expert to plan and execute a product launch campaign",
    budget: "$1,500 - $3,000",
    postedBy: "NewStartup",
    rating: 4.2,
    reviews: 42,
    skills: ["Digital Marketing", "Social Media", "Content Creation"]
  },
  {
    id: 4,
    title: "Logo Design",
    description: "Need a modern, minimalist logo for a new fitness brand",
    budget: "$250 - $500",
    postedBy: "FitLife",
    rating: 4.9,
    reviews: 217,
    skills: ["Graphic Design", "Branding", "Illustrator"]
  },
  {
    id: 5,
    title: "E-commerce Integration",
    description: "Looking for help integrating payment systems into our online store",
    budget: "$800 - $1,200",
    postedBy: "ShopEasy",
    rating: 4.7,
    reviews: 103,
    skills: ["Shopify", "Stripe", "JavaScript"]
  },
  {
    id: 6,
    title: "Content Writing",
    description: "Need blog articles written for our tech website (10 articles)",
    budget: "$500 - $1,000",
    postedBy: "TechBlog",
    rating: 4.4,
    reviews: 76,
    skills: ["Writing", "SEO", "Research"]
  }
];

export default function Marketplace() {
  const [viewMode, setViewMode] = useState("grid");
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 md:px-6 py-8 pt-24 lg:pt-28">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 sm:mt-8 gap-4">
            <motion.h1 
              className="text-xl sm:text-2xl font-bold text-gray-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              Marketplace
            </motion.h1>
            
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Newest First</DropdownMenuItem>
                  <DropdownMenuItem>Highest Budget</DropdownMenuItem>
                  <DropdownMenuItem>Best Rated</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex bg-white rounded-md border">
                <Button
                  variant={viewMode === "grid" ? "subtle" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === "list" ? "subtle" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" : "flex flex-col space-y-4"}
          >
            {marketplaceItems.map((project) => (
              <motion.div key={project.id} variants={item} className="h-full">
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="flex flex-col xs:flex-row xs:items-center text-xs sm:text-sm gap-1 xs:gap-0">
                      <span>{project.postedBy}</span>
                      <span className="flex items-center xs:ml-2">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {project.rating} ({project.reviews})
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs sm:text-sm text-gray-600">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {project.skills.map((skill) => (
                        <span 
                          key={skill} 
                          className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-xs sm:text-sm font-medium">{project.budget}</span>
                    <Button size="sm" variant="outline" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                      Apply
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}