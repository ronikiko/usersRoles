
export type Role = string;

export enum Permission {
  // User Permissions
  VIEW_USERS = 'VIEW_USERS',
  CREATE_USERS = 'CREATE_USERS',
  EDIT_USERS = 'EDIT_USERS',
  DELETE_USERS = 'DELETE_USERS',
  
  // Role Permissions
  VIEW_ROLES = 'VIEW_ROLES',
  MANAGE_ROLES = 'MANAGE_ROLES',

  // Dashboard Permissions
  VIEW_DASHBOARD_STATS = 'VIEW_DASHBOARD_STATS',
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  lastLogin: Date;
  status: 'Active' | 'Inactive';
}

export interface RoleDefinition {
    name: Role;
    permissions: Permission[];
}

export interface AuditLog {
  id: string;
  actor: {
    id: string;
    name: string;
  };
  action: string;
  target?: {
    type: string;
    id: string;
    name: string;
  };
  timestamp: Date;
}