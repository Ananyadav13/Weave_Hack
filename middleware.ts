import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';

// Define ALL public routes (not just sign-in)
const isPublicRoute = createRouteMatcher([
  "/", // Homepage
  "/features(.*)", // Features page
  "/pricing(.*)", // Pricing page
  "/about(.*)", // About page
  "/sign-in(.*)", // Sign-in routes
  "/sign-up(.*)", // Sign-up routes
  "/marketplace"
]);

// Routes that are exempt from onboarding redirect
const bypassOnboardingCheck = createRouteMatcher([
  "/onboarding(.*)", // Onboarding routes themselves
  "/api/onboarding(.*)", // Onboarding API routes
  "/sign-out(.*)" // Sign-out routes
]);

export default clerkMiddleware(async (auth, req) => {
  // Check if the route is public
  if (!isPublicRoute(req)) {
    // Protect non-public routes
    await auth.protect();
    
    // After successful authentication, check if onboarding is complete
    const user = auth.user;
    
    // Skip onboarding check for onboarding-related routes
    if (!bypassOnboardingCheck(req)) {
      // Check if user has completed onboarding (stored in publicMetadata)
      const onboardingComplete = user?.publicMetadata?.onboardingComplete;
      
      // If onboarding is not complete, redirect to onboarding
      if (user && !onboardingComplete) {
        const onboardingUrl = new URL('/onboarding', req.url);
        return NextResponse.redirect(onboardingUrl);
      }
    }
  }
  
  // If user is signed in but accessing the sign-in or sign-up page, redirect to /
  if (auth.userId && (req.nextUrl.pathname === '/sign-in' || req.nextUrl.pathname === '/sign-up')) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};