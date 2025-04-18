import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


const ClerkLoadingComponent = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin"></div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Loading your account...
        </p>
      </div>
    </div>
  );
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkLoading>
      <ClerkLoadingComponent />
    </ClerkLoading>
    <Navbar/>
        {children}
        <Toaster position="top-right" richColors />
      </body>

    </html>
    </ThemeProvider>
    </ClerkProvider>
  );
}
