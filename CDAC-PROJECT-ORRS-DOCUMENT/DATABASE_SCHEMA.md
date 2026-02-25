# 🗄️ ORRS Database Schema Documentation

## 📋 Table of Contents
1. [Base Entity](#base-entity)
2. [User Management](#user-management)
3. [Station & Train Master Data](#station--train-master-data)
4. [Train Configuration](#train-configuration)
5. [Scheduling & Booking](#scheduling--booking)
6. [Payment & Tickets](#payment--tickets)

---

## 🔹 Base Entity

All tables inherit these common fields from `BaseEntity`:

| Field | Type | Description |
|-------|------|-------------|
| **id** | BIGINT (PK) | Auto-increment primary key (renamed per table) |
| **created_on** | DATE | Timestamp when record was created |
| **last_updated** | DATE | Timestamp when record was last modified |

---

## 👤 User Management

### **1. users**
Stores user account information for customers and admins.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **user_id** | BIGINT (PK) | Auto-increment | Primary key |
| **full_name** | VARCHAR(50) | NOT NULL | User's full name |
| **email** | VARCHAR(60) | UNIQUE, NOT NULL | Login email |
| **password** | VARCHAR(100) | NOT NULL | Encrypted password |
| **mobile** | VARCHAR(12) | UNIQUE, NOT NULL | Contact number |
| **gender** | ENUM | - | MALE, FEMALE, OTHER |
| **dob** | DATE | - | Date of birth |
| **address** | TEXT | - | Residential address |
| **aadhar_no** | VARCHAR(12) | UNIQUE | Government ID |
| **role** | ENUM | Default: ROLE_CUSTOMER | ROLE_CUSTOMER, ROLE_ADMIN |
| **account_status** | ENUM | Default: ACTIVE | ACTIVE, SUSPENDED, DELETED |
| **prefered_class** | ENUM | - | Preferred coach type |
| **is_email_verified** | BOOLEAN | - | Email verification status |

---

### **2. saved_passengers**
Stores frequently used passenger details for quick booking.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **id** | BIGINT (PK) | Auto-increment | Primary key |
| **user_id** | BIGINT (FK) | NOT NULL | References users(user_id) |
| **name** | VARCHAR(100) | NOT NULL | Passenger name |
| **age** | INT | NOT NULL | Passenger age |
| **gender** | ENUM | - | MALE, FEMALE, OTHER |
| **preferred_berth** | VARCHAR(20) | - | LOWER, MIDDLE, UPPER, SIDE_LOWER, SIDE_UPPER |

---

## 🚉 Station & Train Master Data

### **3. stations**
Master table for all railway stations.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **station_id** | BIGINT (PK) | Auto-increment | Primary key |
| **station_code** | VARCHAR(10) | NOT NULL | Unique station code (e.g., NDLS, CSTM) |
| **station_name** | VARCHAR(100) | NOT NULL | Full station name |
| **city** | VARCHAR(100) | - | City name |
| **state** | VARCHAR(100) | - | State name |
| **zone** | VARCHAR(50) | - | Railway zone (e.g., Western, Central) |
| **platforms** | INT | - | Number of platforms |
| **status** | ENUM | Default: ACTIVE | ACTIVE, INACTIVE, UNDER_MAINTENANCE |

---

### **4. trains**
Master table for train information.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **train_id** | BIGINT (PK) | Auto-increment | Primary key |
| **train_number** | VARCHAR(10) | UNIQUE, NOT NULL | Official train number (e.g., 12301) |
| **train_name** | VARCHAR(100) | NOT NULL | Train name (e.g., Rajdhani Express) |
| **train_type** | ENUM | - | EXPRESS, SUPERFAST, PASSENGER, MAIL, VANDE_BHARAT |
| **source_station_id** | BIGINT (FK) | - | References stations(station_id) - Origin |
| **destination_station_id** | BIGINT (FK) | - | References stations(station_id) - Terminus |
| **total_distance_km** | INT | - | Total journey distance |
| **avg_speed** | INT | - | Average speed in km/h |
| **days_of_run** | VARCHAR(50) | - | Running days (e.g., "Mon,Wed,Fri" or "DAILY") |
| **train_active_status** | ENUM | Default: ACTIVE | ACTIVE, INACTIVE, UNDER_MAINTENANCE |

---

### **5. train_routes**
Defines all stations a train stops at with sequence and timing.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **train_route_id** | BIGINT (PK) | Auto-increment | Primary key |
| **train_id** | BIGINT (FK) | NOT NULL | References trains(train_id) |
| **station_id** | BIGINT (FK) | NOT NULL | References stations(station_id) |
| **sequence_no** | INT | NOT NULL | Stop sequence (1, 2, 3...) |
| **arrival_time** | TIME | - | Scheduled arrival time |
| **departure_time** | TIME | - | Scheduled departure time |
| **halt_minutes** | INT | - | Stop duration in minutes |
| **distance_from_source** | INT | - | Distance from origin in km |
| **day_number** | INT | Default: 1 | Journey day (1 for same day, 2 for next day) |
| **is_major_station** | BOOLEAN | Default: false | Major station flag for UI filtering |
| **stop_type** | ENUM | Default: REGULAR | REGULAR, TECHNICAL (non-bookable) |

**Unique Constraints:**
- (train_id, sequence_no) - No duplicate sequences
- (train_id, station_id) - Train can't visit same station twice

---

## 🚂 Train Configuration

### **6. coach_types**
Master table for coach/class types.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **coach_type_id** | BIGINT (PK) | Auto-increment | Primary key |
| **type_code** | VARCHAR(20) | UNIQUE, NOT NULL | Short code (e.g., SL, 3A, 2A, 1A) |
| **type_name** | VARCHAR(100) | NOT NULL | Full name (e.g., Sleeper Class, AC 3-Tier) |
| **total_seats** | INT | NOT NULL | Standard seats per coach (e.g., 72 for SL) |
| **coach_image_url** | VARCHAR(255) | - | Image URL for UI |
| **description** | TEXT | - | Coach amenities description |

---

### **7. train_coaches**
Links trains to their available coach types with labels.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **coach_id** | BIGINT (PK) | Auto-increment | Primary key |
| **train_id** | BIGINT (FK) | NOT NULL | References trains(train_id) |
| **coach_type_id** | BIGINT (FK) | NOT NULL | References coach_types(coach_type_id) |
| **coach_label** | VARCHAR(10) | NOT NULL | Coach identifier (e.g., S1, S2, B1, B2) |
| **sequence_in_train** | INT | NOT NULL | Physical position in train |
| **is_active** | BOOLEAN | Default: true | Active status |
| **is_deleted** | BOOLEAN | Default: false | Soft delete flag |

---

### **8. seat_layouts**
Defines seat numbers and types for each coach type.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **seat_layout_id** | BIGINT (PK) | Auto-increment | Primary key |
| **coach_type_id** | BIGINT (FK) | NOT NULL | References coach_types(coach_type_id) |
| **seat_number** | INT | NOT NULL | Seat number (1-72) |
| **seat_type** | ENUM | - | LOWER, MIDDLE, UPPER, SIDE_LOWER, SIDE_UPPER |

**Unique Constraint:** (coach_type_id, seat_number)

---

### **9. train_fares**
Pricing configuration for each train and coach type.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **fare_id** | BIGINT (PK) | Auto-increment | Primary key |
| **train_id** | BIGINT (FK) | NOT NULL | References trains(train_id) |
| **coach_type_id** | BIGINT (FK) | NOT NULL | References coach_types(coach_type_id) |
| **rate_per_km** | DECIMAL(10,2) | NOT NULL | Price per kilometer |
| **base_fare** | DECIMAL(10,2) | Default: 50.00 | Minimum fare |
| **is_active** | BOOLEAN | Default: true | Active status |
| **is_deleted** | BOOLEAN | Default: false | Soft delete flag |

**Unique Constraint:** (train_id, coach_type_id)

**Fare Calculation:** `Total Fare = base_fare + (distance × rate_per_km)`

---

## 📅 Scheduling & Booking

### **10. train_schedules**
Daily instances of trains (enables date-specific booking).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **id** | BIGINT (PK) | Auto-increment | Primary key |
| **train_id** | BIGINT (FK) | NOT NULL | References trains(train_id) |
| **departure_date** | DATE | NOT NULL | Journey date |
| **status** | ENUM | Default: RUNNING | RUNNING, CANCELLED, RESCHEDULED, DELAYED |
| **actual_departure_time** | DATETIME | - | Actual departure (for delay tracking) |
| **actual_arrival_time** | DATETIME | - | Actual arrival |
| **delay_reason** | TEXT | - | Reason for delay/cancellation |
| **remarks** | TEXT | - | Additional notes |

**Unique Constraint:** (train_id, departure_date) - One schedule per train per day

**Purpose:** Cron job creates schedules 60 days in advance daily at 12:01 AM

---

### **11. seat_reservations**
Temporary seat locks during booking process (5-minute timeout).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **reservation_id** | BIGINT (PK) | Auto-increment | Primary key |
| **schedule_id** | BIGINT (FK) | NOT NULL | References train_schedules(id) |
| **coach_type_id** | BIGINT (FK) | NOT NULL | References coach_types(coach_type_id) |
| **coach_label** | VARCHAR(10) | NOT NULL | Coach identifier (e.g., S1) |
| **seat_number** | INT | NOT NULL | Seat number (1-72) |
| **user_id** | BIGINT (FK) | NOT NULL | References users(user_id) |
| **session_id** | VARCHAR(100) | - | Client-generated UUID for multi-tab isolation |
| **reserved_at** | DATETIME | NOT NULL | Reservation timestamp |
| **expires_at** | DATETIME | NOT NULL | Expiry timestamp (reserved_at + 5 minutes) |
| **status** | VARCHAR(20) | Default: RESERVED | RESERVED, CONFIRMED, EXPIRED |

**Purpose:** Prevents double booking during payment process. Auto-expires after 5 minutes.

---

### **12. bookings**
Confirmed booking header (one per PNR).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **booking_id** | BIGINT (PK) | Auto-increment | Primary key |
| **pnr_number** | VARCHAR(20) | UNIQUE, NOT NULL | 10-digit PNR (Format: MMDDMMSSXX) |
| **user_id** | BIGINT (FK) | NOT NULL | References users(user_id) |
| **schedule_id** | BIGINT (FK) | NOT NULL | References train_schedules(id) |
| **coach_type_id** | BIGINT (FK) | NOT NULL | References coach_types(coach_type_id) |
| **source_station_id** | BIGINT (FK) | NOT NULL | References stations(station_id) |
| **destination_station_id** | BIGINT (FK) | NOT NULL | References stations(station_id) |
| **journey_date** | DATE | NOT NULL | Journey date (redundant for quick queries) |
| **total_fare** | DECIMAL(10,2) | NOT NULL | Total booking amount |
| **status** | ENUM | Default: CONFIRMED | CONFIRMED, CANCELLED, PARTIALLY_CANCELLED |
| **booking_type** | ENUM | Default: INDIVIDUAL | INDIVIDUAL, TATKAL, PREMIUM |
| **booking_date** | DATETIME | Default: NOW() | Booking timestamp |

**Relationships:**
- One booking → Many tickets (passengers)
- One booking → Many payments (for refunds)

---

## 💳 Payment & Tickets

### **13. tickets**
Individual passenger tickets (one per passenger per booking).

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **ticket_id** | BIGINT (PK) | Auto-increment | Primary key |
| **booking_id** | BIGINT (FK) | NOT NULL | References bookings(booking_id) |
| **passenger_name** | VARCHAR(100) | NOT NULL | Passenger name |
| **age** | INT | NOT NULL | Passenger age |
| **gender** | ENUM | - | MALE, FEMALE, OTHER |
| **coach_label** | VARCHAR(10) | - | Assigned coach (e.g., S1) |
| **seat_number** | INT | - | Assigned seat (1-72) |
| **status** | VARCHAR(20) | Default: CONFIRMED | CONFIRMED, CANCELLED, RAC, WAITLIST |
| **ticket_fare** | DECIMAL(10,2) | - | Individual ticket fare |

**Purpose:** Stores passenger-specific data. Supports partial cancellations.

---

### **14. payments**
Payment transaction records.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| **payment_id** | BIGINT (PK) | Auto-increment | Primary key |
| **user_id** | BIGINT (FK) | NOT NULL | References users(user_id) |
| **booking_id** | BIGINT (FK) | NOT NULL | References bookings(booking_id) |
| **transaction_id** | VARCHAR(50) | UNIQUE, NOT NULL | Payment gateway transaction ID |
| **amount** | DECIMAL(10,2) | NOT NULL | Payment amount |
| **payment_method** | ENUM | NOT NULL | UPI, CREDIT_CARD, DEBIT_CARD, NET_BANKING |
| **payment_status** | ENUM | NOT NULL | SUCCESS, FAILED, PENDING, REFUNDED |
| **payment_date** | DATETIME | Default: NOW() | Payment timestamp |
| **gateway_response** | VARCHAR(500) | - | Payment gateway response |
| **refund_amount** | DECIMAL(10,2) | Default: 0.00 | Refund amount (if any) |
| **refund_date** | DATETIME | - | Refund timestamp |

**Purpose:** Tracks all payment transactions including refunds.

---

## 🔗 Entity Relationships

### **One-to-Many Relationships**

```
users (1) ──→ (N) bookings
users (1) ──→ (N) payments
users (1) ──→ (N) seat_reservations
users (1) ──→ (N) saved_passengers

trains (1) ──→ (N) train_schedules
trains (1) ──→ (N) train_routes
trains (1) ──→ (N) train_coaches
trains (1) ──→ (N) train_fares

train_schedules (1) ──→ (N) bookings
train_schedules (1) ──→ (N) seat_reservations

bookings (1) ──→ (N) tickets
bookings (1) ──→ (N) payments

coach_types (1) ──→ (N) seat_layouts
coach_types (1) ──→ (N) train_coaches
coach_types (1) ──→ (N) train_fares

stations (1) ──→ (N) train_routes
```

---

## 📊 Key Design Patterns

### **1. Normalization (3NF)**
- **bookings** (header) + **tickets** (line items) prevents data duplication
- One booking can have multiple passengers without repeating booking details

### **2. Soft Deletes**
- Tables like `train_coaches`, `train_fares` use `is_deleted` flag
- Preserves historical data for auditing

### **3. Temporal Data**
- **train_schedules** separates train master data from daily instances
- Enables date-specific operations (cancellations, delays)

### **4. Seat Locking**
- **seat_reservations** provides optimistic concurrency control
- 5-minute timeout prevents indefinite locks

### **5. Journey Segments**
- **train_routes** with `sequence_no` enables segment-based booking
- Same seat can be booked for different journey segments

---

## 🎯 Critical Queries

### **Seat Availability Check**
```sql
-- Check if seat is available for journey segment
SELECT COUNT(*) FROM tickets t
JOIN bookings b ON t.booking_id = b.booking_id
JOIN train_routes src ON b.schedule_id = src.train_id
JOIN train_routes dest ON b.schedule_id = dest.train_id
WHERE b.schedule_id = ? 
  AND t.coach_label = ? 
  AND t.seat_number = ?
  AND src.sequence_no < dest.sequence_no
  AND b.status = 'CONFIRMED'
```

### **Train Search**
```sql
-- Find available trains between stations on date
SELECT ts.*, t.*, srcRoute.*, destRoute.*
FROM train_schedules ts
JOIN trains t ON ts.train_id = t.id
JOIN train_routes srcRoute ON t.id = srcRoute.train_id
JOIN train_routes destRoute ON t.id = destRoute.train_id
WHERE srcRoute.station_id = ?
  AND destRoute.station_id = ?
  AND srcRoute.sequence_no < destRoute.sequence_no
  AND ts.departure_date = ?
  AND ts.status = 'RUNNING'
```

---

## 📝 Summary

**Total Tables:** 14

**Core Modules:**
- User Management: 2 tables
- Station & Train Master: 3 tables
- Train Configuration: 4 tables
- Scheduling & Booking: 3 tables
- Payment & Tickets: 2 tables

**Key Features:**
- ✅ Multi-tenant user system
- ✅ Dynamic train scheduling (60-day advance)
- ✅ Seat-level booking with locking
- ✅ Journey segment support
- ✅ Payment tracking with refunds
- ✅ Soft deletes for audit trail
- ✅ Normalized design (3NF)
