
import React, { useState, useEffect } from 'react';
import type { RoleDefinition } from '../../types';
import { Permission } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { createRole, updateRole } from '../../services/mockApi';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  role: RoleDefinition | null;
}

const RoleFormModal: React.FC<RoleFormModalProps> = ({ isOpen, onClose, onSuccess, role }) => {
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth();
  const originalName = role?.name;

  useEffect(() => {
    if (role) {
      setName(role.name);
      setSelectedPermissions(role.permissions);
    } else {
      setName('');
      setSelectedPermissions([]);
    }
    setError('');
  }, [role]);

  const handlePermissionChange = (permission: Permission, checked: boolean) => {
    setSelectedPermissions(prev => 
      checked ? [...prev, permission] : prev.filter(p => p !== permission)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!currentUser || !name) return;
    setIsLoading(true);

    try {
      const roleData: RoleDefinition = { name, permissions: selectedPermissions };
      if (role && originalName) {
        await updateRole(currentUser, originalName, roleData);
      } else {
        await createRole(currentUser, roleData);
      }
      onSuccess();
    } catch (err) {
      console.error('Failed to save role:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const allPermissions = Object.values(Permission);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={role ? 'Edit Role' : 'Add New Role'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Role Name"
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Permissions</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
            {allPermissions.map(p => (
              <label key={p} className="flex items-center space-x-3 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedPermissions.includes(p)}
                  onChange={(e) => handlePermissionChange(p, e.target.checked)}
                />
                <span className="text-gray-700 dark:text-gray-300 text-xs capitalize">{p.replace(/_/g, ' ').toLowerCase()}</span>
              </label>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {role ? 'Save Changes' : 'Create Role'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RoleFormModal;