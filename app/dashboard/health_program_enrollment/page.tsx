"use client";

import LayoutPage from "../Layout";
import AppBar from "@/components/layout/AppBar";

import ClientProgramEnrollment from "@/components/ui/dashboard/ClientProgramEnrollment";

export default function EnrollClientPage() {
  return (
    <LayoutPage>
      <div className="flex flex-col w-[86vw] mx-auto flex-1 overflow-hidden">
        <AppBar />
        <div className="container py-8">
          <ClientProgramEnrollment />
        </div>
      </div>
    </LayoutPage>
  );
}
