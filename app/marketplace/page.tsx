"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Heart, X, ChevronDown, Globe, DollarSign, Briefcase, ExternalLink, Clock, User, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar"; 

// Job interface
interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  postedTime: string;
  price: number;
  priceType: string;
  level: string;
  proposals: number;
  location: string;
  rating: number;
  spent: string;
  tags: string[];
  saved: boolean;
}

// Sample job data
const jobsData: Job[] = [
  {
    id: 1,
    title: "Add Phone Field to React Hook Form (Next.js)",
    description: "Need help adding 1 phone number field to an existing form built with Next.js + React Hook Form.",
    requirements: [
      "Must include basic validation (required, valid format)",
      "Tailwind styled",
      "Should be done quickly",
      "If you've worked with React Hook Form before, this will be a super easy task."
    ],
    postedTime: "2 hours ago",
    price: 5,
    priceType: "Fixed-price",
    level: "Entry level - I am looking for freelancers with the lowest rates",
    proposals: 11,
    location: "Worldwide",
    rating: 0,
    spent: "$0",
    tags: ["NextJS", "MongoDB", "React"],
    saved: false
  },
  {
    id: 2,
    title: "React Developer Needed",
    description: "Looking for an experienced React developer to help with an ongoing project.",
    requirements: [
      "Experience with React hooks and context API",
      "Familiarity with state management solutions",
      "Good understanding of responsive design"
    ],
    postedTime: "yesterday",
    price: 50,
    priceType: "Fixed",
    level: "Intermediate",
    proposals: 50,
    location: "United States",
    rating: 4.9,
    spent: "$10K+",
    tags: ["React"],
    saved: false
  },
  {
    id: 3,
    title: "Front-end developer",
    description: "Need a skilled front-end developer for a new project.",
    requirements: [
      "Proficient in HTML, CSS, and JavaScript",
      "Experience with modern frameworks",
      "Good eye for design"
    ],
    postedTime: "yesterday",
    price: 200,
    priceType: "Fixed",
    level: "Intermediate",
    proposals: 50,
    location: "Singapore",
    rating: 4.9,
    spent: "$100K+",
    tags: ["NextJS", "React"],
    saved: false
  },
  {
    id: 4,
    title: "MERN stack expert for an existing project",
    description: "Looking for a MERN stack developer to help with an existing project.",
    requirements: [
      "MongoDB, Express, React, Node.js experience",
      "API integration expertise",
      "Problem-solving skills"
    ],
    postedTime: "yesterday",
    price: 50,
    priceType: "Fixed",
    level: "Expert",
    proposals: 5,
    location: "United States",
    rating: 0,
    spent: "$0",
    tags: ["NodeJS", "React", "API"],
    saved: false
  }
];

