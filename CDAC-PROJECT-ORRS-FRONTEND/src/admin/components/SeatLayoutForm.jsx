import AdminInput from './AdminInput';
import AdminSelect from './AdminSelect';
import { useEffect, useState } from 'react';
import { adminService } from '../../services';

export default function SeatLayoutForm({ 
  formData, 
  setFormData, 
  errors = {} 
}) {
  const [coachTypes, setCoachTypes] = useState([]);

  useEffect(() => {
    const fetchCoachTypes = async () => {
      try {
        const response = await adminService.coachTypes.getAllCoachTypes();
        if (response.data?.status === 'SUCCESS') {
          setCoachTypes(response.data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch coach types');
      }
    };
    fetchCoachTypes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <AdminSelect
          label="Coach Type"
          name="coachTypeId"
          value={formData.coachTypeId}
          onChange={(e) => setFormData({...formData, coachTypeId: parseInt(e.target.value)})}
          error={errors.coachTypeId}
          required
          options={[
            { value: '', label: 'Select Coach Type' },
            ...coachTypes.map(ct => ({
              value: ct.id,
              label: `${ct.typeCode} - ${ct.typeName}`
            }))
          ]}
        />

        <AdminInput
          label="Seat Number"
          name="seatNumber"
          type="number"
          value={formData.seatNumber}
          onChange={(e) => setFormData({...formData, seatNumber: parseInt(e.target.value) || ''})}
          error={errors.seatNumber}
          required
          min={1}
        />
      </div>

      <AdminSelect
        label="Seat Type"
        name="seatType"
        value={formData.seatType}
        onChange={(e) => setFormData({...formData, seatType: e.target.value})}
        error={errors.seatType}
        required
        options={[
          { value: '', label: 'Select Seat Type' },
          { value: 'LOWER_BERTH', label: 'Lower Berth' },
          { value: 'MIDDLE_BERTH', label: 'Middle Berth' },
          { value: 'UPPER_BERTH', label: 'Upper Berth' },
          { value: 'SIDE_LOWER', label: 'Side Lower' },
          { value: 'SIDE_UPPER', label: 'Side Upper' }
        ]}
      />
    </div>
  );
}