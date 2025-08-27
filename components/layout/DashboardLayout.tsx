import React, { ReactNode } from 'react';
import Sidebar, { Page } from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activePage, setActivePage }) => {
  return (
    <div className="flex h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;