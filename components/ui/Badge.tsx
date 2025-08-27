
import React from 'react';
import type { Role } from '../../types';

interface BadgeProps {
  role?: Role;
  status?: 'Active' | 'Inactive';
}

const Badge: React.FC<BadgeProps> = ({ role, status }) => {
  const roleColors: Record<string, string> = {
    Admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Manager: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    User: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Support: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Analyst: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    Auditor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };

  const statusColors = {
    Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  
  const defaultColor = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';

  const classes = role ? (roleColors[role] || defaultColor) : (status ? statusColors[status] : '');
  const text = role || status;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {text}
    </span>
  );
};

export default Badge;