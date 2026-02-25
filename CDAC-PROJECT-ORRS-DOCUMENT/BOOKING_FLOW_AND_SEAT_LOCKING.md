# 🎫 Complete Booking Flow with Seat Locking Mechanism

## 📋 Overview

The booking system implements a **5-step user journey** with a **temporary seat reservation (locking)** mechanism to prevent race conditions and double-booking in a concurrent environment.

---

## 🔄 Complete Booking Flow

### **Step 1: Train Search**

**Endpoint**: `POST /schedule/search`

**User Action**: Searches for trains between source and destination on a specific date

**Backend Process**:

1. Validates journey date (not past, within 60-day ARP)
2. Resolves station names to IDs
3. Queries database with 4-table JOIN (TrainSchedule, Train, TrainRoute×2)
4. Enriches results with fares and availability per coach type
5. Filters departed trains if searching for today

**Response**: List of available trains with coach options and pricing

---

### **Step 2: Seat Matrix Visualization**

**Endpoint**: `POST /api/seat-matrix`

**User Action**: Selects train and coach type, views seat layout

**Backend Process** (`SeatMatrixServiceImpl.java`):

1. **Fetch Physical Coaches**: Gets coach labels (S1, S2, S3) for selected train and coach type
2. **Fetch Layout Template**: Gets seat arrangement (1-72) with seat types (LOWER, MIDDLE, UPPER, SIDE_LOWER, SIDE_UPPER)
3. **Fetch Confirmed Bookings**: Queries `tickets` table for permanently booked seats
4. **Fetch Active Reservations**: Queries `seat_reservations` table for temporarily locked seats
5. **Lazy Cleanup**: Marks expired reservations as EXPIRED
6. **Build Matrix**: Combines data to show seat status

**Seat Status Logic**:

```java
if (confirmedBookedSeats.contains(seatKey)) {
    status = "LOCKED"; // Permanently booked
} else if (activeReservations.containsKey(seatKey)) {
    if (reservation.userId == currentUserId) {
        status = "MY_RESERVATION"; // User's own lock
    } else {
        status = "LOCKED"; // Reserved by another user
    }
} else {
    status = "AVAILABLE"; // Can be selected
}
```

**Response**: Seat matrix with color-coded availability

---

### **Step 3: Seat Reservation (Locking)**

**Endpoint**: `POST /api/booking/reserve-seats`

**User Action**: Selects seats and clicks "Continue"

**Request Payload**:

```json
{
  "scheduleId": 101,
  "coachTypeId": 1,
  "sourceStationId": 5,
  "destinationStationId": 10,
  "selectedSeats": ["S1-15", "S1-16"],
  "sessionId": "uuid-generated-by-frontend"
}
```

**Backend Process** (`BookingServiceImpl.reserveSeats()`):

#### **3.1 Validation Phase**

```java
// 1. Validate Schedule & User exist
TrainSchedule schedule = scheduleRepository.findById(scheduleId);
User user = userRepository.findById(userId);

// 2. Validate Stations exist
Station source = stationRepository.findById(sourceStationId);
Station destination = stationRepository.findById(destinationStationId);

// 3. Validate Coach Type exists in this train
boolean isValidCoach = coachRepository.existsByTrainIdAndCoachTypeId(trainId, coachTypeId);

// 4. Validate Selected Seats exist in layout
List<SeatLayout> seatLayouts = seatLayoutRepository.findByCoachTypeId(coachTypeId);
// Parse "S1-15" → coachLabel="S1", seatNumber=15
// Check if S1 coach exists and seat 15 is in layout
```

#### **3.2 Availability Check (Race Condition Prevention)**

```java
// Query: Find seats that are ALREADY reserved or booked
List<String> reservedSeats = seatReservationRepository.findReservedSeatsSimple(
    scheduleId, coachTypeId, selectedSeats, currentTime
);

if (!reservedSeats.isEmpty()) {
    return ApiResponseDTO("Some seats are unavailable", "SEAT_UNAVAILABLE",
        new SeatReservationRespDTO(null, null, null, null, "FAILED",
            reservedSeats, alternativeSeats));
}
```

**SQL Query**:

