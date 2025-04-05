"use client";

import { motion } from "framer-motion";
import { ChevronRight, Search, Rocket, BadgeCheck, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  
  const categories = [
    { name: "Development & IT", rating: "4.85/5", skills: "1853 skills" },
    { name: "AI Services", rating: "4.8/5", skills: "294 skills" },
    { name: "Design & Creative", rating: "4.91/5", skills: "968 skills" },
    { name: "Sales & Marketing", rating: "4.77/5", skills: "392 skills" },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-100 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Upwork
          </h1>
          
          <div className="hidden md:flex gap-6 items-center">
            {["Find talent", "Find work", "Why Upwork", "Enterprise"].map((item) => (
              <Button key={item} variant="ghost" className="text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800">
                {item}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-full">
              Log In
            </Button>
            <Button className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              Sign Up
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-20 text-center"
      >
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
          We connect people to bring projects to life
        </h1>
        
        <motion.div 
          className="max-w-2xl mx-auto relative"
          whileHover={{ scale: 1.02 }}
        >
          <Input 
            placeholder="Ask AI anything..."
            className="rounded-full py-7 px-6 text-lg shadow-lg"
          />
          <Button className="absolute right-2 top-2 rounded-full px-8 py-5 bg-gradient-to-r from-blue-600 to-indigo-600">
            <Search className="mr-2" /> Search
          </Button>
        </motion.div>
      </motion.section>

      {/* Categories Grid */}
      <motion.div 
        className="container mx-auto px-4 py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-3">{category.name}</h3>
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="text-amber-500">★ {category.rating}</span>
                <span>•</span>
                <span>{category.skills}</span>
              </div>
              <ChevronRight className="mt-4 text-blue-600" />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Value Proposition Section */}
      <motion.section 
        className="container mx-auto px-4 py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <h2 className="text-3xl font-bold text-center mb-16">Up your work game, it’s easy</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Rocket />, title: "No cost to join", text: "Register and browse talent profiles, explore projects" },
            { icon: <BadgeCheck />, title: "Post a job and hire top talent", text: "Finding talent doesn't have to be a chore" },
            { icon: <Shield />, title: "Work with the best", text: "Affordable solutions with low transaction rates" },
          ].map((item, index) => (
            <motion.div 
              key={item.title}
              className="p-6 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md rounded-xl border border-slate-200/50 dark:border-slate-800/50"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/50 w-fit p-4 rounded-full mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Trusted By Section */}
      <motion.div 
        className="container mx-auto px-4 py-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        <p className="text-slate-500 dark:text-slate-400 mb-6">TRUSTED BY</p>
        <div className="flex justify-center gap-12 flex-wrap">
          {["Microsoft", "Airbnb", "Google", "Shopify"].map((company) => (
            <span 
              key={company}
              className="text-xl font-medium text-slate-700 dark:text-slate-300 opacity-80 hover:opacity-100 transition-opacity"
            >
              {company}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}