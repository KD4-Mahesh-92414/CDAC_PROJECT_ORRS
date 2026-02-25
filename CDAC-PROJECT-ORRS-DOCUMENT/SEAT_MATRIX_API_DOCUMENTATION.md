# 🎯 Seat Matrix Visualization API - Complete Documentation

## 📋 Overview

The Seat Matrix API provides **real-time seat availability visualization** for train bookings. It displays seat layouts by coach with color-coded status indicators (Available, Reserved, Booked) and handles concurrent user interactions through database-level synchronization.

---

## 🔌 API Endpoint

**URL**: `POST /api/seats/matrix`  
**Authentication**: Required (JWT Token)  
**Method**: POST (uses request body for complex parameters)

---

## 📥 Request Structure

### **Request DTO**: `SeatMatrixReqDTO`

```java
{
  "scheduleId": 101,           // Train schedule instance ID
  "coachTypeId": 1,            // Coach type (SL, 3A, 2A, 1A)
  "sourceStationId": 5,        // User's boarding station
  "destinationStationId": 10   // User's destination station
}
```

### **Field Descriptions**

| Field                  | Type | Required | Description                                         |
| ---------------------- | ---- | -------- | --------------------------------------------------- |
| `scheduleId`           | Long | ✅ Yes   | Unique ID of train schedule (specific date + train) |
| `coachTypeId`          | Long | ✅ Yes   | Coach class ID (1=SL, 2=3A, 3=2A, 4=1A)             |
| `sourceStationId`      | Long | ✅ Yes   | Station where user boards the train                 |
| `destinationStationId` | Long | ✅ Yes   | Station where user gets off the train               |

### **Why Source/Destination Stations?**

The system implements **journey segment-based booking**:

- Train travels: Mumbai → Pune → Nagpur → Delhi
- User A books: Mumbai → Pune (Seat 15)
- User B can book: Pune → Delhi (Same Seat 15)
- **Reason**: Seat is available after User A gets off at Pune

---

## 📤 Response Structure

### **Response DTO**: `ApiResponseDTO<List<SeatMatrixRespDTO>>`

```json
{
  "message": "Seat matrix fetched successfully",
  "status": "SUCCESS",
  "data": [
    {
      "coachLabel": "S1",
      "seats": [
        {
          "seatNumber": 1,
          "seatType": "LOWER",
          "status": "AVAILABLE"
        },
        {
          "seatNumber": 2,
          "seatType": "MIDDLE",
          "status": "LOCKED"
        },
        {
          "seatNumber": 3,
          "seatType": "UPPER",
          "status": "MY_RESERVATION"
        }
        // ... seats 4-72
      ]
    },
    {
      "coachLabel": "S2",
      "seats": [
        // ... seats 1-72
      ]
    }
  ]
}
```

### **Seat Status Values**

| Status           | Meaning                                        | Frontend Display    |
| ---------------- | ---------------------------------------------- | ------------------- |
| `AVAILABLE`      | Seat is free to book                           | 🟢 Green, clickable |
| `LOCKED`         | Permanently booked OR reserved by another user | 🔴 Gray, disabled   |
| `MY_RESERVATION` | Reserved by current user (can deselect)        | 🔵 Blue, clickable  |

---

## 🔄 Complete Backend Flow

### **Step 1: Controller Layer**

**File**: `SeatMatrixController.java`

```java
@PostMapping("/matrix")
public ResponseEntity<ApiResponseDTO<List<SeatMatrixRespDTO>>> getSeatMatrix(
        @Valid @RequestBody SeatMatrixReqDTO reqDTO,
        @AuthenticationPrincipal UserPrincipal principal) {

    return ResponseEntity.ok(
        seatMatrixService.getSeatMatrix(reqDTO, principal.getUserId())
    );
}
```

**Responsibilities**:

- Validates request DTO using `@Valid`
- Extracts user ID from JWT token via `@AuthenticationPrincipal`
- Delegates to service layer

---

### **Step 2: Service Layer - Data Fetching**

**File**: `SeatMatrixServiceImpl.java`

