import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import DataTable from '../components/DataTable';
import PrimaryButton from '../components/PrimaryButton';

export default function RefundTransaction() {
  const [refunds] = useState([
    {
      refundId: 1,
      bookingId: 'BK001',
      userName: 'John Doe',
      refundAmount: 2500.00,
      refundStatus: 'Pending',
      refundMode: 'UPI',
      initiatedOn: '2024-01-15',
      remarks: 'Train cancelled'
    },
    {
      refundId: 2,
      bookingId: 'BK002',
      userName: 'Jane Smith',
      refundAmount: 1800.00,
      refundStatus: 'Approved',
      refundMode: 'Bank Transfer',
      initiatedOn: '2024-01-14',
      completedOn: '2024-01-16',
      remarks: 'Customer request'
    },
    {
      refundId: 3,
      bookingId: 'BK003',
      userName: 'Mike Johnson',
      refundAmount: 3200.00,
      refundStatus: 'Rejected',
      refundMode: 'Card',
      initiatedOn: '2024-01-13',
      remarks: 'Invalid request'
    }
  ]);

  const [statusFilter, setStatusFilter] = useState('All');

  const columns = [
    { key: 'bookingId', label: 'Booking ID' },
    { key: 'userName', label: 'User Name' },
    { 
      key: 'refundAmount', 
      label: 'Amount',
      render: (value) => `₹${value.toFixed(2)}`
    },
    { 
      key: 'refundStatus', 
      label: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          value === 'Approved' ? 'bg-green-100 text-green-800' :
          value === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
          value === 'Rejected' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'refundMode', label: 'Mode' },
    { key: 'initiatedOn', label: 'Initiated On' },
    { 
      key: 'refundId', 
      label: 'Actions',
      render: (value, row) => (
        row.refundStatus === 'Pending' ? (
          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(row)}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleReject(row)}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        ) : (
          <span className="text-xs text-gray-500">-</span>
        )
      )
    }
  ];

  const handleApprove = (refund) => {
    console.log('Approving refund:', refund);
  };

  const handleReject = (refund) => {
    console.log('Rejecting refund:', refund);
  };

  const filteredRefunds = statusFilter === 'All' 
    ? refunds 
    : refunds.filter(r => r.refundStatus === statusFilter);

  const stats = {
    pending: refunds.filter(r => r.refundStatus === 'Pending').length,
    approved: refunds.filter(r => r.refundStatus === 'Approved').length,
    rejected: refunds.filter(r => r.refundStatus === 'Rejected').length
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Refund Transactions</h1>
          <p className="text-gray-600">Manage and process refund requests</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-yellow-700">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-sm text-green-700">Approved</p>
            <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-red-700">Rejected</p>
            <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-violet-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredRefunds}
          showActions={false}
        />
      </div>
    </AdminLayout>
  );
}
