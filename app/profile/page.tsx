"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, User, Image, Trophy } from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; 


export default function ProfilePage() {
 // Import useRouter
  
 const router = useRouter();
  const { user } = useUser(); // Fetch user data from Clerk
  const [completionPercentage] = useState<number>(33);
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  return (
    <div className="min-h-screen pt-20 w-full bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-100 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-900">
      <div className="container max-w-3xl mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Your profile
          </h1>
          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-10 w-10 p-0 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 transition-all"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <span className="sr-only">Toggle theme</span>
              {theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-yellow-400"
                >
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-indigo-700"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </svg>
              )}
            </Button>
          )}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div
            variants={itemVariants}
            className="relative backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-2xl p-6 shadow-lg overflow-hidden border border-white/20 dark:border-slate-800/30"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 z-0"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full blur-sm opacity-50 animate-pulse"></div>
                  <Avatar className="h-20 w-20 border-2 border-white dark:border-slate-800 relative">
                    <AvatarImage
                      src={user?.imageUrl || "/avatar-placeholder.jpg"}
                      alt={user?.fullName || "Profile"}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white">
                      {user?.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {user?.fullName || "User Name"}
                  </h2>
                  <div className="flex items-center mt-1 text-blue-700 dark:text-blue-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span className="text-sm">
                      {user?.primaryAddress?.city || "Location not set"}
                    </span>
                  </div>
                </div>
              </div>

             
            </div>
          </motion.div>
          
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-2xl shadow-lg overflow-hidden border border-white/20 dark:border-slate-800/30"
          >
            {/* Become a Pro */}

            
          
            
            <Separator className="bg-gradient-to-r from-transparent via-blue-200/30 dark:via-blue-700/30 to-transparent" />
            
            {/* Create a profile */}
            <motion.div 
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="p-5 relative cursor-pointer group"
              onClick={() => router.push("/profile-setup")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-indigo-500/5 group-hover:to-purple-500/5 dark:group-hover:from-blue-500/10 dark:group-hover:via-indigo-500/10 dark:group-hover:to-purple-500/10 transition-all duration-300 z-0"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-indigo-400 to-purple-500 p-3 rounded-full text-white shadow-md">
                    <Image className="h-5 w-5"/>
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-100">Edit your profile</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-300">Showcase your skills, portfolio, and more</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-blue-400 dark:text-blue-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors" />
              </div>
              
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          </motion.div>

           {/* Badges */}
           <motion.div 
            variants={itemVariants}
            className="backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-800/30"
          >
            <h3 className="text-xl font-semibold mb-6 text-blue-900 dark:text-blue-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500 dark:text-blue-400"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
              Badges
            </h3>
            
            <div className="flex items-center gap-4 bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-xl">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-3 rounded-full text-white shadow-md">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-blue-800 dark:text-blue-200">You have 0 badges</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Complete your profile to earn your first badge</p>
              </div>
            </div>
          </motion.div>
          
          {/* Trust and verification */}
          <motion.div 
            variants={itemVariants}
            className="backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-800/30"
          >
            <h3 className="text-xl font-semibold mb-6 text-blue-900 dark:text-blue-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500 dark:text-blue-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path><path d="m6 12 4 4 8-8"></path></svg>
              Trust and verification
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-blue-100/50 dark:border-blue-800/50">
                <p className="text-blue-800 dark:text-blue-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500 dark:text-blue-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  Phone number
                </p>
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-1 rounded-full shadow-sm">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-blue-100/50 dark:border-blue-800/50">
                <p className="text-blue-800 dark:text-blue-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500 dark:text-blue-400"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                  Email address
                </p>
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-1 rounded-full shadow-sm">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-blue-100/50 dark:border-blue-800/50">
                <p className="text-blue-800 dark:text-blue-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500 dark:text-blue-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Government ID
                </p>
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-1 rounded-full shadow-sm">
                  <Check className="h-4 w-4 text-white" />
                </div>
              </div>
              
              <div className="pt-6">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500 dark:text-blue-400"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                    {completionPercentage}% complete
                  </p>
                </div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  <Progress 
                    value={completionPercentage} 
                    className="h-2 bg-blue-100/50 dark:bg-blue-900/50 rounded-full overflow-hidden"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
          
         
          
          {/* Save button */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-end pt-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                Save
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}