export default function JobMarketplacePage() {
  const [jobs, setJobs] = useState<Job[]>(jobsData);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [view, setView] = useState<"grid" | "list">("list");
  const [progress, setProgress] = useState(40);

  const handleSaveJob = (id: number) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, saved: !job.saved } : job
    ));
    
    if (selectedJob && selectedJob.id === id) {
      setSelectedJob({
        ...selectedJob,
        saved: !selectedJob.saved
      });
    }
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const filterOptions = [
    { name: "Best Matches", active: true },
    { name: "Most Recent", active: false },
    { name: "Saved Jobs", active: false }
  ];

  return (
    <div className="min-h-screen bg-blue-100">
      <Navbar />
      
      <main className="pt-24 pb-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Main content area */}
            <div className="flex-1">
              {/* Search bar */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
                  <Input 
                    type="text" 
                    placeholder="Search for jobs" 
                    className="pl-10 h-12 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-900 placeholder:text-blue-300" 
                  />
                </div>
              </motion.div>
              
              {/* Jobs heading with view toggle */}
              <motion.div 
                className="flex justify-between items-center mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-gray-900">Jobs you might like</h2>
                <div className="flex items-center space-x-2">
                  <button 
                    className={`p-2 rounded ${view === 'grid' ? 'bg-blue-100' : 'bg-transparent'}`}
                    onClick={() => setView('grid')}
                  >
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-sm"></div>
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-sm"></div>
                    </div>
                  </button>
                  <button 
                    className={`p-2 rounded ${view === 'list' ? 'bg-blue-100' : 'bg-transparent'}`}
                    onClick={() => setView('list')}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="w-4 h-1 bg-blue-600 rounded-sm"></div>
                      <div className="w-4 h-1 bg-blue-600 rounded-sm"></div>
                      <div className="w-4 h-1 bg-blue-600 rounded-sm"></div>
                    </div>
                  </button>
                </div>
              </motion.div>
              
              {/* Filter tabs */}
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Tabs defaultValue="bestMatches">
                  <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start gap-2 pb-1">
                    <TabsTrigger 
                      value="bestMatches" 
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-full text-sm px-4 py-1 text-gray-800"
                    >
                      Best Matches
                    </TabsTrigger>
                    <TabsTrigger 
                      value="mostRecent" 
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-full text-sm px-4 py-1 text-gray-800"
                    >
                      Most Recent
                    </TabsTrigger>
                    <TabsTrigger 
                      value="savedJobs" 
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-full text-sm px-4 py-1 text-gray-800"
                    >
                      Saved Jobs
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </motion.div>
              
              {/* Tags */}
              <motion.div 
                className="flex flex-wrap gap-2 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {["NextJS", "MongoDB", "React"].map((tag) => (
                  <Badge key={tag} variant="outline" className="rounded-full bg-blue-100 hover:bg-blue-200 text-gray-900 border-blue-200">
                    {tag}
                  </Badge>
                ))}
              </motion.div>
              
              {/* Jobs list */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`space-y-4 ${selectedJob ? 'hidden md:block' : 'block'}`}
              >
                {jobs.map((job) => (
                  <motion.div 
                    key={job.id}
                    variants={itemVariants}
                    className="cursor-pointer"
                    onClick={() => handleSelectJob(job)}
                  >
                    <Card className="border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all bg-white rounded-lg">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-semibold text-gray-900">{job.title}</CardTitle>
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveJob(job.id);
                              }} 
                              className="text-gray-400 hover:text-blue-500"
                            >
                              <Heart className={job.saved ? "fill-blue-500 text-blue-500" : ""} size={18} />
                            </button>
                            <button 
                              onClick={(e) => e.stopPropagation()} 
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-blue-500">Posted {job.postedTime}</p>
                      </CardHeader>
                      <CardContent className="py-2">
                        <p className="text-sm text-gray-800 mb-3">{job.description}</p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {job.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs border-blue-200">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3 text-sm">
                          <div className="flex items-center text-gray-800">
                            <DollarSign size={14} className="mr-1 text-blue-600" />
                            <span className="font-medium">{`${job.priceType}: $${job.price}`}</span>
                          </div>
                          <div className="hidden sm:block text-blue-300">•</div>
                          <div className="flex items-center text-gray-800">
                            <Briefcase size={14} className="mr-1 text-blue-600" />
                            <span>Proposals: {job.proposals}+</span>
                          </div>
                          {job.rating > 0 && (
                            <>
                              <div className="hidden sm:block text-blue-300">•</div>
                              <div className="flex items-center text-gray-800">
                                <Star size={14} className="mr-1 fill-yellow-400 text-yellow-400" />
                                <span>{job.rating} • {job.spent} spent • {job.location}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            {/* Job details sidebar or Selected job view on mobile */}
            {selectedJob && (
              <motion.div 
                className={`md:w-1/2 lg:w-2/5 bg-white md:border-l border-gray-200 p-4 md:p-6 shadow-sm rounded-lg ${selectedJob ? 'block md:block' : 'hidden md:block'}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <div className="md:hidden mb-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedJob(null)}
                    className="text-blue-600 border-blue-300"
                  >
                    &larr; Back to jobs
                  </Button>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedJob.title}</h2>
                <p className="text-sm text-blue-500 mb-4">Posted {selectedJob.postedTime}</p>
                
                <div className="mb-6">
                  <p className="text-gray-900 mb-4">{selectedJob.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {selectedJob.requirements.map((req, index) => (
                      <p key={index} className="text-gray-800 text-sm">{req}</p>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4 border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2">
                    <Globe size={18} className="text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{selectedJob.location}</p>
                      <p className="text-xs text-blue-600">All freelancers can apply</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} className="text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">${selectedJob.price}.00</p>
                      <p className="text-xs text-blue-600">{selectedJob.priceType}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Entry level</p>
                      <p className="text-xs text-blue-600">{selectedJob.level}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Project Type: One-time project</p>
                  </div>
                </div>
                
                <div className="mt-6 flex gap-2">
                  <Button 
                    variant="outline" 
                    className={`flex items-center gap-1 ${selectedJob.saved ? 'text-blue-600 border-blue-300' : 'text-blue-600'}`}
                    onClick={() => handleSaveJob(selectedJob.id)}
                  >
                    <Heart size={16} className={selectedJob.saved ? "fill-blue-500" : ""} />
                    Save job
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                    Apply for {selectedJob.proposals} Connects
                  </Button>
                </div>
              </motion.div>
            )}
            
            {/* Right sidebar for profile info */}
            <motion.div 
              className="md:w-1/4 lg:w-1/5 space-y-4 hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-900 font-medium">Welcome back, Anupam</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                      <span>✓</span>
                    </div>
                    <p className="text-gray-800">Tokens: <span className="text-blue-600 font-medium">102</span></p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <h3 className="flex items-center gap-1 font-medium text-gray-900">
                      <ExternalLink size={16} className="text-blue-600" />
                      Promote with ads
                    </h3>
                    <ChevronDown size={16} className="text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-800">Availability badge</p>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-blue-600">Off</span>
                        <button className="text-blue-400 hover:text-blue-600">
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-800">Boost your profile</p>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-blue-600">Off</span>
                        <button className="text-blue-400 hover:text-blue-600">
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <h3 className="flex items-center gap-1 font-medium text-gray-900">
                      <Briefcase size={16} className="text-blue-600" />
                      Proposals and offers
                    </h3>
                    <ChevronDown size={16} className="text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-800">Contract offers</p>
                      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-600">0</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-800">Invites to apply</p>
                      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-600">0</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-800">Proposals</p>
                      <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-600">0</Badge>
                    </div>
                  </div>
                  <Button variant="link" className="text-xs text-blue-600 p-0 h-auto mt-1">
                    View all
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-white border border-gray-200 shadow-sm rounded-lg">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <h3 className="flex items-center gap-1 font-medium text-gray-900">
                      <User size={16} className="text-blue-600" />
                      Your profile
                    </h3>
                    <ChevronDown size={16} className="text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-800">Profile Visibility</p>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-blue-600">Private</span>
                        <button className="text-blue-400 hover:text-blue-600">
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <Button variant="link" className="text-xs text-blue-600 p-0 h-auto">
                        Complete your profile
                      </Button>
                      <Progress value={progress} className="h-2 mt-1 bg-blue-100" indicatorClassName="bg-blue-600" />
                      <div className="flex justify-end">
                        <span className="text-xs text-blue-600">{progress}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}