```sql
SELECT CONCAT(sr.coachLabel, '-', sr.seatNumber)
FROM seat_reservations sr
WHERE sr.schedule_id = ?
  AND sr.coach_type_id = ?
  AND CONCAT(sr.coachLabel, '-', sr.seatNumber) IN (?, ?, ...)
  AND sr.expires_at > NOW()
```

**Why This Works**:

- Database-level check ensures atomicity
- `expires_at > NOW()` filters out expired locks
- Returns conflicting seats immediately

#### **3.3 Create Temporary Reservations**

```java
LocalDateTime currentTime = LocalDateTime.now();
LocalDateTime expiryTime = currentTime.plusMinutes(5); // 5-minute timeout

for (String seatId : selectedSeats) {
    String[] parts = seatId.split("-"); // "S1-15" → ["S1", "15"]

    SeatReservation reservation = new SeatReservation();
    reservation.setSchedule(schedule);
    reservation.setCoachType(coachType);
    reservation.setCoachLabel(parts[0]);      // "S1"
    reservation.setSeatNumber(Integer.parseInt(parts[1])); // 15
    reservation.setUser(user);
    reservation.setSessionId(sessionId);
    reservation.setReservedAt(currentTime);
    reservation.setExpiresAt(expiryTime);
    reservation.setStatus("RESERVED");

    reservations.add(reservation);
}

seatReservationRepository.saveAll(reservations);
```

**Database Record**:

```
reservation_id | schedule_id | coach_type_id | coach_label | seat_number | user_id | session_id | reserved_at | expires_at | status
1001          | 101         | 1             | S1          | 15          | 42      | uuid-123   | 14:00:00    | 14:05:00   | RESERVED
1002          | 101         | 1             | S1          | 16          | 42      | uuid-123   | 14:00:00    | 14:05:00   | RESERVED
```

**Response**:

```json
{
  "message": "Seats reserved successfully",
  "status": "SUCCESS",
  "data": {
    "reservationId": 1001,
    "selectedSeats": ["S1-15", "S1-16"],
    "expiresAt": "2024-06-15T14:05:00",
    "timeoutMinutes": 5,
    "status": "SUCCESS"
  }
}
```

---

### **Step 4: Passenger Details & Payment**

**Endpoint**: `POST /api/booking/confirm`

**User Action**: Fills passenger details and confirms payment

**Request Payload**:

```json
{
  "reservationId": 1001,
  "scheduleId": 101,
  "sourceStationId": 5,
  "destStationId": 10,
  "farePerSeat": 742.0,
  "passengers": [
    { "name": "John Doe", "age": 30, "gender": "MALE" },
    { "name": "Jane Doe", "age": 28, "gender": "FEMALE" }
  ]
}
```

**Backend Process** (`BookingServiceImpl.confirmBooking()`):

#### **4.1 Fetch & Validate Reservations**

```java
// 1. Fetch reservation by ID
SeatReservation firstReservation = seatReservationRepository.findById(reservationId);

// 2. Verify ownership
if (!firstReservation.getUser().getId().equals(userId)) {
    throw new BusinessLogicException("Unauthorized access to reservation");
}

// 3. Check expiry
if (firstReservation.getExpiresAt().isBefore(currentTime)) {
    throw new BusinessLogicException("Reservation has expired. Please reserve seats again.");
}

// 4. Get all reservations for this user and schedule
List<SeatReservation> reservations = seatReservationRepository
    .findActiveReservationsByUser(userId, scheduleId, currentTime);
```

#### **4.2 Validate Passenger Count**

```java
if (passengers.size() != reservations.size()) {
    throw new BusinessLogicException(
        "Passenger count (" + passengers.size() +
        ") does not match reserved seats count (" + reservations.size() + ")"
    );
}
```

#### **4.3 Calculate Total Fare**

```java
BigDecimal farePerSeat = reqDTO.getFarePerSeat(); // From frontend
BigDecimal totalFare = farePerSeat.multiply(BigDecimal.valueOf(reservations.size()));
```

#### **4.4 Create Booking (Transaction)**

