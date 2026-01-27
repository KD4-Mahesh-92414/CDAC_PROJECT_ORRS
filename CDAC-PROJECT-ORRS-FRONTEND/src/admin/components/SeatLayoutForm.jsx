import AdminInput from './AdminInput';
import AdminSelect from './AdminSelect';

export default function SeatLayoutForm({ 
  formData, 
  setFormData, 
  errors = {} 
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <AdminSelect
          label="Coach Type"
          name="coachType"
          value={formData.coachType}
          onChange={(e) => setFormData({...formData, coachType: e.target.value})}
          error={errors.coachType}
          required
          options={[
            { value: '', label: 'Select Coach Type' },
            { value: 'SL', label: 'Sleeper (SL)' },
            { value: '3A', label: 'AC 3 Tier (3A)' },
            { value: '2A', label: 'AC 2 Tier (2A)' },
            { value: '1A', label: 'AC First Class (1A)' },
            { value: 'CC', label: 'Chair Car (CC)' },
            { value: '2S', label: 'Second Sitting (2S)' }
          ]}
        />

        <AdminInput
          label="Layout Name"
          name="layoutName"
          value={formData.layoutName}
          onChange={(e) => setFormData({...formData, layoutName: e.target.value})}
          error={errors.layoutName}
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <AdminInput
          label="Total Seats"
          name="totalSeats"
          type="number"
          value={formData.totalSeats}
          onChange={(e) => setFormData({...formData, totalSeats: parseInt(e.target.value) || ''})}
          error={errors.totalSeats}
          required
          min={1}
        />

        <AdminInput
          label="Rows"
          name="rows"
          type="number"
          value={formData.rows}
          onChange={(e) => setFormData({...formData, rows: parseInt(e.target.value) || ''})}
          error={errors.rows}
          required
          min={1}
        />

        <AdminInput
          label="Seats Per Row"
          name="seatsPerRow"
          type="number"
          value={formData.seatsPerRow}
          onChange={(e) => setFormData({...formData, seatsPerRow: parseInt(e.target.value) || ''})}
          error={errors.seatsPerRow}
          required
          min={1}
        />
      </div>

      <AdminInput
        label="Layout Configuration (JSON)"
        name="layoutConfig"
        value={formData.layoutConfig}
        onChange={(e) => setFormData({...formData, layoutConfig: e.target.value})}
        error={errors.layoutConfig}
        placeholder='{"berths": {"lower": 18, "middle": 18, "upper": 18, "side_lower": 9, "side_upper": 9}}'
      />

      <AdminInput
        label="Description"
        name="description"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
        error={errors.description}
      />
    </div>
  );
}