#### **2.1 Get Train ID from Schedule**

```java
Long trainId = scheduleRepository.findById(reqDTO.getScheduleId())
    .orElseThrow(() -> new ServiceException("Schedule not found"))
    .getTrain().getId();
```

**Why?** Schedule ID alone doesn't tell which train it is. Need train ID to fetch coaches.

---

#### **2.2 Fetch Physical Coaches**

```java
List<TrainCoach> physicalCoaches = trainCoachRepository
    .findByTrainIdAndCoachTypeId(trainId, reqDTO.getCoachTypeId());
```

**Query**:

```sql
SELECT * FROM train_coaches
WHERE train_id = ? AND coach_type_id = ?
```

**Result**: List of coach labels like `["S1", "S2", "S3"]`

**Why?** Different trains have different numbers of coaches. Rajdhani might have 3 Sleeper coaches, Shatabdi might have 5.

---

#### **2.3 Fetch Seat Layout Template**

```java
List<SeatLayout> layoutTemplate = seatLayoutRepository
    .findByCoachType_IdOrderBySeatNumberAsc(reqDTO.getCoachTypeId());
```

**Query**:

```sql
SELECT * FROM seat_layouts
WHERE coach_type_id = ?
ORDER BY seat_number ASC
```

**Result**: Seat arrangement (1-72) with types:

```
Seat 1: LOWER
Seat 2: MIDDLE
Seat 3: UPPER
Seat 4: SIDE_LOWER
Seat 5: SIDE_UPPER
...
Seat 72: UPPER
```

**Why?** All coaches of same type (e.g., Sleeper) have identical layout. Store once, reuse for all coaches.

---

#### **2.4 Fetch Confirmed Bookings**

```java
List<Object[]> bookedData = ticketRepository
    .findBookedSeatsForJourneySegment(
        reqDTO.getScheduleId(),
        reqDTO.getCoachTypeId(),
        reqDTO.getSourceStationId(),
        reqDTO.getDestinationStationId(),
        BookingStatus.CONFIRMED
    );
```

**Query** (`TicketRepository.java`):

```sql
SELECT t.coach_label, t.seat_number
FROM tickets t
JOIN bookings b ON t.booking_id = b.id
JOIN train_routes srcRoute ON srcRoute.train_id = b.train_id
                           AND srcRoute.station_id = b.source_station_id
JOIN train_routes destRoute ON destRoute.train_id = b.train_id
                            AND destRoute.station_id = b.destination_station_id
JOIN train_routes userSrcRoute ON userSrcRoute.train_id = b.train_id
                               AND userSrcRoute.station_id = ?
JOIN train_routes userDestRoute ON userDestRoute.train_id = b.train_id
                                AND userDestRoute.station_id = ?
WHERE b.schedule_id = ?
  AND b.coach_type_id = ?
  AND b.status = 'CONFIRMED'
  AND (
    -- Journey overlap logic using sequence numbers
    (srcRoute.sequence_no <= userSrcRoute.sequence_no AND destRoute.sequence_no > userSrcRoute.sequence_no) OR
    (srcRoute.sequence_no < userDestRoute.sequence_no AND destRoute.sequence_no >= userDestRoute.sequence_no) OR
    (srcRoute.sequence_no >= userSrcRoute.sequence_no AND destRoute.sequence_no <= userDestRoute.sequence_no)
  )
```

**Journey Overlap Logic Explained**:

**Critical**: The system uses **sequence numbers** from `train_routes` table, NOT station IDs, because station IDs are auto-generated and don't reflect route order.

**Example Database State**:

```
stations: Mumbai(id=5), Pune(id=12), Nagpur(id=8), Delhi(id=3)
train_routes: Mumbai(seq=1), Pune(seq=2), Nagpur(seq=3), Delhi(seq=4)
```

**Scenario**: Train route with sequence numbers

