import AdminInput from './AdminInput';
import AdminSelect from './AdminSelect';
import { useTrains } from '../context/TrainContext';
import { useStations } from '../context/StationContext';

export default function TrainRouteForm({ 
  formData, 
  setFormData, 
  errors = {} 
}) {
  const { trains } = useTrains();
  const { stations } = useStations();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <AdminSelect
          label="Train"
          name="trainId"
          value={formData.trainId}
          onChange={(e) => setFormData({...formData, trainId: parseInt(e.target.value)})}
          error={errors.trainId}
          required
          options={[
            { value: '', label: 'Select Train' },
            ...trains.map(train => ({
              value: train.id,
              label: `${train.trainNumber} - ${train.trainName}`
            }))
          ]}
        />

        <AdminSelect
          label="Station"
          name="stationId"
          value={formData.stationId}
          onChange={(e) => setFormData({...formData, stationId: parseInt(e.target.value)})}
          error={errors.stationId}
          required
          options={[
            { value: '', label: 'Select Station' },
            ...stations.map(station => ({
              value: station.id,
              label: `${station.stationCode} - ${station.stationName}`
            }))
          ]}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <AdminInput
          label="Arrival Time"
          name="arrivalTime"
          type="time"
          step="1"
          value={formData.arrivalTime}
          onChange={(e) => setFormData({...formData, arrivalTime: e.target.value})}
          error={errors.arrivalTime}
        />

        <AdminInput
          label="Departure Time"
          name="departureTime"
          type="time"
          step="1"
          value={formData.departureTime}
          onChange={(e) => setFormData({...formData, departureTime: e.target.value})}
          error={errors.departureTime}
          required
        />

        <AdminInput
          label="Sequence Number"
          name="sequenceNo"
          type="number"
          value={formData.sequenceNo}
          onChange={(e) => setFormData({...formData, sequenceNo: parseInt(e.target.value) || ''})}
          error={errors.sequenceNo}
          required
          min={1}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <AdminInput
          label="Distance from Source (KM)"
          name="distanceFromSource"
          type="number"
          value={formData.distanceFromSource}
          onChange={(e) => setFormData({...formData, distanceFromSource: parseFloat(e.target.value) || ''})}
          error={errors.distanceFromSource}
          step="0.1"
        />

        <AdminInput
          label="Halt Minutes"
          name="haltMinutes"
          type="number"
          value={formData.haltMinutes}
          onChange={(e) => setFormData({...formData, haltMinutes: parseInt(e.target.value) || ''})}
          error={errors.haltMinutes}
        />
      </div>
    </div>
  );
}