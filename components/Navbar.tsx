import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Settings,
  HelpCircle,
  LogOut,
  UserPlus,
  LogIn,
  CircleDollarSign // Using CircleDollarSign as replacement for Exchange
} from "lucide-react";

interface NavbarProps {
  productName: string;
  productIcon?: React.ReactNode;
  routes: {
    name: string;
    path: string;
  }[];
  userLoggedIn?: boolean;
  userAvatar?: string;
  userInitials?: string;
}

export const Navbar = ({
  productName,
  productIcon = <CircleDollarSign className="h-6 w-6" />,
  routes,
  userLoggedIn = false,
  userAvatar = "",
  userInitials = "A"
}: NavbarProps) => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-200 ${
        scrolled ? "bg-white/90 shadow-md backdrop-blur-sm dark:bg-gray-900/90" : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-primary"
            >
              {productIcon}
            </motion.div>
            <motion.span
              className="text-xl font-bold text-primary"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              {productName}
            </motion.span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {routes.map((route, index) => (
              <Link href={route.path} key={route.path}>
                <motion.div
                  className={`relative px-3 py-2 text-sm rounded-md transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
                    pathname === route.path
                      ? "text-primary font-medium"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {route.name}
                  {pathname === route.path && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {userLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" size="icon">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={userAvatar} alt="User avatar" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button size="sm" className="hidden sm:flex">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
              <Button variant="ghost" size="icon" className="sm:hidden">
                <LogIn className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};