"use client";

import LayoutPage from "../Layout";
import AppBar from "@/components/layout/AppBar";
import HealthProgramCreator from "@/components/ui/dashboard/HealthProgramCreator";

export default function HealthProgramsPage() {
  return (
    <LayoutPage>
      <div className="flex flex-col w-[86vw] mx-auto flex-1 overflow-hidden">
        <AppBar />
        <div className="container py-8">
          <HealthProgramCreator />
        </div>
      </div>
    </LayoutPage>
  );
}
