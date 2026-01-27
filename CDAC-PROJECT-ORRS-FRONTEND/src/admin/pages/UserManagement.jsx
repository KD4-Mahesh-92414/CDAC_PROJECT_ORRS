import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import ConfirmDialog from '../components/ConfirmDialog';
import { useUsers } from '../context/UserContext';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const { users, updateUserStatus, deleteUser } = useUsers();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

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
          value === 'ROLE_STAFF' ? 'bg-blue-100 text-blue-800' :
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
          'bg-yellow-100 text-yellow-800'
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

  const handleStatusToggle = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const success = await updateUserStatus(user.id, { status: newStatus });
    if (success) {
      toast.success(`User ${newStatus.toLowerCase()} successfully!`);
    }
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    const success = await deleteUser(selectedUser.id);
    if (success) {
      toast.success('User deleted successfully!');
    }
    setShowDeleteDialog(false);
  };

  // Custom actions for user management
  const customActions = (user) => [
    {
      label: user.status === 'ACTIVE' ? 'Deactivate' : 'Activate',
      onClick: () => handleStatusToggle(user),
      className: user.status === 'ACTIVE' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
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
        </div>

        <DataTable
          columns={columns}
          data={users}
          onDelete={handleDelete}
          customActions={customActions}
          hideEdit={true}
        />

        <ConfirmDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Delete User"
          message={`Are you sure you want to delete ${selectedUser?.fullName}?`}
        />
      </div>
    </AdminLayout>
  );
}
