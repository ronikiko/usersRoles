
import { useAuth } from '../contexts/AuthContext';
import { Role, Permission } from '../types';
import { rolePermissions } from '../services/mockApi';

export const useAuthorization = () => {
  const { user } = useAuth();

  if (!user) {
    return { hasPermission: () => false };
  }

  const userPermissions = rolePermissions[user.role];

  const hasPermission = (permission: Permission): boolean => {
    return userPermissions?.includes(permission) ?? false;
  };

  return { hasPermission, userRole: user.role };
};
