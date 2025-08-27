
import React, { useState, useEffect, useCallback } from 'react';
import type { User } from '../../types';
import { Role, Permission } from '../../types';
import { getMockUsers, deleteUser } from '../../services/mockApi';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthorization } from '../../hooks/useAuthorization';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import UserFormModal from './UserFormModal';
import TableSkeleton from '../ui/skeletons/TableSkeleton';

// SVG Icons for actions
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

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const { user: currentUser } = useAuth();
    const { hasPermission } = useAuthorization();
    
    const canCreate = hasPermission(Permission.CREATE_USERS);
    const canEdit = hasPermission(Permission.EDIT_USERS);
    const canDelete = hasPermission(Permission.DELETE_USERS);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const userList = await getMockUsers();
        setUsers(userList);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleAddUser = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            if (!currentUser) return;
            await deleteUser(currentUser, userId);
            fetchUsers();
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSuccess = () => {
        handleModalClose();
        fetchUsers();
    };

    if (loading) {
        return (
            <>
                <div className="flex justify-between items-center mb-6 animate-pulse">
                    <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    {canCreate && (
                        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    )}
                </div>
                <TableSkeleton rows={5} cols={5} />
            </>
        );
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">User Management</h1>
                {canCreate && (
                    <Button onClick={handleAddUser}>
                        Add User
                    </Button>
                )}
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Login</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Badge status={user.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><Badge role={user.role} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{user.lastLogin.toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-4">
                                            {canEdit && (
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                                                    aria-label={`Edit user ${user.name}`}
                                                    title="Edit user"
                                                >
                                                    <EditIcon />
                                                </button>
                                            )}
                                            {canDelete && user.id !== currentUser?.id && (
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-200"
                                                    aria-label={`Delete user ${user.name}`}
                                                    title="Delete user"
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {isModalOpen && (
                <UserFormModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onSuccess={handleSuccess}
                    user={editingUser}
                />
            )}
        </>
    );
};

export default UserList;
