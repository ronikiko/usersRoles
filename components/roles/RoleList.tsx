
import React, { useState, useEffect, useCallback } from 'react';
import { Permission, RoleDefinition } from '../../types';
import { getRoles, deleteRole } from '../../services/mockApi';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import Card from '../ui/Card';
import Button from '../ui/Button';
import RoleFormModal from './RoleFormModal';

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const DeleteIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const PermissionBadge: React.FC<{ permission: string }> = ({ permission }) => (
    <span className="m-1 inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 capitalize">
        {permission.replace(/_/g, ' ').toLowerCase()}
    </span>
);

const RoleCard: React.FC<{
    role: RoleDefinition;
    onEdit: (role: RoleDefinition) => void;
    onDelete: (roleName: string) => void;
    canManage: boolean;
}> = ({ role, onEdit, onDelete, canManage }) => {
    const isDefaultRole = ['Admin', 'Manager', 'User'].includes(role.name);
    return (
        <Card>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-primary-700 dark:text-primary-400">{role.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-3 dark:text-gray-400">Users with this role have the following permissions:</p>
                </div>
                {canManage && (
                    <div className="flex items-center space-x-2 flex-shrink-0">
                        <button 
                            onClick={() => onEdit(role)} 
                            className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                            title="Edit role"
                        >
                            <EditIcon />
                        </button>
                        {!isDefaultRole && (
                            <button 
                                onClick={() => onDelete(role.name)} 
                                className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-200"
                                title="Delete role"
                            >
                                <DeleteIcon />
                            </button>
                        )}
                    </div>
                )}
            </div>
            <div className="flex flex-wrap">
                {role.permissions.length > 0 ? role.permissions.map((p) => (
                    <PermissionBadge key={p} permission={p} />
                )) : <p className="text-sm text-gray-400">No permissions assigned.</p>}
            </div>
        </Card>
    );
};

const RoleList: React.FC = () => {
    const [roles, setRoles] = useState<RoleDefinition[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
    const { user: currentUser } = useAuth();
    const { hasPermission } = useAuthorization();

    const canManage = hasPermission(Permission.MANAGE_ROLES);

    const fetchRoles = useCallback(async () => {
        setLoading(true);
        const roleList = await getRoles();
        setRoles(roleList);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);
    
    const handleAddRole = () => {
        setEditingRole(null);
        setIsModalOpen(true);
    };

    const handleEditRole = (role: RoleDefinition) => {
        setEditingRole(role);
        setIsModalOpen(true);
    };

    const handleDeleteRole = async (roleName: string) => {
        if (window.confirm(`Are you sure you want to delete the "${roleName}" role? Users in this role will be reassigned to the 'User' role.`)) {
            if (!currentUser) return;
            try {
                await deleteRole(currentUser, roleName);
                fetchRoles();
            } catch (error) {
                console.error('Failed to delete role:', error);
                alert((error as Error).message);
            }
        }
    };
    
    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingRole(null);
    };

    const handleSuccess = () => {
        handleModalClose();
        fetchRoles();
    };


    if (loading) return <div className="text-center p-8 dark:text-gray-300">Loading roles...</div>;

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Roles & Permissions</h1>
                {canManage && (
                    <Button onClick={handleAddRole}>
                        Add Role
                    </Button>
                )}
            </div>
            <div className="space-y-6">
                {roles.map((role) => (
                    <RoleCard 
                        key={role.name}
                        role={role}
                        onEdit={handleEditRole}
                        onDelete={handleDeleteRole}
                        canManage={canManage}
                     />
                ))}
            </div>
            {isModalOpen && canManage && (
                <RoleFormModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSuccess={handleSuccess}
                    role={editingRole}
                />
            )}
        </>
    );
};

export default RoleList;