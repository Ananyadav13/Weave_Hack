"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function PortalPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [workSubmitted, setWorkSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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

  const handleReviewSubmit = () => {
    if (!review.trim()) {
      alert("Review is compulsory.");
      return;
    }
    setSubmitted(true);
  };

  const handleProjectSubmit = () => {
    setWorkSubmitted(true);
    alert("Project has been submitted!");
  };

  return (
    <div className="min-h-screen pt-20 w-full bg-gradient-to-br from-sky-50 via-indigo-50 to-blue-100 dark:from-blue-950 dark:via-indigo-950 dark:to-slate-900">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Work Showcase Portal
          </h1>
          {mounted && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 sm:mt-0 rounded-full h-10 w-10 p-0 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 transition-all"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <span className="sr-only">Toggle theme</span>
              {theme === "dark" ? (
                <SunIcon />
              ) : (
                <MoonIcon />
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
          {/* Submission + Client Info Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col lg:flex-row gap-6 backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-800/30"
          >
            {/* Left: Submit Button & Work Display */}
            <div className="flex-1 space-y-4">
              <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100">
                Project Submission
              </h2>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Submit your project when it’s ready for review.
              </p>
              <Button
  onClick={handleProjectSubmit}
  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all"
>
  Submit Project
</Button>

              {workSubmitted && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100">
                      Project Title
                    </h3>
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                    You’ve submitted your work. Here’s a summary of your project
                    and its goals.
                  </p>
                </div>
              )}
            </div>

            {/* Right: Client Details */}
            <div className="flex-1 space-y-4 border-t lg:border-t-0 lg:border-l border-blue-200/30 dark:border-slate-800/30 pt-6 lg:pt-0 lg:pl-6">
              <h2 className="text-2xl font-semibold text-blue-900 dark:text-blue-100">
                Client Details
              </h2>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li><strong>Name:</strong> Relief Coordination Office</li>
                <li><strong>Email:</strong> contact@reliefco.org</li>
                <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                <li><strong>Location:</strong> Washington, D.C., USA</li>
                <li><strong>Project Deadline:</strong> April 15, 2025</li>
              </ul>
            </div>
          </motion.div>

          <Separator className="bg-gradient-to-r from-transparent via-blue-200/30 dark:via-blue-700/30 to-transparent" />

          {/* Review Section */}
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-md bg-white/30 dark:bg-slate-900/30 rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-800/30"
          >
            <h2 className="text-2xl font-semibold mb-4 text-blue-900 dark:text-blue-100">
              Review Section (Compulsory)
            </h2>
            {submitted ? (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg shadow">
                <p className="text-blue-900 dark:text-blue-100 font-medium">
                  Thank you for your review!
                </p>
                <p className="mt-2 text-blue-800 dark:text-blue-200">
                  {review}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Enter your review here..."
                  className="w-full p-4 rounded-lg border border-blue-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-100 placeholder-blue-500 dark:placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  rows={5}
                />
                <Button
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-full px-8 py-3 shadow-lg hover:shadow-xl transition-all"
                  onClick={handleReviewSubmit}
                >
                  Submit Review
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-yellow-400"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-indigo-700"
    viewBox="0 0 24 24"
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);