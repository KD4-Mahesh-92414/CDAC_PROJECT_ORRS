# 🚂 Train Search Functionality - Technical Flow Documentation

## 📍 Entry Point

**Controller**: `TrainScheduleController.java`
- **Endpoint**: `POST /schedule/search`
- **Request Body**: `TrainSearchReqDTO`
  ```java
  {
    "sourceStation": "Mumbai Central",
    "destinationStation": "New Delhi", 
    "journeyDate": "2024-06-15"
  }
  ```
- **Validation**: `@Valid` annotation triggers Jakarta Bean Validation

---

## 🔄 Complete Flow Breakdown

### **Step 1: Request Validation (Service Layer)**
**File**: `TrainScheduleServiceImpl.java`

**Validations Performed**:
1. ✅ **Past Date Check**: `journeyDate < today` → Reject
2. ✅ **Advance Reservation Period**: `journeyDate > today + 90 days` → Reject (ARP limit)
3. ✅ **Station Resolution**: Convert station names to IDs using `StationRepository.findByStationNameIgnoreCase()`
4. ✅ **Same Station Check**: `sourceId == destinationId` → Reject

**Why?** Prevents invalid searches before hitting the database.

---

### **Step 2: Core Database Query (Repository Layer)**

**File**: `TrainScheduleRepository.java`  
**Method**: `findAvailableTrains(sourceId, destId, journeyDate, status)`

#### **Tables Joined** (4 Tables):
```
TrainSchedule (ts)
  ↓ JOIN train_id
Train (t)
  ↓ JOIN train_id  
TrainRoute (srcRoute) -- Source station route entry
  ↓ JOIN train_id
TrainRoute (destRoute) -- Destination station route entry
```

#### **Join Conditions**:
```sql
ts.train = t                                    -- Schedule belongs to Train
srcRoute.train = t AND srcRoute.station = :sourceId      -- Train passes through source
destRoute.train = t AND destRoute.station = :destId      -- Train passes through destination
srcRoute.sequenceNo < destRoute.sequenceNo               -- CRITICAL: Ensures correct direction
```

#### **WHERE Conditions**:
```sql
ts.departureDate = :journeyDate    -- Matches search date
ts.status = 'RUNNING'              -- Only active schedules
```

#### **Why Join TrainRoute Twice?**
- **srcRoute**: Gets departure time and distance at source station
- **destRoute**: Gets arrival time and distance at destination station
- **sequenceNo check**: Ensures train travels FROM source TO destination (not reverse direction)

**Example**:
```
Train Route: Mumbai(seq=1) → Pune(seq=2) → Delhi(seq=3)
✅ Search: Mumbai → Delhi (seq 1 < 3) → Valid
❌ Search: Delhi → Mumbai (seq 3 < 1) → Invalid
```

#### **Data Retrieved**:
```java
- trainId, scheduleId
- trainNumber, trainName, trainType
- sourceStationName, destinationStationName
- departureTime, arrivalTime
- travelDurationMinutes (TIMESTAMPDIFF function)
- distanceKm (destRoute.distance - srcRoute.distance)
- daysOfRun (e.g., "Daily", "Mon,Wed,Fri")
```

---

### **Step 3: Data Enrichment Loop (Service Layer)**

For **each train** found, the system enriches with fare and availability data:

#### **3A. Fetch All Fares**
**Repository**: `TrainFareRepository.findByTrainId(trainId)`  
**Table**: `train_fares`  
**Join**: `TrainFare → CoachType`

Returns all configured coach types for this train (SL, 3A, 2A, 1A).

#### **3B. Calculate Dynamic Fare**
**Method**: `TrainFare.calculateFare(distanceKm)`

**Formula**:
```
Final Fare = baseFare + (ratePerKm × actualDistance)
```

**Example Calculation**:
```
Base Fare: ₹50
Rate Per Km: ₹0.50
Distance: 500 km
────────────────────
Total Fare = ₹50 + (₹0.50 × 500) = ₹300
```

**Why Dynamic?** Different route segments have different distances:
- Mumbai → Delhi (1384 km) = ₹742
- Mumbai → Pune (192 km) = ₹146

#### **3C. Calculate Seat Availability**
**Method**: `calculateAvailability(trainId, scheduleId, coachType)`

**Query 1 - Total Capacity**:
```sql
SELECT COUNT(sl.seat_number)
FROM train_coaches tc
JOIN seat_layouts sl ON tc.coach_type_id = sl.coach_type_id
WHERE tc.train_id = ? AND tc.coach_type_id = ?
```
**Tables**: `train_coaches` → `seat_layouts`

**Query 2 - Booked Seats**:
```sql
SELECT COUNT(t.id)
FROM bookings b
JOIN tickets t ON b.id = t.booking_id
WHERE b.schedule_id = ? 
  AND t.coach_type_id = ?
  AND b.status = 'CONFIRMED'
```
**Tables**: `bookings` → `tickets`

**Availability Calculation**:
```
Available Seats = Total Capacity - Booked Count
```

**Status Logic**:
```java
if (available > 0) → "AVAILABLE"
if (available ≤ 0) → "WL " + Math.abs(available)  // e.g., "WL 5"
```

#### **3D. Build Coach Options**
Creates `TrainCoachRespDTO` for each coach type:
```java
{
  coachTypeId: 1,
  typeCode: "SL",
  typeName: "Sleeper",
  coachImageUrl: "sleeper.png",
  fare: 300.00,
  availability: 45,
  status: "AVAILABLE"
}
```

