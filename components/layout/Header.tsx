import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Badge from '../ui/Badge';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-end h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
          <div className="ml-4">
              {user && <Badge role={user.role} />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;