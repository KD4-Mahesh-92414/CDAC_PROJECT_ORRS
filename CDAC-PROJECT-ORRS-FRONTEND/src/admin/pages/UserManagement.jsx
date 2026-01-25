import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import PrimaryButton from '../components/PrimaryButton';
import AdminInput from '../components/AdminInput';
import AdminSelect from '../components/AdminSelect';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [users] = useState([
    {
      userId: 1,
      fullName: 'John Doe',
      email: 'john@example.com',
      mobile: '9876543210',
      gender: 'Male',
      role: 'Customer',
      accountStatus: 'Active',
      isVerifiedEmail: true
    },
    {
      userId: 2,
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      mobile: '9876543211',
      gender: 'Female',
      role: 'Staff',
      accountStatus: 'Active',
      isVerifiedEmail: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    gender: '',
    role: 'Customer',
    accountStatus: 'Active',
    isVerifiedEmail: false
  });

  const columns = [
    { key: 'fullName', label: 'Full Name' },
    { key: 'email', label: 'Email' },
    { key: 'mobile', label: 'Mobile' },
    { 
      key: 'role', 
      label: 'Role',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'Admin' ? 'bg-violet-100 text-violet-800' :
          value === 'Staff' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    { 
      key: 'accountStatus', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'Active' ? 'bg-green-100 text-green-800' :
          value === 'Inactive' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {value}
        </span>
      )
    }
  ];

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Invalid email format');
      return false;
    }
    if (!formData.mobile.trim()) {
      toast.error('Mobile number is required');
      return false;
    }
    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error('Mobile number must be 10 digits');
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setFormData({
      fullName: '',
      email: '',
      mobile: '',
      gender: '',
      role: 'Customer',
      accountStatus: 'Active',
      isVerifiedEmail: false
    });
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setShowModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success(selectedUser ? 'User updated successfully!' : 'User added successfully!');
      setShowModal(false);
    }
  };

  const confirmDelete = () => {
    toast.success('User deleted successfully!');
    setShowDeleteDialog(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage user accounts and permissions</p>
          </div>
          <PrimaryButton onClick={handleAdd}>
            Add User
          </PrimaryButton>
        </div>

        <DataTable
          columns={columns}
          data={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <FormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          title={selectedUser ? 'Edit User' : 'Add User'}
          onSubmit={handleSubmit}
        >
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <AdminInput
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                />
                <AdminInput
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Contact & Personal */}
            <div className="border-t-2 border-violet-100 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact & Personal</h3>
              <div className="grid grid-cols-2 gap-6">
                <AdminInput
                  label="Mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  required
                />
                <AdminSelect
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  options={[
                    { value: '', label: 'Select Gender' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' }
                  ]}
                />
              </div>
            </div>

            {/* Account Settings */}
            <div className="border-t-2 border-violet-100 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h3>
              <div className="grid grid-cols-2 gap-6">
                <AdminSelect
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  options={[
                    { value: 'Customer', label: 'Customer' },
                    { value: 'Admin', label: 'Admin' },
                    { value: 'Staff', label: 'Staff' }
                  ]}
                />
                <AdminSelect
                  label="Account Status"
                  name="accountStatus"
                  value={formData.accountStatus}
                  onChange={(e) => setFormData({...formData, accountStatus: e.target.value})}
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                    { value: 'Suspended', label: 'Suspended' }
                  ]}
                />
              </div>
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="isVerifiedEmail"
                  checked={formData.isVerifiedEmail}
                  onChange={(e) => setFormData({...formData, isVerifiedEmail: e.target.checked})}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <label htmlFor="isVerifiedEmail" className="ml-2 block text-sm font-semibold text-gray-900">
                  Email Verified
                </label>
              </div>
            </div>
          </div>
        </FormModal>

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
