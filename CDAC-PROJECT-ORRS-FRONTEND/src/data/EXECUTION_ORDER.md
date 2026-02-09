# SQL Execution Order Guide

## Issue Resolution
The foreign key constraint error occurs because child records are being inserted before their parent records exist.

## Correct Execution Order

### 1. First, insert all independent tables (no foreign keys):
```sql
-- Insert stations first
INSERT INTO stations (...) VALUES (...);

-- Insert coach types
INSERT INTO coach_types (...) VALUES (...);

-- Insert users (independent)
INSERT INTO users (...) VALUES (...);
```

### 2. Then insert tables with foreign keys to the above:
```sql
-- Insert trains (depends on stations)
INSERT INTO trains (...) VALUES (...);

-- Insert train coaches (depends on trains and coach_types)
INSERT INTO train_coaches (...) VALUES (...);

-- Insert train routes (depends on trains and stations)
INSERT INTO train_routes (...) VALUES (...);

-- Insert train fares (depends on trains and coach_types)
INSERT INTO train_fares (...) VALUES (...);

-- Insert seat layouts (depends on coach_types)
INSERT INTO seat_layouts (...) VALUES (...);

-- Insert train schedules (depends on trains)
INSERT INTO train_schedules (...) VALUES (...);
```

### 3. Finally, insert booking-related tables:
```sql
-- Insert bookings (depends on users, train_schedules, coach_types, stations)
INSERT INTO bookings (...) VALUES (...);

-- Insert tickets (depends on bookings)
INSERT INTO tickets (...) VALUES (...);

-- Insert payments (depends on users and bookings)
INSERT INTO payments (...) VALUES (...);

-- Insert seat reservations (depends on train_schedules, coach_types, users)
INSERT INTO seat_reservations (...) VALUES (...);
```

## Debugging Steps

1. **Check if bookings were inserted successfully:**
   ```sql
   SELECT * FROM bookings;
   ```

2. **Check foreign key constraints:**
   ```sql
   SHOW CREATE TABLE tickets;
   ```

3. **Verify booking_id exists before inserting tickets:**
   ```sql
   SELECT booking_id FROM bookings WHERE booking_id IN (1,2,3,4,5,6);
   ```

## Common Issues

1. **Bookings not inserted**: Run the bookings INSERT statement first
2. **Schedule IDs don't exist**: Make sure train_schedules are inserted
3. **User IDs don't exist**: Make sure users are inserted
4. **Coach type IDs don't exist**: Make sure coach_types are inserted

## Quick Fix
If you're getting foreign key errors, run this query to check what's missing:
```sql
-- Check which booking_ids are missing
SELECT 1 AS booking_id WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE booking_id = 1)
UNION ALL
SELECT 2 AS booking_id WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE booking_id = 2)
UNION ALL
SELECT 3 AS booking_id WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE booking_id = 3)
UNION ALL
SELECT 4 AS booking_id WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE booking_id = 4)
UNION ALL
SELECT 5 AS booking_id WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE booking_id = 5)
UNION ALL
SELECT 6 AS booking_id WHERE NOT EXISTS (SELECT 1 FROM bookings WHERE booking_id = 6);
```