| Existing Booking              | User Searching                | Overlap? | Reason                                              |
| ----------------------------- | ----------------------------- | -------- | --------------------------------------------------- |
| Mumbai(seq=1) → Pune(seq=2)   | Pune(seq=2) → Delhi(seq=4)    | ❌ No    | Existing ends exactly where user starts             |
| Mumbai(seq=1) → Nagpur(seq=3) | Pune(seq=2) → Delhi(seq=4)    | ✅ Yes   | Both use Pune-Nagpur segment (seq 2-3)              |
| Pune(seq=2) → Delhi(seq=4)    | Mumbai(seq=1) → Nagpur(seq=3) | ✅ Yes   | Both use Pune-Nagpur segment (seq 2-3)              |
| Mumbai(seq=1) → Delhi(seq=4)  | Pune(seq=2) → Nagpur(seq=3)   | ✅ Yes   | User's journey inside existing (seq 2-3 within 1-4) |

**Result**: List of `["S1-15", "S1-20", "S2-5", ...]`

---

#### **2.5 Fetch Active Reservations**

```java
List<Object[]> reservationData = seatReservationRepository
    .findActiveReservationsForMatrix(
        reqDTO.getScheduleId(),
        reqDTO.getCoachTypeId(),
        currentTime
    );
```

**Query** (`SeatReservationRepository.java`):

```sql
SELECT sr.coach_label, sr.seat_number, sr.user_id, sr.expires_at, sr.id
FROM seat_reservations sr
WHERE sr.schedule_id = ?
  AND sr.coach_type_id = ?
  AND sr.expires_at > NOW()
```

**Result**: List of reservations with user info:

```
["S1", 16, 42, "2024-06-15T14:05:00", 1001]
["S1", 17, 55, "2024-06-15T14:03:00", 1002]
```

**Why `expires_at > NOW()`?** Automatically filters expired locks without manual cleanup.

---

### **Step 3: Data Processing**

#### **3.1 Build Confirmed Bookings Set**

```java
Set<String> confirmedBookedSeats = new HashSet<>();
for (Object[] row : bookedData) {
    String label = (String) row[0];      // "S1"
    Integer seatNo = (Integer) row[1];   // 15
    confirmedBookedSeats.add(label + "-" + seatNo); // "S1-15"
}
```

**Result**: `{"S1-15", "S1-20", "S2-5"}`

---

#### **3.2 Build Active Reservations Map**

```java
Map<String, ReservationInfo> activeReservations = new HashMap<>();
List<Long> expiredReservationIds = new ArrayList<>();

for (Object[] row : reservationData) {
    String label = (String) row[0];
    Integer seatNo = (Integer) row[1];
    Long reservationUserId = (Long) row[2];
    LocalDateTime expiresAt = (LocalDateTime) row[3];
    Long reservationId = (Long) row[4];

    String seatKey = label + "-" + seatNo;

    if (expiresAt.isBefore(currentTime)) {
        // Lazy cleanup - mark for expiration
        expiredReservationIds.add(reservationId);
    } else {
        activeReservations.put(seatKey, new ReservationInfo(
            reservationId, reservationUserId, expiresAt
        ));
    }
}
```

**Result**:

```java
{
  "S1-16" -> ReservationInfo(userId=42, expiresAt=14:05),
  "S1-17" -> ReservationInfo(userId=55, expiresAt=14:03)
}
```

---

#### **3.3 Lazy Cleanup (Optional)**

```java
if (!expiredReservationIds.isEmpty()) {
    for (Long expiredId : expiredReservationIds) {
        seatReservationRepository.markAsExpired(expiredId);
    }
}
```

**Query**:

```sql
UPDATE seat_reservations
SET status = 'EXPIRED'
WHERE id = ?
```

**Why "Lazy"?** Cleanup happens when someone views the matrix, not on a schedule. Reduces background processing.

---

### **Step 4: Build Seat Matrix Response**

