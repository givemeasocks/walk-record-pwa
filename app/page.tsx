"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const ONBOARDING_KEY = "walk_onboarding_done";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function decide() {
      const onboardingDone = localStorage.getItem(ONBOARDING_KEY) === "1";
      if (!onboardingDone) {
        if (!cancelled) router.replace("/onboarding");
        return;
      }
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      router.replace(user ? "/feed" : "/login");
    }

    const timer = setTimeout(decide, 900);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-screen">
      <div className="w-[84px] h-[84px] rounded-full border-2 border-accent flex items-center justify-center">
        <div className="w-11 h-11 rounded-full bg-accent-soft flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
        </div>
      </div>
      <div className="font-serif text-3xl font-semibold text-foreground tracking-wide">
        탐험기록
      </div>
      <div className="text-sm text-muted">
        오늘 걸으며 본 장면을 감성으로 남기다
      </div>
    </div>
  );
}
