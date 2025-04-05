"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ChevronRight, Sparkles, User, Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function RecommendationPage() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const fetchRecommendations = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a user name to search");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: searchTerm,
          top_n: 5
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setRecommendations(data);
      setSelectedUser(searchTerm);
      toast.success(`Found ${data.length} recommendations`);
    } catch (error) {
      toast.error("Failed to fetch recommendations");
      console.error('Error fetching recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 w-full bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-100 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-900">
      <Toaster position="top-right" />
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Skill Recommendations
              </h1>
              <p className="text-muted-foreground mt-2">
                Find users with complementary skills to collaborate with
              </p>
            </div>
          </motion.div>

          {/* Search Section */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-2xl p-6 shadow-lg overflow-hidden border border-white/20 dark:border-slate-800/30"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter your username (e.g., UserA, UserB...)"
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchRecommendations()}
                />
              </div>
              <Button
                onClick={fetchRecommendations}
                disabled={isLoading}
                className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Find Matches
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Results Section */}
          {selectedUser && (
            <motion.div
              variants={itemVariants}
              className="backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-2xl p-6 shadow-lg overflow-hidden border border-white/20 dark:border-slate-800/30"
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-100">
                Recommendations for <span className="text-indigo-600 dark:text-indigo-400">{selectedUser}</span>
              </h2>
              
              {recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recommendations found for this user</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={rec.user}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
                                {rec.user.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{rec.user}</CardTitle>
                              <CardDescription>
                                Match score: {(rec.similarity * 100).toFixed(1)}%
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground">Offers skills:</h4>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {rec.provided_skills.split(' ').map((skill: string) => (
                                  <Badge 
                                    key={skill} 
                                    variant="outline"
                                    className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => toast.success(`Connection request sent to ${rec.user}`)}
                          >
                            Connect <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* How It Works Section */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-md bg-white/30 dark:bg-slate-900/30 border border-white/20 dark:border-slate-800/30">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-indigo-500" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 p-4 rounded-full mb-3">
                      <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-medium mb-1">Enter Your Username</h3>
                    <p className="text-sm text-muted-foreground">
                      Start by entering your username to find compatible collaborators
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 p-4 rounded-full mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                        <path d="M5 3v4"></path>
                        <path d="M19 17v4"></path>
                        <path d="M3 5h4"></path>
                        <path d="M17 19h4"></path>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">AI Matching</h3>
                    <p className="text-sm text-muted-foreground">
                      Our algorithm finds users with skills that complement yours
                    </p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 p-4 rounded-full mb-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-blue-600 dark:text-blue-400"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">Connect & Collaborate</h3>
                    <p className="text-sm text-muted-foreground">
                      Reach out to your matches and start working together
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}