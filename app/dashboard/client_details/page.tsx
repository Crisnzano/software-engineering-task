"use client"

import LayoutPage from "../Layout";
import AppBar from "@/components/layout/AppBar";

import ClientRegistry from "@/components/ui/dashboard/ClientRegistry";

export default function ClientsPage() {
  return (
    <LayoutPage>
      <div className="flex flex-col w-[86vw] mx-auto flex-1 overflow-hidden">
        <AppBar />
        <div className="container py-8">
          <ClientRegistry/>
        </div>
      </div>
    </LayoutPage>
  );
}
