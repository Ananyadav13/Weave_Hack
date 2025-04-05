"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { title: "Dashboard", href: "/" },
    { title: "Projects", href: "#" },
    { title: "Marketplace", href: "/marketplace" },
    { title: "Messages", href: "#" },
  ];

  return (
    <motion.header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-white/80 backdrop-blur-sm py-4"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xl font-bold text-purple-600">Weave</span>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav 
          className="hidden md:flex items-center space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {navLinks.map((link, index) => (
            <motion.a
              key={link.title}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 rounded-md hover:bg-purple-50 transition-colors"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              {link.title}
            </motion.a>
          ))}
        </motion.nav>

        {/* Right menu - desktop */}
        <div className="hidden md:flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Search className="h-5 w-5 text-gray-500 hover:text-purple-600 cursor-pointer" />
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Bell className="h-5 w-5 text-gray-500 hover:text-purple-600 cursor-pointer" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
            </span>
          </motion.div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-600"
              >
                <User className="h-4 w-4" />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden bg-white"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 pt-2 pb-3 space-y-1 border-t">
            {navLinks.map((link) => (
              <motion.a
                key={link.title}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md"
                whileHover={{ x: 5 }}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {link.title}
              </motion.a>
            ))}
            <div className="flex items-center justify-between pt-4 pb-2">
              <Search className="h-5 w-5 text-gray-500" />
              <Bell className="h-5 w-5 text-gray-500" />
              <User className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}