

import React, { useState } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import type { Page } from '../layout/Sidebar';
import UserList from '../users/UserList';
import RoleList from '../roles/RoleList';
import AuditLogList from '../audit/AuditLogList';
import DashboardHome from './DashboardHome';
import SettingsPage from '../settings/SettingsPage';
import { useAuthorization } from '../../hooks/useAuthorization';
import { Permission } from '../../types';

const PageContent: React.FC<{ page: Page }> = ({ page }) => {
  switch (page) {
    case 'Dashboard':
      return <DashboardHome />;
    case 'Users':
      return <UserList />;
    case 'Roles':
      return <RoleList />;
    case 'Audit Log':
      return <AuditLogList />;
    case 'Settings':
      return <SettingsPage />;
    default:
      return <DashboardHome />;
  }
};

const Dashboard: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const { hasPermission } = useAuthorization();

  const getInitialPage = (): Page => {
      if(hasPermission(Permission.VIEW_DASHBOARD_STATS)) return 'Dashboard';
      if(hasPermission(Permission.VIEW_USERS)) return 'Users';
      if(hasPermission(Permission.VIEW_ROLES)) return 'Roles';
      if(hasPermission(Permission.VIEW_AUDIT_LOGS)) return 'Audit Log';
      return 'Dashboard';
  }

  useState(() => {
      setActivePage(getInitialPage());
  });

  return (
    <DashboardLayout activePage={activePage} setActivePage={setActivePage}>
      <PageContent page={activePage} />
    </DashboardLayout>
  );
};

export default Dashboard;