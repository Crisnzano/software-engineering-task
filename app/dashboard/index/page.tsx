"use client";

import DashboardHeader from "../dashboard_header/page";
import LayoutPage from "../Layout";
import AppBar from "@/components/layout/AppBar";
import AddClientForm from "../client_search/page";

export default function DashboardPage() {
  return (
    <LayoutPage>
      <div className="flex flex-col w-[86vw] mx-auto flex-1 overflow-hidden">
        {/* App Bar */}
        <AppBar />

        {/* Main content container */}
        <div className="flex flex-1 w-full p-6 bg-gray-400">
          <div className="w-full bg-gray-400 rounded-lg shadow-lg p-6 overflow-auto">
            <DashboardHeader />
            <main className="h-full">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column: Member Search */}
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold mb-4">Register Clients</h2>
                  <AddClientForm />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </LayoutPage>
  );
}
