
import type { User, AuditLog, Role, RoleDefinition } from '../types';
import { Permission } from '../types';

// --- MOCK DATABASE ---

let mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@stellar.io', role: 'Admin', createdAt: new Date('2023-01-15'), lastLogin: new Date(), status: 'Active' },
  { id: '2', name: 'Manager Mike', email: 'manager@stellar.io', role: 'Manager', createdAt: new Date('2023-02-20'), lastLogin: new Date(), status: 'Active' },
  { id: '3', name: 'Standard User Sally', email: 'user@stellar.io', role: 'User', createdAt: new Date('2023-03-10'), lastLogin: new Date(), status: 'Active' },
  { id: '4', name: 'Inactive Ian', email: 'ian@stellar.io', role: 'User', createdAt: new Date('2023-04-05'), lastLogin: new Date('2023-05-01'), status: 'Inactive' },
  { id: '5', name: 'Catherine Grant', email: 'catherine.grant@stellar.io', role: 'Manager', createdAt: new Date('2023-05-12'), lastLogin: new Date(), status: 'Active' },
  { id: '6', name: 'Ben Carter', email: 'ben.carter@stellar.io', role: 'User', createdAt: new Date('2023-06-18'), lastLogin: new Date(), status: 'Active' },
];

let mockAuditLogs: AuditLog[] = [
  { id: 'log1', actor: { id: '1', name: 'Admin User' }, action: 'User logged in', timestamp: new Date() },
  { id: 'log2', actor: { id: '2', name: 'Manager Mike' }, action: 'User logged in', timestamp: new Date(Date.now() - 3600000) },
  { id: 'log3', actor: { id: '1', name: 'Admin User' }, action: 'Created user', target: { type: 'User', id: '6', name: 'Ben Carter' }, timestamp: new Date('2023-06-18') },
];

export let rolePermissions: Record<Role, Permission[]> = {
  'Admin': Object.values(Permission),
  'Manager': [
    Permission.VIEW_USERS,
    Permission.CREATE_USERS,
    Permission.EDIT_USERS,
    Permission.VIEW_ROLES,
    Permission.VIEW_DASHBOARD_STATS,
  ],
  'User': [
    Permission.VIEW_DASHBOARD_STATS,
  ],
};

const ARTIFICIAL_DELAY = 500;

// --- MOCK API FUNCTIONS ---

const createAuditLog = (actor: User, action: string, target?: { type: string; id: string; name: string }) => {
  const newLog: AuditLog = {
    id: `log${Date.now()}`,
    actor: { id: actor.id, name: actor.name },
    action,
    target,
    timestamp: new Date(),
  };
  mockAuditLogs.unshift(newLog);
};

export const authenticateUser = (email: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user) {
        user.lastLogin = new Date();
        createAuditLog(user, 'User logged in');
        resolve(user);
      } else {
        resolve(null);
      }
    }, ARTIFICIAL_DELAY);
  });
};

export const getMockUsers = (): Promise<User[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockUsers]);
    }, ARTIFICIAL_DELAY);
  });
};

export const createUser = (actor: User, newUser: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user: User = {
                ...newUser,
                id: String(Date.now()),
                createdAt: new Date(),
                lastLogin: new Date(),
            };
            mockUsers.push(user);
            createAuditLog(actor, `Created user ${user.name}`, { type: 'User', id: user.id, name: user.name });
            resolve(user);
        }, ARTIFICIAL_DELAY);
    });
};

export const updateUser = (actor: User, userId: string, updates: Partial<User>): Promise<User | null> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const userIndex = mockUsers.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                const originalUser = { ...mockUsers[userIndex] };
                mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
                const updatedUser = mockUsers[userIndex];
                
                const changes = Object.keys(updates)
                    .filter(key => key !== 'id' && originalUser[key as keyof User] !== updatedUser[key as keyof User])
                    .map(key => `${key} from '${originalUser[key as keyof User]}' to '${updatedUser[key as keyof User]}'`)
                    .join(', ');

                createAuditLog(actor, `Updated user ${updatedUser.name} (${changes})`, { type: 'User', id: updatedUser.id, name: updatedUser.name });
                resolve(updatedUser);
            } else {
                resolve(null);
            }
        }, ARTIFICIAL_DELAY);
    });
};

export const deleteUser = (actor: User, userId: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const userIndex = mockUsers.findIndex(u => u.id === userId);
            if (userIndex !== -1) {
                const deletedUser = mockUsers[userIndex];
                mockUsers.splice(userIndex, 1);
                createAuditLog(actor, `Deleted user ${deletedUser.name}`, { type: 'User', id: deletedUser.id, name: deletedUser.name });
                resolve(true);
            } else {
                resolve(false);
            }
        }, ARTIFICIAL_DELAY);
    });
};

export const getAuditLogs = (): Promise<AuditLog[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockAuditLogs]);
    }, ARTIFICIAL_DELAY);
  });
};

// --- ROLE MANAGEMENT API ---

export const getRoles = (): Promise<RoleDefinition[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const roles = Object.entries(rolePermissions).map(([name, permissions]) => ({
                name,
                permissions
            }));
            resolve(roles);
        }, ARTIFICIAL_DELAY);
    });
};

export const createRole = (actor: User, role: RoleDefinition): Promise<RoleDefinition> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (rolePermissions[role.name]) {
                reject(new Error('Role already exists'));
                return;
            }
            rolePermissions[role.name] = role.permissions;
            createAuditLog(actor, `Created role ${role.name}`, { type: 'Role', id: role.name, name: role.name });
            resolve(role);
        }, ARTIFICIAL_DELAY);
    });
};

export const updateRole = (actor: User, oldName: string, updatedRole: RoleDefinition): Promise<RoleDefinition> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!rolePermissions[oldName]) {
                reject(new Error('Role not found'));
                return;
            }
            if (oldName !== updatedRole.name && rolePermissions[updatedRole.name]) {
                 reject(new Error('New role name already exists'));
                return;
            }

            delete rolePermissions[oldName];
            rolePermissions[updatedRole.name] = updatedRole.permissions;
            
            mockUsers = mockUsers.map(u => u.role === oldName ? { ...u, role: updatedRole.name } : u);

            createAuditLog(actor, `Updated role ${oldName} to ${updatedRole.name}`, { type: 'Role', id: updatedRole.name, name: updatedRole.name });
            resolve(updatedRole);
        }, ARTIFICIAL_DELAY);
    });
};

export const deleteRole = (actor: User, roleName: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!rolePermissions[roleName]) {
                reject(new Error('Role not found'));
                return;
            }
            if (['Admin', 'Manager', 'User'].includes(roleName)) {
                reject(new Error('Cannot delete default roles.'));
                return;
            }
            
            delete rolePermissions[roleName];
            mockUsers = mockUsers.map(u => u.role === roleName ? { ...u, role: 'User' } : u);
            
            createAuditLog(actor, `Deleted role ${roleName}`, { type: 'Role', id: roleName, name: roleName });
            resolve(true);
        }, ARTIFICIAL_DELAY);
    });
};