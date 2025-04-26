import { ReactNode } from 'react';
import { Sidebar } from '@/components/ui/dashboard/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const LayoutPage = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 bg-gray-100 overflow-y-auto p-4">
        {children}
      </div>
    </div>
  );
};

export default LayoutPage;