```java
List<SeatMatrixRespDTO> responseList = new ArrayList<>();

for (TrainCoach coach : physicalCoaches) {  // S1, S2, S3
    String label = coach.getCoachLabel();
    List<SeatRespDTO> coachSeats = new ArrayList<>();

    for (SeatLayout layout : layoutTemplate) {  // Seats 1-72
        String seatKey = label + "-" + layout.getSeatNumber();
        String status;

        // CRITICAL LOGIC: Determine seat status
        if (confirmedBookedSeats.contains(seatKey)) {
            status = "LOCKED"; // Permanently booked
        } else if (activeReservations.containsKey(seatKey)) {
            ReservationInfo reservation = activeReservations.get(seatKey);
            if (reservation.getUserId().equals(userId)) {
                status = "MY_RESERVATION"; // User's own lock
            } else {
                status = "LOCKED"; // Reserved by another user
            }
        } else {
            status = "AVAILABLE"; // Can be selected
        }

        coachSeats.add(new SeatRespDTO(
            layout.getSeatNumber(),
            layout.getSeatType().toString(),
            status
        ));
    }

    responseList.add(new SeatMatrixRespDTO(label, coachSeats));
}
```

---

## 🎨 Frontend Integration

### **Request Example (React/Axios)**

```javascript
const fetchSeatMatrix = async (
  scheduleId,
  coachTypeId,
  sourceStationId,
  destinationStationId,
) => {
  const response = await axios.post(
    "/api/seats/matrix",
    {
      scheduleId,
      coachTypeId,
      sourceStationId,
      destinationStationId,
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    },
  );

  return response.data.data; // List of SeatMatrixRespDTO
};
```

### **Rendering Seat Matrix**

```jsx
const SeatMatrix = ({ seatData }) => {
  return (
    <div>
      {seatData.map((coach) => (
        <div key={coach.coachLabel}>
          <h3>Coach {coach.coachLabel}</h3>
          <div className="seat-grid">
            {coach.seats.map((seat) => (
              <div
                key={seat.seatNumber}
                className={getSeatClass(seat.status)}
                onClick={() => handleSeatClick(seat)}
              >
                {seat.seatNumber}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const getSeatClass = (status) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-500 cursor-pointer hover:bg-green-600";
    case "LOCKED":
      return "bg-gray-400 cursor-not-allowed";
    case "MY_RESERVATION":
      return "bg-blue-500 cursor-pointer border-2 border-blue-700";
    default:
      return "bg-gray-300";
  }
};
```

---

## 🔍 Example Scenario

### **Setup**:

- **Train**: Rajdhani Express (Schedule ID: 101)
- **Route**: Mumbai(1) → Pune(2) → Nagpur(3) → Delhi(4)
- **Coach Type**: Sleeper (ID: 1)
- **Coaches**: S1, S2, S3
- **User**: ID 42, searching Mumbai → Delhi

### **Existing Data**:

**Confirmed Bookings**:

```
Booking 1: User 10, Mumbai → Pune, S1-15
Booking 2: User 20, Pune → Delhi, S1-20
Booking 3: User 30, Mumbai → Delhi, S2-5
```

**Active Reservations**:

```
Reservation 1: User 42, S1-16, expires 14:05
Reservation 2: User 55, S1-17, expires 14:03
```

### **API Call**:

```json
POST /api/seats/matrix
{
  "scheduleId": 101,
  "coachTypeId": 1,
  "sourceStationId": 1,  // Mumbai
  "destinationStationId": 4  // Delhi
}
```

### **Processing**:

**Step 1**: Journey overlap check for User 42 (Mumbai → Delhi)

| Existing Booking        | Overlap? | Reason                       |
| ----------------------- | -------- | ---------------------------- |
| User 10: Mumbai → Pune  | ✅ Yes   | Overlaps Mumbai-Pune segment |
| User 20: Pune → Delhi   | ✅ Yes   | Overlaps Pune-Delhi segment  |
| User 30: Mumbai → Delhi | ✅ Yes   | Exact same journey           |

**Step 2**: Build sets

```java
confirmedBookedSeats = {"S1-15", "S1-20", "S2-5"}
activeReservations = {
  "S1-16" -> ReservationInfo(userId=42),
  "S1-17" -> ReservationInfo(userId=55)
}
```

**Step 3**: Determine status for each seat

