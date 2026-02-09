import { useState, useEffect, useCallback } from "react";

const PassengerCard = ({ passengerNo, passenger, onPassengerChange, seatInfo }) => {
  // Local validation errors only - no passenger data stored locally
  const [validationErrors, setValidationErrors] = useState({});

  // Clear validation errors when passenger changes
  useEffect(() => {
    setValidationErrors({});
  }, [passengerNo]);

  const validateField = useCallback((field, value) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      
      switch (field) {
        case 'name':
          if (!value || !value.trim()) {
            newErrors.name = 'Name is required';
          } else if (value.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
          } else {
            delete newErrors.name;
          }
          break;
        case 'age':
          const ageNum = parseInt(value);
          if (!value || value === '') {
            newErrors.age = 'Age is required';
          } else if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
            newErrors.age = 'Age must be between 1 and 120';
          } else {
            delete newErrors.age;
          }
          break;
        case 'country':
          if (!value || !value.trim()) {
            newErrors.country = 'Country is required';
          } else {
            delete newErrors.country;
          }
          break;
        case 'gender':
          if (!value) {
            newErrors.gender = 'Gender is required';
          } else {
            delete newErrors.gender;
          }
          break;
      }
      
      return newErrors;
    });
  }, []);

  const handleChange = useCallback((field, value) => {
    const passengerIndex = passengerNo - 1;
    
    // Immediately update Redux store
    onPassengerChange(passengerIndex, field, value);
    
    // Validate the field
    validateField(field, value);
  }, [passengerNo, onPassengerChange, validateField]);

  // Ensure we have default values
  const safePassenger = {
    name: passenger?.name || '',
    age: passenger?.age || '',
    gender: passenger?.gender || 'Male',
    country: passenger?.country || 'India',
    id: passenger?.id || `temp-${passengerNo}`
  };

  return (
    <div className="bg-white border-2 border-violet-300 rounded-2xl p-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-6 pb-2 border-b border-violet-300">
        <h2 className="text-lg font-semibold text-gray-800">
          Passenger {passengerNo}
        </h2>
        {seatInfo && (
          <div className="bg-violet-100 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-violet-700">
              {typeof seatInfo === 'object' 
                ? `Seat ${seatInfo.seatNumber} (Coach ${seatInfo.coach})` 
                : `Seat ${seatInfo}`}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Gender */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleChange('gender', 'Male')}
              className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                safePassenger.gender === 'Male'
                  ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                  : 'bg-white text-gray-700 border-violet-200 hover:border-violet-400 hover:bg-violet-50'
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => handleChange('gender', 'Female')}
              className={`flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                safePassenger.gender === 'Female'
                  ? 'bg-violet-600 text-white border-violet-600 shadow-md'
                  : 'bg-white text-gray-700 border-violet-200 hover:border-violet-400 hover:bg-violet-50'
              }`}
            >
              Female
            </button>
          </div>
          {validationErrors.gender && <p className="text-red-500 text-xs mt-1">{validationErrors.gender}</p>}
        </div>

        {/* Name */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={safePassenger.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
              validationErrors.name 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-violet-400 focus:border-violet-600'
            }`}
            placeholder="Enter full name"
          />
          {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>}
        </div>

        {/* Age */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={safePassenger.age}
            onChange={(e) => handleChange('age', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
              validationErrors.age 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-violet-400 focus:border-violet-600'
            }`}
            placeholder="Age"
            min="1"
            max="120"
          />
          {validationErrors.age && <p className="text-red-500 text-xs mt-1">{validationErrors.age}</p>}
        </div>

        {/* Country */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={safePassenger.country}
            onChange={(e) => handleChange('country', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
              validationErrors.country 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-violet-400 focus:border-violet-600'
            }`}
            placeholder="Country"
          />
          {validationErrors.country && <p className="text-red-500 text-xs mt-1">{validationErrors.country}</p>}
        </div>
      </div>
    </div>
  );
};

export default PassengerCard;