'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import SkillsForm from '@/components/onboarding/SkillsForm';

export default function OnboardingPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push('/sign-in'); // Clerk's default sign-in route
      return;
    }

    // If user has already completed onboarding (example check using public metadata or user.name)
    if (user.publicMetadata?.onboarded || user.fullName) {
      router.push('/');
      return;
    }

    setLoading(false);
  }, [isLoaded, isSignedIn, user, router]);

  if (loading) {
    return <div>Loading...</div>; // optional loading UI
  }

  return <
    SkillsForm />;
}