```java
@Transactional
public ApiResponseDTO<BookingRespDTO> confirmBooking(...) {

    // 1. Create Booking Header
    Booking booking = new Booking();
    booking.setPnrNumber(generatePNR()); // "2024061501"
    booking.setUser(user);
    booking.setSchedule(schedule);
    booking.setCoachType(coachType);
    booking.setSourceStation(sourceStation);
    booking.setDestinationStation(destStation);
    booking.setJourneyDate(schedule.getDepartureDate());
    booking.setTotalFare(totalFare);
    booking.setStatus(BookingStatus.CONFIRMED);

    booking = bookingRepository.save(booking);

    // 2. Create Tickets (Passengers)
    for (int i = 0; i < passengers.size(); i++) {
        PassengerReqDTO passenger = passengers.get(i);
        SeatReservation reservation = reservations.get(i);

        Ticket ticket = new Ticket();
        ticket.setBooking(booking);
        ticket.setPassengerName(passenger.getName());
        ticket.setAge(passenger.getAge());
        ticket.setGender(Gender.valueOf(passenger.getGender()));
        ticket.setCoachLabel(reservation.getCoachLabel());
        ticket.setSeatNumber(reservation.getSeatNumber());
        ticket.setTicketFare(farePerSeat);

        booking.addTicket(ticket); // Cascade save
    }

    // 3. Create Payment Record
    Payment payment = new Payment();
    payment.setUser(user);
    payment.setBooking(booking);
    payment.setTransactionId(generateTransactionId());
    payment.setAmount(totalFare);
    payment.setPaymentMethod(PaymentMethod.UPI);
    payment.setStatus(PaymentStatus.SUCCESS);
    payment.setPaymentDate(LocalDateTime.now());

    booking.addPayment(payment); // Cascade save

    // 4. Save everything (cascading)
    booking = bookingRepository.save(booking);

    // 5. DELETE Reservations (Convert to Booking)
    seatReservationRepository.deleteAll(reservations);

    return new ApiResponseDTO<>("Booking confirmed successfully", "SUCCESS", response);
}
```

**Database State After Confirmation**:

**bookings table**:

```
id | pnr_number  | user_id | schedule_id | coach_type_id | source_station_id | dest_station_id | journey_date | total_fare | status
501| 2024061501  | 42      | 101         | 1             | 5                 | 10              | 2024-06-15   | 1484.00    | CONFIRMED
```

**tickets table**:

```
id  | booking_id | passenger_name | age | gender | coach_label | seat_number | ticket_fare
1   | 501        | John Doe       | 30  | MALE   | S1          | 15          | 742.00
2   | 501        | Jane Doe       | 28  | FEMALE | S1          | 16          | 742.00
```

**payments table**:

```
id | user_id | booking_id | transaction_id | amount  | payment_method | status  | payment_date
1  | 42      | 501        | TXN1718456789  | 1484.00 | UPI            | SUCCESS | 2024-06-15 14:04:30
```

**seat_reservations table**:

```
(Records DELETED - converted to permanent booking)
```

---

### **Step 5: Booking Confirmation**

**User Action**: Views PNR, ticket details, and journey information

**Response**:

```json
{
  "pnrNumber": "2024061501",
  "status": "CONFIRMED",
  "totalFare": 1484.0,
  "journeyDate": "2024-06-15",
  "trainDetails": {
    "trainNumber": "12301",
    "trainName": "Rajdhani Express",
    "sourceStation": "Mumbai Central",
    "destinationStation": "New Delhi",
    "coachType": "Sleeper"
  },
  "passengers": [
    {
      "name": "John Doe",
      "age": 30,
      "gender": "MALE",
      "seatNumber": "S1-15",
      "status": "CONFIRMED",
      "fare": 742.0
    },
    {
      "name": "Jane Doe",
      "age": 28,
      "gender": "FEMALE",
      "seatNumber": "S1-16",
      "status": "CONFIRMED",
      "fare": 742.0
    }
  ]
}
```

---

## 🔒 Seat Locking Strategies Comparison

### **Strategy 1: Database-Level Locking (Current Implementation)**

**How It Works**:

- Create temporary records in `seat_reservations` table
- Set `expires_at` timestamp (5 minutes from now)
- Query checks `expires_at > NOW()` to filter active locks

