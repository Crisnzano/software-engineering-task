"use client";

import DashboardHeader from "../dashboard_header/page";
import LayoutPage from "../Layout";
import AppBar from "@/components/layout/AppBar";
import ClientRegistrationForm from "@/components/ui/dashboard/ClientRegistrationForm";

export default function DashboardPage() {
  return (
    <LayoutPage>
      <div className="flex flex-col w-[86vw] mx-auto flex-1 overflow-hidden">
        {/* App Bar */}
        <AppBar />

        {/* Main content container */}
        <div className="container py-8">
          <ClientRegistrationForm />
        </div>
      </div>
    </LayoutPage>
  );
}
