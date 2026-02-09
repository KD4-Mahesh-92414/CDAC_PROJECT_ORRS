import Modal from "../common/Modal";

export default function CancelBookingModal({ open, onClose, onConfirm, loading }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancel Booking</h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            No, Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Cancelling...' : 'Yes, Cancel Booking'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
