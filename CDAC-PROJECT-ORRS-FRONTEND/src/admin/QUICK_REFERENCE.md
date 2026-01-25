# Admin Panel Quick Reference

## 🚀 Access
- URL: `http://localhost:5174/admin`
- Link: Click "Admin Panel" in main navbar

## 📍 Routes
- `/admin` - Dashboard
- `/admin/stations` - Station Management
- `/admin/trains` - Train Management

## 🎯 Context Hooks

### Stations
```javascript
import { useStations } from './admin/context/StationContext';

const { stations, addStation, updateStation, deleteStation } = useStations();
```

### Trains
```javascript
import { useTrains } from './admin/context/TrainContext';

const { trains, addTrain, updateTrain, deleteTrain } = useTrains();
```

## 📝 Field Names (Java camelCase)

### Station
```javascript
{
  stationId, stationCode, stationName, 
  city, state, zone, platforms, status
}
```

### Train
```javascript
{
  trainId, trainNumber, trainName, trainType,
  sourceStationId, destinationStationId,
  totalDistanceKm, avgSpeed, daysOfRun,
  trainActiveStatus, status
}
```

## ✅ Validation Rules

### Station
- `stationCode`: Required, max 10 chars
- `stationName`: Required
- `platforms`: 1-50 range

### Train
- `trainNumber`: Required, exactly 5 digits
- `trainName`: Required
- `sourceStationId`: Required
- `destinationStationId`: Required, ≠ source
- `totalDistanceKm`: 1-5000 range
- `avgSpeed`: 10-200 km/h range

## 🎨 Theme Colors
- Primary: `violet-600`
- Success: `green-600`
- Error: `red-600`
- Warning: `yellow-600`

## 🧩 Reusable Components
- `<DataTable />` - Table with edit/delete
- `<FormModal />` - Modal with form
- `<ConfirmDialog />` - Confirmation dialog
- `<PrimaryButton />` - Styled button
- `<StatsCard />` - Dashboard stat card

## 🔄 CRUD Operations

### Add
```javascript
const newItem = addStation(formData);
const newItem = addTrain(formData);
```

### Update
```javascript
updateStation(stationId, formData);
updateTrain(trainId, formData);
```

### Delete (Soft)
```javascript
deleteStation(stationId);  // Sets status = 'Inactive'
deleteTrain(trainId);      // Sets trainActiveStatus = 'Inactive'
```

## 📊 Dashboard Stats
- Active Trains: `trains.filter(t => t.trainActiveStatus === 'Active').length`
- Active Stations: `stations.filter(s => s.status === 'Active').length`
- Running Trains: `trains.filter(t => t.status === 'Running').length`

## 🔍 Common Patterns

### Form with Validation
```javascript
const [formData, setFormData] = useState({...});
const [errors, setErrors] = useState({});

const handleSubmit = (e) => {
  e.preventDefault();
  const validationErrors = validateStation(formData);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  // Save data
};
```

### Table Column with Render
```javascript
{
  key: 'status',
  label: 'Status',
  render: (value) => (
    <span className={`badge ${value === 'Active' ? 'green' : 'red'}`}>
      {value}
    </span>
  )
}
```

## 🎯 Key Files
- `src/admin/context/StationContext.jsx` - Station data
- `src/admin/context/TrainContext.jsx` - Train data
- `src/admin/validations/index.js` - Validation logic
- `src/admin/components/DataTable.jsx` - Reusable table
- `src/admin/layouts/AdminLayout.jsx` - Main layout
- `src/admin/pages/Dashboard.jsx` - Dashboard page
- `src/App.jsx` - Context providers & routes
