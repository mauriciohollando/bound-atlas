"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AtlasHub } from "@/hub/AtlasHub";
import { useStoryFlags } from "@/flags/store";

export default function HubPage() {
  const entered = useStoryFlags((s) => s.entered);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !entered) router.replace("/");
  }, [hydrated, entered, router]);

  if (!hydrated || !entered) {
    return <main className="page-loading">Unfolding ink…</main>;
  }

  return (
    <main>
      <AtlasHub />
    </main>
  );
}