**Why Per Coach Type?** Different classes have different:
- Capacity (SL: 72 seats, 3A: 64 seats)
- Pricing (SL: ₹300, 3A: ₹800)
- Availability (SL full, but 3A available)

---

### **Step 4: Today's Train Filtering**
**Method**: `filterDepartedTrains()`

**Logic**:
```java
if (searchDate == today) {
  trains = trains.filter(t -> t.departureTime > currentTime)
}
```

**Example**:
```
Current Time: 3:00 PM
Train A departs: 2:00 PM → ❌ Filtered out (already left)
Train B departs: 5:00 PM → ✅ Included
```

**Why?** User can't book a train that already departed.

---

### **Step 5: Final Response Construction**

**Response Structure**:
```json
{
  "message": "Trains fetched successfully",
  "status": "SUCCESS",
  "data": [
    {
      "trainId": 1,
      "scheduleId": 101,
      "trainNumber": "12301",
      "trainName": "Rajdhani Express",
      "trainType": "SUPERFAST",
      "sourceStationName": "Mumbai Central",
      "destinationStationName": "New Delhi",
      "sourceStationId": 5,
      "destinationStationId": 10,
      "departureTime": "16:55",
      "arrivalTime": "08:35",
      "travelDurationMinutes": 945,
      "distanceKm": 1384,
      "daysOfRun": "Daily",
      "classOptions": [
        {
          "coachTypeId": 1,
          "typeCode": "SL",
          "typeName": "Sleeper",
          "coachImageUrl": "sleeper.png",
          "fare": 742.00,
          "availability": 45,
          "status": "AVAILABLE"
        },
        {
          "coachTypeId": 2,
          "typeCode": "3A",
          "typeName": "AC 3 Tier",
          "coachImageUrl": "3ac.png",
          "fare": 1890.00,
          "availability": 0,
          "status": "WL 12"
        }
      ]
    }
  ]
}
```

**Why Include sourceStationId & destinationStationId?**
- Frontend needs these for **Seat Matrix API** call
- Avoids re-resolving station names on next step
- Maintains data consistency across booking flow

---

## 📊 Database Tables Involved

| Table | Purpose | Relationships |
|-------|---------|---------------|
| `train_schedules` | Daily train instances | ManyToOne → `trains` |
| `trains` | Train master data | OneToMany → `train_routes` |
| `train_routes` | Station sequence & timings | ManyToOne → `stations`, `trains` |
| `stations` | Station details | - |
| `train_fares` | Pricing per coach type | ManyToOne → `trains`, `coach_types` |
| `coach_types` | Coach class definitions | - |
| `train_coaches` | Coach configuration | ManyToOne → `trains`, `coach_types` |
| `seat_layouts` | Seat arrangement | ManyToOne → `coach_types` |
| `bookings` | Confirmed bookings | OneToMany → `tickets` |
| `tickets` | Individual passenger seats | ManyToOne → `bookings` |

---

## 🎯 Design Decisions Explained

### **1. Why Not Search by City?**
**Current**: Search by station name  
**Alternative**: Search by city name

**Reason**: 
- One city can have multiple stations (Mumbai Central, Mumbai CST, Mumbai Dadar)
- User needs to specify exact boarding point
- Avoids ambiguity in booking

### **2. Why Calculate Fare Dynamically?**
**Alternative**: Store pre-calculated fares for all station pairs

**Reason**:
- Reduces database size (no need for N×N fare matrix)
- Easy to update pricing (change ratePerKm once)
- Handles new routes automatically

### **3. Why Check Availability Per Coach Type?**
**Alternative**: Show only train-level availability

**Reason**:
- Different classes have different capacities
- Gives users alternative options (SL full → try 3A)
- Better user experience

### **4. Why Use DTO Pattern?**
**Alternative**: Return entities directly

**Reason**:
- Prevents lazy loading exceptions
- Controls exactly what data is sent to client
- Avoids exposing internal entity structure
- Better performance (no unnecessary data transfer)

---

## 🔍 Example Search Flow

**User Input**:
```
Source: Mumbai Central
Destination: New Delhi
Date: 2024-06-15
```

**Step-by-Step Execution**:

1. **Validation**: ✅ Date is valid, stations exist, not same
2. **Database Query**: Finds 3 trains passing through both stations
3. **For Train 1 (Rajdhani)**:
   - Fetch fares: SL (₹0.50/km), 3A (₹1.20/km), 2A (₹1.80/km)
   - Calculate: Distance = 1384 km
     - SL: ₹50 + (₹0.50 × 1384) = ₹742
     - 3A: ₹50 + (₹1.20 × 1384) = ₹1710
   - Check availability:
     - SL: 72 total - 27 booked = 45 available
     - 3A: 64 total - 64 booked = 0 available (WL 12)
4. **Repeat for Train 2 & 3**
5. **Filter**: If today, remove departed trains
6. **Return**: JSON response with all enriched data

---

## ✅ Key Takeaways

1. **Single Query Optimization**: Main search uses one complex JOIN instead of multiple queries
2. **Route Validation**: `sequenceNo` check ensures trains travel in correct direction
3. **Dynamic Pricing**: Fare calculated based on actual distance traveled
4. **Real-time Availability**: Checks current bookings for accurate seat counts
5. **Enriched Response**: Frontend gets all data needed for next step (seat selection)
6. **Performance**: DTO pattern prevents N+1 queries and lazy loading issues

This design ensures **accurate, fast, and scalable** train search functionality.
