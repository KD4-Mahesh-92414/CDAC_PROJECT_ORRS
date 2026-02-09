import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import FormModal from '../components/FormModal';
import UserForm from '../components/UserForm';
import PrimaryButton from '../components/PrimaryButton';
import { adminService } from '../../services';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminService.users.getAllUsers();
      if (response.data?.status === 'SUCCESS') {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'mobile', label: 'Mobile' },
    { 
      key: 'role', 
      label: 'Role',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'ROLE_ADMIN' ? 'bg-violet-100 text-violet-800' :
          value === 'ROLE_MANAGER' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value?.replace('ROLE_', '') || 'Customer'}
        </span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'ACTIVE' ? 'bg-green-100 text-green-800' :
          value === 'INACTIVE' ? 'bg-red-100 text-red-800' :
          value === 'SUSPENDED' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'isEmailVerified',
      label: 'Email Verified',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Verified' : 'Not Verified'}
        </span>
      )
    }
  ];

  const handleCreateUser = async (userData) => {
    try {
      setLoading(true);
      const response = await adminService.users.createUser(userData);
      if (response.data?.status === 'SUCCESS') {
        toast.success('User created successfully!');
        setShowCreateModal(false);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (userData) => {
    try {
      setLoading(true);
      const userId = selectedUser.id || selectedUser.userId;
      const response = await adminService.users.updateUser(userId, userData);
      if (response.data?.status === 'SUCCESS') {
        toast.success('User updated successfully!');
        setShowEditModal(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (user) => {
    try {
      const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const response = await adminService.users.updateUserStatus(user.userId, { status: newStatus });
      if (response.data?.status === 'SUCCESS') {
        toast.success(`User ${newStatus.toLowerCase()} successfully!`);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSuspendUser = async (user) => {
    try {
      const response = await adminService.users.suspendUser(user.userId);
      if (response.data?.status === 'SUCCESS') {
        toast.success('User suspended successfully!');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to suspend user');
    }
  };

  const handleRoleToggle = async (user) => {
    try {
      const newRole = user.role === 'ROLE_ADMIN' ? 'ROLE_CUSTOMER' : 'ROLE_ADMIN';
      const response = await adminService.users.getUserById(user.userId);
      if (response.data?.status === 'SUCCESS') {
        const userData = response.data.data;
        const updateResponse = await adminService.users.updateUser(user.userId, {
          ...userData,
          role: newRole
        });
        if (updateResponse.data?.status === 'SUCCESS') {
          toast.success(`User role changed to ${newRole.replace('ROLE_', '')} successfully!`);
          fetchUsers();
        }
      }
    } catch (error) {
      toast.error('Failed to change user role');
    }
  };

  const handleEdit = async (user) => {
    try {
      const response = await adminService.users.getUserById(user.userId);
      if (response.data && response.data.status === 'SUCCESS') {
        setSelectedUser(response.data.data);
        setShowEditModal(true);
      }
    } catch (error) {
      toast.error('Failed to fetch user details');
    }
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await adminService.users.deleteUser(selectedUser.userId);
      if (response.data?.status === 'SUCCESS') {
        toast.success('User deleted successfully!');
        fetchUsers();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
    setShowDeleteDialog(false);
    setSelectedUser(null);
  };

  const customActions = (user) => [
    {
      label: user.status === 'ACTIVE' ? 'Deactivate' : 'Activate',
      onClick: () => handleStatusToggle(user),
      className: user.status === 'ACTIVE' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
    },
    {
      label: 'Suspend',
      onClick: () => handleSuspendUser(user),
      className: 'text-yellow-600 hover:text-yellow-800',
      show: user.status !== 'SUSPENDED'
    },
    {
      label: user.role === 'ROLE_ADMIN' ? 'Make Customer' : 'Make Admin',
      onClick: () => handleRoleToggle(user),
      className: 'text-blue-600 hover:text-blue-800'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage user accounts and permissions</p>
          </div>
          <PrimaryButton onClick={() => setShowCreateModal(true)}>
            Create User
          </PrimaryButton>
        </div>

        <DataTable
          columns={columns}
          data={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customActions={customActions}
          loading={loading}
        />

        <FormModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New User"
        >
          <UserForm
            onSubmit={handleCreateUser}
            onCancel={() => setShowCreateModal(false)}
            loading={loading}
          />
        </FormModal>

        <FormModal
          open={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          title="Edit User"
        >
          <UserForm
            user={selectedUser}
            onSubmit={handleEditUser}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
            loading={loading}
          />
        </FormModal>

        <ConfirmDialog
          open={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setSelectedUser(null);
          }}
          onConfirm={confirmDelete}
          title="Delete User"
          message={`Are you sure you want to delete ${selectedUser?.fullName}? This action cannot be undone.`}
        />
      </div>
    </AdminLayout>
  );
}
