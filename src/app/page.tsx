"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IntroExperience } from "@/intro/IntroExperience";
import { useStoryFlags } from "@/flags/store";

export default function HomePage() {
  const entered = useStoryFlags((s) => s.entered);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !entered) return;
    router.replace("/hub");
  }, [hydrated, entered, router]);

  if (!hydrated) {
    return <main className="page-loading">Unfolding ink…</main>;
  }

  if (entered) {
    return <main className="page-loading">Opening atlas…</main>;
  }

  return <IntroExperience />;
}
