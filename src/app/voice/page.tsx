import Navbar from "@/components/Navbar";
import ProPlanRequired from "@/components/voice/ProPlanRequired";
import { auth } from "@clerk/nextjs/server";
import React from "react";

async function VoicePage() {
  const { has } = await auth();
  const hasProPlan = has({ plan: "ai_basic" }) || has({ plan: "ai_pro" });
  if (!hasProPlan) return <ProPlanRequired />;
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
    </div>
  );
}

export default VoicePage;