| Seat  | In Confirmed? | In Reservations? | User Match? | Status             |
| ----- | ------------- | ---------------- | ----------- | ------------------ |
| S1-15 | ✅ Yes        | ❌ No            | -           | **LOCKED**         |
| S1-16 | ❌ No         | ✅ Yes           | ✅ Yes (42) | **MY_RESERVATION** |
| S1-17 | ❌ No         | ✅ Yes           | ❌ No (55)  | **LOCKED**         |
| S1-18 | ❌ No         | ❌ No            | -           | **AVAILABLE**      |
| S1-20 | ✅ Yes        | ❌ No            | -           | **LOCKED**         |

### **Response**:

```json
{
  "message": "Seat matrix fetched successfully",
  "status": "SUCCESS",
  "data": [
    {
      "coachLabel": "S1",
      "seats": [
        { "seatNumber": 15, "seatType": "LOWER", "status": "LOCKED" },
        { "seatNumber": 16, "seatType": "MIDDLE", "status": "MY_RESERVATION" },
        { "seatNumber": 17, "seatType": "UPPER", "status": "LOCKED" },
        { "seatNumber": 18, "seatType": "SIDE_LOWER", "status": "AVAILABLE" }
        // ... more seats
      ]
    }
  ]
}
```

---

## 🔒 Concurrency Handling

### **Scenario**: Two users view matrix simultaneously

**Timeline**:

```
14:00:00.000 - User A: Requests seat matrix
14:00:00.050 - User B: Requests seat matrix
14:00:00.100 - User A: Sees S1-15 as AVAILABLE
14:00:00.150 - User B: Sees S1-15 as AVAILABLE
14:00:00.200 - User A: Clicks S1-15, reserves it
14:00:00.250 - User B: Clicks S1-15, gets "Seat unavailable"
```

**How It Works**:

1. Both users see same initial state (no locks yet)
2. User A's reservation creates database record
3. User B's reservation attempt fails at database level (race condition check)
4. User B refreshes matrix, sees S1-15 as LOCKED

**Key**: Seat matrix shows current state. Actual locking happens in reserve-seats API with database-level checks.

---

## 📊 Database Tables Involved

| Table               | Purpose                   | Columns Used                                                                  |
| ------------------- | ------------------------- | ----------------------------------------------------------------------------- |
| `train_schedules`   | Train instances           | id, train_id                                                                  |
| `train_coaches`     | Physical coaches          | train_id, coach_type_id, coach_label                                          |
| `seat_layouts`      | Seat arrangement template | coach_type_id, seat_number, seat_type                                         |
| `bookings`          | Confirmed bookings        | schedule_id, coach_type_id, source_station_id, destination_station_id, status |
| `tickets`           | Passenger seats           | booking_id, coach_label, seat_number                                          |
| `seat_reservations` | Temporary locks           | schedule_id, coach_type_id, coach_label, seat_number, user_id, expires_at     |

---

## ⚡ Performance Optimizations

### **1. Single Query for Bookings**

Instead of checking each seat individually, fetch all booked seats in one query.

### **2. In-Memory Processing**

Build HashSet and HashMap in memory for O(1) lookup instead of repeated database queries.

### **3. Lazy Cleanup**

Mark expired reservations only when matrix is viewed, not on a schedule.

### **4. Journey Segment Logic**

Only show seats as booked if they overlap with user's journey, maximizing seat utilization.

### **5. Template Reuse**

Store seat layout once per coach type, not per physical coach.

---

## ✅ Key Takeaways

1. **Real-time Availability**: Shows current seat status including temporary reservations
2. **User-Specific View**: Same seat shows different status to different users (MY_RESERVATION vs LOCKED)
3. **Journey Segment Aware**: Seats can be booked for different journey segments
4. **Concurrent Safe**: Database-level checks prevent race conditions
5. **Efficient**: Single query + in-memory processing for fast response
6. **Scalable**: Works across multiple server instances (stateless)

This API is the **core of the booking experience**, providing users with accurate, real-time seat availability! 🚀
