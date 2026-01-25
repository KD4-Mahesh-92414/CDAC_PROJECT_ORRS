import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import ConfirmDialog from '../components/ConfirmDialog';
import PrimaryButton from '../components/PrimaryButton';
import AdminInput from '../components/AdminInput';
import AdminSelect from '../components/AdminSelect';
import toast from 'react-hot-toast';

export default function CreateAnnouncement() {
  const [announcements] = useState([
    {
      announcementId: 1,
      title: 'New Train Service',
      message: 'New express train service starting from next month',
      audienceType: 'All Users',
      priority: 'High',
      validFrom: '2024-02-01',
      validTo: '2024-02-28',
      isActive: true
    },
    {
      announcementId: 2,
      title: 'Maintenance Notice',
      message: 'System maintenance scheduled for this weekend',
      audienceType: 'All Users',
      priority: 'Medium',
      validFrom: '2024-01-20',
      validTo: '2024-01-22',
      isActive: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    audienceType: 'All Users',
    priority: 'Medium',
    validFrom: '',
    validTo: '',
    isActive: true
  });

  const columns = [
    { key: 'title', label: 'Title' },
    { 
      key: 'priority', 
      label: 'Priority',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'High' ? 'bg-red-100 text-red-800' :
          value === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'audienceType', label: 'Audience' },
    { key: 'validFrom', label: 'Valid From' },
    { key: 'validTo', label: 'Valid To' },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.message.trim()) {
      toast.error('Message is required');
      return false;
    }
    if (!formData.validFrom) {
      toast.error('Valid from date is required');
      return false;
    }
    if (!formData.validTo) {
      toast.error('Valid to date is required');
      return false;
    }
    if (new Date(formData.validFrom) > new Date(formData.validTo)) {
      toast.error('Valid from date must be before valid to date');
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    setSelectedAnnouncement(null);
    setFormData({
      title: '',
      message: '',
      audienceType: 'All Users',
      priority: 'Medium',
      validFrom: '',
      validTo: '',
      isActive: true
    });
    setShowModal(true);
  };

  const handleEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData(announcement);
    setShowModal(true);
  };

  const handleDelete = (announcement) => {
    setSelectedAnnouncement(announcement);
    setShowDeleteDialog(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success(selectedAnnouncement ? 'Announcement updated successfully!' : 'Announcement created successfully!');
      setShowModal(false);
    }
  };

  const confirmDelete = () => {
    toast.success('Announcement deleted successfully!');
    setShowDeleteDialog(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
            <p className="text-gray-600">Create and manage system announcements</p>
          </div>
          <PrimaryButton onClick={handleAdd}>
            Create Announcement
          </PrimaryButton>
        </div>

        <DataTable
          columns={columns}
          data={announcements}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <FormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          title={selectedAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
          onSubmit={handleSubmit}
        >
          <div className="space-y-6">
            {/* Announcement Content */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Announcement Content</h3>
              <div className="space-y-4">
                <AdminInput
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-violet-200 rounded-xl focus:border-violet-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Targeting & Priority */}
            <div className="border-t-2 border-violet-100 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Targeting & Priority</h3>
              <div className="grid grid-cols-2 gap-6">
                <AdminSelect
                  label="Audience Type"
                  name="audienceType"
                  value={formData.audienceType}
                  onChange={(e) => setFormData({...formData, audienceType: e.target.value})}
                  options={[
                    { value: 'All Users', label: 'All Users' },
                    { value: 'Customers', label: 'Customers Only' },
                    { value: 'Admins', label: 'Admins Only' },
                    { value: 'Staff', label: 'Staff Only' }
                  ]}
                />
                <AdminSelect
                  label="Priority"
                  name="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  options={[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' }
                  ]}
                />
              </div>
            </div>

            {/* Validity Period */}
            <div className="border-t-2 border-violet-100 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Validity Period</h3>
              <div className="grid grid-cols-2 gap-6">
                <AdminInput
                  label="Valid From"
                  name="validFrom"
                  type="date"
                  value={formData.validFrom}
                  onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                  required
                />
                <AdminInput
                  label="Valid To"
                  name="validTo"
                  type="date"
                  value={formData.validTo}
                  onChange={(e) => setFormData({...formData, validTo: e.target.value})}
                  required
                />
              </div>
              <div className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm font-semibold text-gray-900">
                  Active
                </label>
              </div>
            </div>
          </div>
        </FormModal>

        <ConfirmDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Delete Announcement"
          message={`Are you sure you want to delete "${selectedAnnouncement?.title}"?`}
        />
      </div>
    </AdminLayout>
  );
}