**Advantages**:
✅ **Persistent**: Survives server restarts  
✅ **Distributed**: Works across multiple server instances  
✅ **Simple**: No external dependencies  
✅ **Auditable**: Full history of reservations  
✅ **Lazy Cleanup**: Expired locks ignored automatically

**Disadvantages**:
❌ **Database Load**: Extra table and queries  
❌ **Manual Cleanup**: Need cron job to delete expired records  
❌ **Storage**: Accumulates records over time

**Best For**: Production systems with multiple servers

---

### **Strategy 2: Redis-Based Locking (Alternative)**

**How It Works**:

```java
// Reserve seat
redisTemplate.opsForValue().set(
    "seat:lock:101:S1-15",
    userId,
    5, TimeUnit.MINUTES
);

// Check availability
String lockedBy = redisTemplate.opsForValue().get("seat:lock:101:S1-15");
if (lockedBy != null && !lockedBy.equals(userId)) {
    return "LOCKED";
}
```

**Advantages**:
✅ **Fast**: In-memory operations  
✅ **Auto-Expiry**: TTL handles cleanup automatically  
✅ **Low Database Load**: No extra table  
✅ **Scalable**: Designed for high concurrency

**Disadvantages**:
❌ **External Dependency**: Requires Redis server  
❌ **Volatile**: Lost on Redis restart (unless persistence enabled)  
❌ **No History**: Can't audit past reservations  
❌ **Complexity**: Additional infrastructure

**Best For**: High-traffic systems with Redis already in use

---

### **Strategy 3: Optimistic Locking (Alternative)**

**How It Works**:

```java
@Entity
public class Seat {
    @Version
    private Long version;

    private String status; // AVAILABLE, BOOKED
}

// On booking
Seat seat = seatRepository.findById(seatId);
seat.setStatus("BOOKED");
seatRepository.save(seat); // Throws OptimisticLockException if version changed
```

**Advantages**:
✅ **No Locks**: No temporary reservation needed  
✅ **Simple**: Built into JPA  
✅ **Low Overhead**: No extra table

**Disadvantages**:
❌ **No Timeout**: Can't hold seat for 5 minutes  
❌ **Poor UX**: User fills form, then booking fails  
❌ **Race Condition**: Multiple users compete at payment step

**Best For**: Low-traffic systems or non-critical bookings

---

### **Strategy 4: Pessimistic Locking (Alternative)**

**How It Works**:

```java
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT s FROM Seat s WHERE s.id = :id")
Seat findByIdWithLock(@Param("id") Long id);

// Holds database row lock until transaction commits
```

**Advantages**:
✅ **Strong Consistency**: Guaranteed no conflicts  
✅ **Built-in**: No external tools

**Disadvantages**:
❌ **Blocking**: Other users wait for lock release  
❌ **Deadlock Risk**: Can cause database deadlocks  
❌ **No Timeout**: Can't hold for 5 minutes (transaction too long)  
❌ **Poor Scalability**: Serializes all bookings

**Best For**: Single-server systems with low concurrency

---

## 🎯 Why Database-Level Locking Was Chosen

| Requirement          | Database Locking | Redis | Optimistic | Pessimistic |
| -------------------- | ---------------- | ----- | ---------- | ----------- |
| Multi-server support | ✅               | ✅    | ✅         | ✅          |
| 5-minute timeout     | ✅               | ✅    | ❌         | ❌          |
| Survives restart     | ✅               | ⚠️    | ✅         | ✅          |
| No external deps     | ✅               | ❌    | ✅         | ✅          |
| Audit trail          | ✅               | ❌    | ❌         | ❌          |
| Good UX              | ✅               | ✅    | ❌         | ❌          |
| High concurrency     | ✅               | ✅    | ⚠️         | ❌          |

**Decision**: Database-level locking provides the best balance of reliability, simplicity, and user experience without requiring additional infrastructure.

---

## 🔄 Race Condition Prevention

### **Scenario**: Two users select same seat simultaneously

**Timeline**:

```
14:00:00.000 - User A: Clicks "S1-15"
14:00:00.050 - User B: Clicks "S1-15"
14:00:00.100 - User A: POST /reserve-seats
14:00:00.150 - User B: POST /reserve-seats
```

**What Happens**:

