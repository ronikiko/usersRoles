import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import { Permission } from '../../types';

export type Page = 'Dashboard' | 'Users' | 'Roles' | 'Audit Log';

// Fix: Moved SVG icon components before their usage in navItems to resolve block-scoped variable errors.
// SVG Icons
const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 11a4 4 0 110-5.292" /></svg>
);
const ShieldIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944A12.02 12.02 0 0012 22a12.02 12.02 0 009-1.056 2.5 2.5 0 00-1.382-4.432z" /></svg>
);
const ClipboardIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
);
const LogoutIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
);

const navItems: { name: Page; icon: JSX.Element; permission: Permission }[] = [
    { name: 'Dashboard', icon: <HomeIcon />, permission: Permission.VIEW_DASHBOARD_STATS },
    { name: 'Users', icon: <UsersIcon />, permission: Permission.VIEW_USERS },
    { name: 'Roles', icon: <ShieldIcon />, permission: Permission.VIEW_ROLES },
    { name: 'Audit Log', icon: <ClipboardIcon />, permission: Permission.VIEW_AUDIT_LOGS },
];

interface SidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
    const { logout } = useAuth();
    const { hasPermission } = useAuthorization();

    return (
        <div className="flex flex-col w-64 bg-gray-800 text-gray-100">
            <div className="flex items-center justify-center h-20 border-b border-gray-700">
                 <svg className="w-10 h-10 text-primary-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                    <path d="M2 17L12 22L22 17" />
                    <path d="M2 12L12 17L22 12" />
                </svg>
                <span className="ml-2 text-xl font-bold">Stellar</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                {navItems.map((item) => (
                    hasPermission(item.permission) && (
                        <a
                            key={item.name}
                            href="#"
                            onClick={(e) => { e.preventDefault(); setActivePage(item.name); }}
                            className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                                activePage === item.name
                                    ? 'bg-gray-700 text-white'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            {item.icon}
                            <span className="ml-3">{item.name}</span>
                        </a>
                    )
                ))}
            </nav>
            <div className="px-2 py-4 border-t border-gray-700">
                 <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); logout(); }}
                    className="flex items-center px-4 py-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white"
                >
                    <LogoutIcon />
                    <span className="ml-3">Logout</span>
                </a>
            </div>
        </div>
    );
};

export default Sidebar;