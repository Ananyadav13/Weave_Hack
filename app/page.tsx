"use client";

import { motion } from "framer-motion";
import { ChevronRight, Search, User, Shield, BadgeCheck, MessageSquare } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const categories = [
    { 
      name: "Development & IT", 
      rating: "4.85/5", 
      skills: "1853 skills", 
      color: "from-violet-500 to-indigo-500" 
    },
    { 
      name: "AI Services", 
      rating: "4.8/5", 
      skills: "294 skills", 
      color: "from-indigo-500 to-blue-500" 
    },
    { 
      name: "Design & Creative", 
      rating: "4.91/5", 
      skills: "968 skills", 
      color: "from-blue-500 to-purple-500" 
    },
    { 
      name: "Sales & Marketing", 
      rating: "4.77/5", 
      skills: "392 skills", 
      color: "from-purple-500 to-fuchsia-500" 
    },
  ];

  const stats = [
    { number: "98%", label: "Client Satisfaction" },
    { number: "5M+", label: "Projects Completed" },
    { number: "150k+", label: "Daily Connections" }
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50 dark:from-indigo-950 dark:via-purple-950 dark:to-violet-950">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[800px] h-[800px] -top-96 -left-96 bg-gradient-to-r from-violet-200 to-indigo-200 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-float" />
        <div className="absolute w-[600px] h-[600px] -bottom-64 -right-64 bg-gradient-to-r from-purple-200 to-fuchsia-200 rounded-full opacity-20 dark:opacity-10 blur-3xl animate-float-delayed" />
      </div>

      {/* Navigation */}
      

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-12 md:py-20 relative"
      >
        <div className="max-w-4xl mx-auto mb-16 relative pt-22">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
            Transform Your Work
            <span className="block mt-2 md:mt-4 text-2xl md:text-3xl text-violet-800 dark:text-violet-200">
              With World-Class Talent
            </span>
          </h1>
          
          <motion.div 
            className="max-w-2xl mx-auto relative mt-10"
            whileHover={{ scale: 1.02 }}
          >
            <Input 
              placeholder="What skill are you looking for?"
              className="rounded-full py-6 px-6 text-base shadow-lg border-violet-200 bg-white/80 dark:bg-violet-900/20 dark:border-violet-700 backdrop-blur-md"
            />
            <Button className="absolute right-2 top-2 rounded-full px-6 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white">
              <Search className="w-5 h-5 mr-2" /> Search
            </Button>
          </motion.div>

          <div className="flex justify-center mt-8 space-x-2 items-center text-violet-700 dark:text-violet-300 text-sm">
            <span>Popular:</span>
            {["Web Development", "UI Design", "AI", "Marketing"].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 rounded-full text-xs hover:bg-violet-200 dark:hover:bg-violet-800/40 cursor-pointer transition-colors">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="relative mt-12"
        >
          <div className="aspect-video max-w-5xl mx-auto relative rounded-3xl shadow-xl overflow-hidden border-4 border-white dark:border-violet-900">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 mix-blend-overlay z-10 rounded-3xl"></div>
            <Image
              src="/api/placeholder/1200/675"
              alt="Team Collaboration"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white dark:bg-violet-900 px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <BadgeCheck className="text-violet-600 dark:text-violet-400 w-5 h-5" />
            <span className="font-medium text-violet-900 dark:text-violet-100">Trusted by 5M+ businesses</span>
          </div>
        </motion.div>
      </motion.section>

      {/* Categories Grid */}
      <motion.div 
        className="container mx-auto px-4 py-16 md:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-violet-900 dark:text-violet-100">
          Explore Professional Categories
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.name}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-full"
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/90 dark:bg-violet-900/20 backdrop-blur-sm group h-full rounded-2xl overflow-hidden">
                <div className="h-3 w-full bg-gradient-to-r mb-6 -mx-6 -mt-6 ${category.color}"></div>
                <div className="w-12 h-12 mb-4 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-white">
                  <ChevronRight className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-violet-900 dark:text-violet-100">{category.name}</h3>
                <div className="flex items-center gap-2 text-sm text-violet-700 dark:text-violet-300">
                  <span className="text-amber-500">★ {category.rating}</span>
                  <span>•</span>
                  <span>{category.skills}</span>
                </div>
                <Button variant="ghost" className="mt-4 text-violet-600 dark:text-violet-400 p-0 hover:bg-transparent hover:text-violet-700 dark:hover:text-violet-300 group-hover:underline">
                  Browse Category <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Value Proposition Section */}
      <motion.section 
        className="container mx-auto px-4 py-16 md:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 md:p-16 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="absolute inset-0 h-full w-full" width="100%" height="100%" viewBox="0 0 800 800">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="space-y-6 text-center md:text-left flex-1">
              <h2 className="text-3xl md:text-4xl font-bold">
                Work Different,<br/>Work Better
              </h2>
              <p className="text-lg opacity-90 max-w-md">
                Join millions collaborating across boundaries to achieve extraordinary results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button className="rounded-full px-8 py-6 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20">
                  Find Talent
                </Button>
                <Button className="rounded-full px-8 py-6 bg-white text-violet-900 hover:bg-white/90">
                  Become a Pro
                </Button>
              </div>
            </div>
            
            <div className="flex-1 relative aspect-square w-full max-w-md">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-3xl"></div>
              <Image
                src="/api/placeholder/500/500"
                alt="Work Illustration"
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.div 
        className="container mx-auto px-4 py-16 md:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {stats.map((stat) => (
            <motion.div 
              key={stat.label} 
              whileHover={{ y: -5 }}
              className="p-8 bg-white/90 dark:bg-violet-900/20 backdrop-blur-sm rounded-2xl shadow-sm border border-violet-100 dark:border-violet-800 text-center"
            >
              <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 mb-4">
                {stat.number}
              </div>
              <div className="text-violet-700 dark:text-violet-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Testimonial Section */}
      <motion.div 
        className="container mx-auto px-4 py-16 md:py-24 mb-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto bg-white/90 dark:bg-violet-900/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-violet-100 dark:border-violet-800">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 p-1">
              <div className="rounded-full overflow-hidden h-full w-full relative">
                <Image
                  src="/api/placeholder/128/128"
                  alt="Happy User"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="flex mb-4 justify-center md:justify-start">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-xl font-medium mb-4 text-violet-900 dark:text-violet-100">
                "This platform transformed how we hire talent. The quality and speed are unmatched!"
              </p>
              <p className="text-violet-700 dark:text-violet-300">
                Sarah Johnson, CTO at TechInnovate
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="container mx-auto px-4 py-16 md:py-24"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-violet-900 dark:text-violet-100">
            Ready to Transform Your Work?
          </h2>
          <p className="text-lg mb-8 text-violet-700 dark:text-violet-300 max-w-2xl mx-auto">
            Join millions of professionals who are already using our platform to connect, collaborate, and succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="rounded-full px-8 py-6 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-lg">
              Get Started for Free
            </Button>
            <Button variant="outline" className="rounded-full px-8 py-6 border-violet-300 text-violet-700 dark:text-violet-300 dark:border-violet-700 text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-violet-50 dark:bg-violet-950 mt-16 py-12 border-t border-violet-100 dark:border-violet-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-8 md:mb-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">W</div>
              <span className="ml-2 font-semibold text-lg text-violet-900 dark:text-violet-100">Weave</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-violet-700 dark:text-violet-300">
              <a href="#" className="hover:text-violet-900 dark:hover:text-violet-100">About Us</a>
              <a href="#" className="hover:text-violet-900 dark:hover:text-violet-100">Terms of Service</a>
              <a href="#" className="hover:text-violet-900 dark:hover:text-violet-100">Privacy Policy</a>
              <a href="#" className="hover:text-violet-900 dark:hover:text-violet-100">Contact Us</a>
              <a href="#" className="hover:text-violet-900 dark:hover:text-violet-100">Help Center</a>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-violet-600 dark:text-violet-400">
            © 2025 Weave. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}