1. **User A's Request** (14:00:00.100):

   ```sql
   -- Check availability
   SELECT * FROM seat_reservations
   WHERE schedule_id = 101 AND seat = 'S1-15' AND expires_at > NOW();
   -- Result: Empty (seat available)

   -- Create reservation
   INSERT INTO seat_reservations (...) VALUES (...);
   -- Success: User A locks S1-15
   ```

2. **User B's Request** (14:00:00.150):

   ```sql
   -- Check availability
   SELECT * FROM seat_reservations
   WHERE schedule_id = 101 AND seat = 'S1-15' AND expires_at > NOW();
   -- Result: Found User A's reservation

   -- Return error
   return "SEAT_UNAVAILABLE";
   ```

**Result**: User A gets the seat, User B sees "Seat unavailable" with alternative suggestions.

---

## 🧹 Cleanup Mechanisms

### **1. Lazy Cleanup (Current)**

**Where**: `SeatMatrixServiceImpl.getSeatMatrix()`

```java
if (expiresAt.isBefore(currentTime)) {
    expiredReservationIds.add(reservationId);
}

// Mark as expired
for (Long expiredId : expiredReservationIds) {
    seatReservationRepository.markAsExpired(expiredId);
}
```

**Trigger**: When user views seat matrix  
**Advantage**: No background job needed  
**Disadvantage**: Expired records remain until next seat matrix view

---

### **2. Scheduled Cleanup (Recommended Addition)**

```java
@Component
public class ReservationCleanupScheduler {

    @Scheduled(fixedRate = 60000) // Every 1 minute
    public void cleanupExpiredReservations() {
        LocalDateTime now = LocalDateTime.now();

        // Delete expired reservations
        int deleted = seatReservationRepository.deleteExpiredReservations(now);

        log.info("Cleaned up {} expired reservations", deleted);
    }
}
```

**Repository Method**:

```java
@Modifying
@Query("DELETE FROM SeatReservation sr WHERE sr.expiresAt < :currentTime")
int deleteExpiredReservations(@Param("currentTime") LocalDateTime currentTime);
```

**Advantage**: Keeps table clean  
**Disadvantage**: Adds background processing

---

## 📊 Database Schema

### **seat_reservations** (Temporary Locks)

```sql
CREATE TABLE seat_reservations (
    reservation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    schedule_id BIGINT NOT NULL,
    coach_type_id BIGINT NOT NULL,
    coach_label VARCHAR(10) NOT NULL,
    seat_number INT NOT NULL,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(100),
    reserved_at DATETIME NOT NULL,
    expires_at DATETIME NOT NULL,
    status VARCHAR(20) DEFAULT 'RESERVED',
    created_on DATETIME,
    last_updated DATETIME,

    FOREIGN KEY (schedule_id) REFERENCES train_schedules(id),
    FOREIGN KEY (coach_type_id) REFERENCES coach_types(id),
    FOREIGN KEY (user_id) REFERENCES users(id),

    INDEX idx_expires_at (expires_at),
    INDEX idx_schedule_coach (schedule_id, coach_type_id)
);
```

### **bookings** (Permanent Records)

```sql
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    pnr_number VARCHAR(10) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    schedule_id BIGINT NOT NULL,
    coach_type_id BIGINT NOT NULL,
    source_station_id BIGINT NOT NULL,
    destination_station_id BIGINT NOT NULL,
    journey_date DATE NOT NULL,
    total_fare DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_on DATETIME,
    last_updated DATETIME,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (schedule_id) REFERENCES train_schedules(id),

    INDEX idx_pnr (pnr_number),
    INDEX idx_user_date (user_id, journey_date)
);
```

---

## ✅ Key Takeaways

1. **5-Minute Timeout**: Balances user convenience and seat availability
2. **Database Locking**: Reliable, persistent, and distributed-system friendly
3. **Race Condition Prevention**: Database-level checks ensure atomicity
4. **Transaction Management**: @Transactional ensures booking consistency
5. **Lazy Cleanup**: Expired locks ignored automatically in queries
6. **Cascade Delete**: Reservations deleted when converted to bookings
7. **User Ownership**: Only reservation owner can confirm booking
8. **Expiry Validation**: Prevents booking with expired reservations

This architecture ensures **reliable, concurrent, and user-friendly** ticket booking.
