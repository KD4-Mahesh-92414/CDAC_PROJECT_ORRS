const ContactInfo = () => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Contact Info</h3>
      <label className="block text-sm">Email</label>
      <input
        type="email"
        className="border rounded px-3 py-2 w-full"
        placeholder="example@gmail.com"
      />
      <p className="text-xs text-gray-500 mt-1">
        Booking information will be sent to this email
      </p>
    </div>
  );
};

export default ContactInfo;
