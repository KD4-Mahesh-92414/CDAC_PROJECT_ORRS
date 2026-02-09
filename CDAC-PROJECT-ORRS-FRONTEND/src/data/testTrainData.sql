-- ORRS Test Data - 6 Comprehensive Train Records with All Connected Data
-- Based on Backend Entity Structure
-- 
-- EXECUTION ORDER:
-- 1. Run all CREATE TABLE statements first (if not already created)
-- 2. Execute this file in the exact order shown below
-- 3. Foreign key constraints require parent records to exist before child records

-- =====================================================
-- STATIONS DATA (Must be inserted first)
-- =====================================================
INSERT INTO stations (station_id, station_code, station_name, city, state, zone, platforms, status, created_on, last_updated) VALUES
(1, 'CSMT', 'Chhatrapati Shivaji Maharaj Terminus', 'Mumbai', 'Maharashtra', 'Central Railway', 18, 'ACTIVE', NOW(), NOW()),
(2, 'NDLS', 'New Delhi', 'New Delhi', 'Delhi', 'Northern Railway', 16, 'ACTIVE', NOW(), NOW()),
(3, 'BPL', 'Bhopal Junction', 'Bhopal', 'Madhya Pradesh', 'West Central Railway', 6, 'ACTIVE', NOW(), NOW()),
(4, 'JBP', 'Jabalpur Junction', 'Jabalpur', 'Madhya Pradesh', 'West Central Railway', 6, 'ACTIVE', NOW(), NOW()),
(5, 'PUNE', 'Pune Junction', 'Pune', 'Maharashtra', 'Central Railway', 6, 'ACTIVE', NOW(), NOW()),
(6, 'BLR', 'Bangalore City Junction', 'Bangalore', 'Karnataka', 'South Western Railway', 10, 'ACTIVE', NOW(), NOW()),
(7, 'HYB', 'Hyderabad Deccan', 'Hyderabad', 'Telangana', 'South Central Railway', 8, 'ACTIVE', NOW(), NOW()),
(8, 'CSTM', 'Mumbai Central', 'Mumbai', 'Maharashtra', 'Western Railway', 9, 'ACTIVE', NOW(), NOW()),
(9, 'ADI', 'Ahmedabad Junction', 'Ahmedabad', 'Gujarat', 'Western Railway', 12, 'ACTIVE', NOW(), NOW()),
(10, 'JP', 'Jaipur Junction', 'Jaipur', 'Rajasthan', 'North Western Railway', 5, 'ACTIVE', NOW(), NOW());

-- =====================================================
-- COACH TYPES DATA
-- =====================================================
INSERT INTO coach_types (coach_type_id, type_code, type_name, total_seats, coach_image_url, description, created_on, last_updated) VALUES
(1, 'SL', 'Sleeper Class', 72, '/images/coaches/sleeper-layout.png', 'Non-AC sleeper class with open windows', NOW(), NOW()),
(2, '3A', 'AC 3 Tier', 64, '/images/coaches/3ac-layout.png', 'Air conditioned 3-tier sleeper with curtains', NOW(), NOW()),
(3, '2A', 'AC 2 Tier', 48, '/images/coaches/2ac-layout.png', 'Air conditioned 2-tier sleeper with privacy', NOW(), NOW()),
(4, '1A', 'AC First Class', 24, '/images/coaches/1ac-layout.png', 'Luxury air conditioned compartments', NOW(), NOW()),
(5, 'CC', 'Chair Car', 78, '/images/coaches/cc-layout.png', 'Air conditioned chair car for day travel', NOW(), NOW()),
(6, 'EC', 'Executive Chair Car', 56, '/images/coaches/ec-layout.png', 'Premium air conditioned chair car', NOW(), NOW());

-- =====================================================
-- TRAINS DATA
-- =====================================================
INSERT INTO trains (train_id, train_number, train_name, train_type, source_station_id, destination_station_id, total_distance_km, avg_speed, days_of_run, train_active_status, created_on, last_updated) VALUES
(1, '12137', 'Punjab Mail', 'SUPERFAST', 1, 2, 1384, 65, 'Daily', 'ACTIVE', NOW(), NOW()),
(2, '12627', 'Karnataka Express', 'EXPRESS', 2, 6, 2444, 55, 'Daily', 'ACTIVE', NOW(), NOW()),
(3, '20926', 'Vande Bharat Express', 'VANDE_BHARAT', 2, 3, 707, 85, 'Mon,Tue,Wed,Thu,Fri,Sat', 'ACTIVE', NOW(), NOW()),
(4, '19019', 'Dehradun Express', 'EXPRESS', 8, 2, 1384, 60, 'Daily', 'ACTIVE', NOW(), NOW()),
(5, '12002', 'New Delhi Shatabdi Express', 'SHATABDI', 2, 3, 707, 75, 'Mon,Tue,Wed,Thu,Fri,Sat', 'ACTIVE', NOW(), NOW()),
(6, '11077', 'Jhelum Express', 'EXPRESS', 5, 2, 1527, 58, 'Daily', 'ACTIVE', NOW(), NOW());

-- =====================================================
-- TRAIN COACHES DATA
-- =====================================================
-- Train 1: Punjab Mail (12137)
INSERT INTO train_coaches (coach_id, train_id, coach_type_id, coach_label, sequence_in_train, is_active, is_deleted, created_on, last_updated) VALUES
(1, 1, 1, 'S1', 1, true, false, NOW(), NOW()),
(2, 1, 1, 'S2', 2, true, false, NOW(), NOW()),
(3, 1, 2, 'B1', 3, true, false, NOW(), NOW()),
(4, 1, 3, 'A1', 4, true, false, NOW(), NOW());

-- Train 2: Karnataka Express (12627)
INSERT INTO train_coaches (coach_id, train_id, coach_type_id, coach_label, sequence_in_train, is_active, is_deleted, created_on, last_updated) VALUES
(5, 2, 1, 'S1', 1, true, false, NOW(), NOW()),
(6, 2, 1, 'S2', 2, true, false, NOW(), NOW()),
(7, 2, 1, 'S3', 3, true, false, NOW(), NOW()),
(8, 2, 2, 'B1', 4, true, false, NOW(), NOW()),
(9, 2, 2, 'B2', 5, true, false, NOW(), NOW()),
(10, 2, 3, 'A1', 6, true, false, NOW(), NOW());

-- Train 3: Vande Bharat Express (20926)
INSERT INTO train_coaches (coach_id, train_id, coach_type_id, coach_label, sequence_in_train, is_active, is_deleted, created_on, last_updated) VALUES
(11, 3, 5, 'C1', 1, true, false, NOW(), NOW()),
(12, 3, 5, 'C2', 2, true, false, NOW(), NOW()),
(13, 3, 5, 'C3', 3, true, false, NOW(), NOW()),
(14, 3, 6, 'E1', 4, true, false, NOW(), NOW());

-- Train 4: Dehradun Express (19019)
INSERT INTO train_coaches (coach_id, train_id, coach_type_id, coach_label, sequence_in_train, is_active, is_deleted, created_on, last_updated) VALUES
(15, 4, 1, 'S1', 1, true, false, NOW(), NOW()),
(16, 4, 1, 'S2', 2, true, false, NOW(), NOW()),
(17, 4, 2, 'B1', 3, true, false, NOW(), NOW()),
(18, 4, 3, 'A1', 4, true, false, NOW(), NOW()),
(19, 4, 4, 'H1', 5, true, false, NOW(), NOW());

-- Train 5: New Delhi Shatabdi Express (12002)
INSERT INTO train_coaches (coach_id, train_id, coach_type_id, coach_label, sequence_in_train, is_active, is_deleted, created_on, last_updated) VALUES
(20, 5, 5, 'C1', 1, true, false, NOW(), NOW()),
(21, 5, 5, 'C2', 2, true, false, NOW(), NOW()),
(22, 5, 6, 'E1', 3, true, false, NOW(), NOW());

-- Train 6: Jhelum Express (11077)
INSERT INTO train_coaches (coach_id, train_id, coach_type_id, coach_label, sequence_in_train, is_active, is_deleted, created_on, last_updated) VALUES
(23, 6, 1, 'S1', 1, true, false, NOW(), NOW()),
(24, 6, 1, 'S2', 2, true, false, NOW(), NOW()),
(25, 6, 1, 'S3', 3, true, false, NOW(), NOW()),
(26, 6, 2, 'B1', 4, true, false, NOW(), NOW()),
(27, 6, 3, 'A1', 5, true, false, NOW(), NOW());

-- =====================================================
-- TRAIN ROUTES DATA
-- =====================================================
-- Train 1: Punjab Mail (12137) - CSMT to NDLS
INSERT INTO train_routes (train_route_id, train_id, station_id, sequence_no, arrival_time, departure_time, halt_minutes, distance_from_source, day_number, is_major_station, stop_type, created_on, last_updated) VALUES
(1, 1, 1, 1, NULL, '16:40:00', 0, 0, 1, true, 'TERMINUS', NOW(), NOW()),
(2, 1, 3, 2, '05:15:00', '05:25:00', 10, 742, 2, true, 'REGULAR', NOW(), NOW()),
(3, 1, 4, 3, '08:45:00', '08:55:00', 10, 1056, 2, true, 'REGULAR', NOW(), NOW()),
(4, 1, 2, 4, '17:55:00', NULL, 0, 1384, 2, true, 'TERMINUS', NOW(), NOW());

-- Train 2: Karnataka Express (12627) - NDLS to BLR
INSERT INTO train_routes (train_route_id, train_id, station_id, sequence_no, arrival_time, departure_time, halt_minutes, distance_from_source, day_number, is_major_station, stop_type, created_on, last_updated) VALUES
(5, 2, 2, 1, NULL, '12:15:00', 0, 0, 1, true, 'TERMINUS', NOW(), NOW()),
(6, 2, 3, 2, '23:45:00', '23:55:00', 10, 707, 1, true, 'REGULAR', NOW(), NOW()),
(7, 2, 7, 3, '14:20:00', '14:30:00', 10, 1685, 2, true, 'REGULAR', NOW(), NOW()),
(8, 2, 6, 4, '06:00:00', NULL, 0, 2444, 3, true, 'TERMINUS', NOW(), NOW());

-- Train 3: Vande Bharat Express (20926) - NDLS to BPL
INSERT INTO train_routes (train_route_id, train_id, station_id, sequence_no, arrival_time, departure_time, halt_minutes, distance_from_source, day_number, is_major_station, stop_type, created_on, last_updated) VALUES
(9, 3, 2, 1, NULL, '06:00:00', 0, 0, 1, true, 'TERMINUS', NOW(), NOW()),
(10, 3, 3, 2, '14:20:00', NULL, 0, 707, 1, true, 'TERMINUS', NOW(), NOW());

-- Train 4: Dehradun Express (19019) - CSTM to NDLS
INSERT INTO train_routes (train_route_id, train_id, station_id, sequence_no, arrival_time, departure_time, halt_minutes, distance_from_source, day_number, is_major_station, stop_type, created_on, last_updated) VALUES
(11, 4, 8, 1, NULL, '11:05:00', 0, 0, 1, true, 'TERMINUS', NOW(), NOW()),
(12, 4, 9, 2, '21:30:00', '21:40:00', 10, 492, 1, true, 'REGULAR', NOW(), NOW()),
(13, 4, 10, 3, '08:15:00', '08:25:00', 10, 1056, 2, true, 'REGULAR', NOW(), NOW()),
(14, 4, 2, 4, '13:45:00', NULL, 0, 1384, 2, true, 'TERMINUS', NOW(), NOW());

-- Train 5: New Delhi Shatabdi Express (12002) - NDLS to BPL
INSERT INTO train_routes (train_route_id, train_id, station_id, sequence_no, arrival_time, departure_time, halt_minutes, distance_from_source, day_number, is_major_station, stop_type, created_on, last_updated) VALUES
(15, 5, 2, 1, NULL, '06:15:00', 0, 0, 1, true, 'TERMINUS', NOW(), NOW()),
(16, 5, 3, 2, '15:40:00', NULL, 0, 707, 1, true, 'TERMINUS', NOW(), NOW());

-- Train 6: Jhelum Express (11077) - PUNE to NDLS
INSERT INTO train_routes (train_route_id, train_id, station_id, sequence_no, arrival_time, departure_time, halt_minutes, distance_from_source, day_number, is_major_station, stop_type, created_on, last_updated) VALUES
(17, 6, 5, 1, NULL, '10:40:00', 0, 0, 1, true, 'TERMINUS', NOW(), NOW()),
(18, 6, 1, 2, '13:25:00', '13:35:00', 10, 192, 1, true, 'REGULAR', NOW(), NOW()),
(19, 6, 3, 3, '06:45:00', '06:55:00', 10, 934, 2, true, 'REGULAR', NOW(), NOW()),
(20, 6, 2, 4, '16:20:00', NULL, 0, 1527, 2, true, 'TERMINUS', NOW(), NOW());

-- =====================================================
-- TRAIN FARES DATA
-- =====================================================
-- Train 1: Punjab Mail (12137)
INSERT INTO train_fares (fare_id, train_id, coach_type_id, rate_per_km, base_fare, is_active, is_deleted, created_on, last_updated) VALUES
(1, 1, 1, 0.75, 50.00, true, false, NOW(), NOW()),
(2, 1, 2, 2.25, 150.00, true, false, NOW(), NOW()),
(3, 1, 3, 3.50, 250.00, true, false, NOW(), NOW());

-- Train 2: Karnataka Express (12627)
INSERT INTO train_fares (fare_id, train_id, coach_type_id, rate_per_km, base_fare, is_active, is_deleted, created_on, last_updated) VALUES
(4, 2, 1, 0.75, 50.00, true, false, NOW(), NOW()),
(5, 2, 2, 2.25, 150.00, true, false, NOW(), NOW()),
(6, 2, 3, 3.50, 250.00, true, false, NOW(), NOW());

-- Train 3: Vande Bharat Express (20926)
INSERT INTO train_fares (fare_id, train_id, coach_type_id, rate_per_km, base_fare, is_active, is_deleted, created_on, last_updated) VALUES
(7, 3, 5, 1.85, 100.00, true, false, NOW(), NOW()),
(8, 3, 6, 3.25, 200.00, true, false, NOW(), NOW());

-- Train 4: Dehradun Express (19019)
INSERT INTO train_fares (fare_id, train_id, coach_type_id, rate_per_km, base_fare, is_active, is_deleted, created_on, last_updated) VALUES
(9, 4, 1, 0.75, 50.00, true, false, NOW(), NOW()),
(10, 4, 2, 2.25, 150.00, true, false, NOW(), NOW()),
(11, 4, 3, 3.50, 250.00, true, false, NOW(), NOW()),
(12, 4, 4, 5.75, 500.00, true, false, NOW(), NOW());

-- Train 5: New Delhi Shatabdi Express (12002)
INSERT INTO train_fares (fare_id, train_id, coach_type_id, rate_per_km, base_fare, is_active, is_deleted, created_on, last_updated) VALUES
(13, 5, 5, 1.95, 120.00, true, false, NOW(), NOW()),
(14, 5, 6, 3.45, 250.00, true, false, NOW(), NOW());

-- Train 6: Jhelum Express (11077)
INSERT INTO train_fares (fare_id, train_id, coach_type_id, rate_per_km, base_fare, is_active, is_deleted, created_on, last_updated) VALUES
(15, 6, 1, 0.75, 50.00, true, false, NOW(), NOW()),
(16, 6, 2, 2.25, 150.00, true, false, NOW(), NOW()),
(17, 6, 3, 3.50, 250.00, true, false, NOW(), NOW());

-- =====================================================
-- SEAT LAYOUTS DATA (Sample for each coach type)
-- =====================================================
-- Sleeper Class (SL) - 72 seats per coach
INSERT INTO seat_layouts (seat_layout_id, coach_type_id, seat_number, seat_type, created_on, last_updated) VALUES
-- Bay 1 (Seats 1-8)
(1, 1, 1, 'LOWER_BERTH', NOW(), NOW()),
(2, 1, 2, 'MIDDLE_BERTH', NOW(), NOW()),
(3, 1, 3, 'UPPER_BERTH', NOW(), NOW()),
(4, 1, 4, 'LOWER_BERTH', NOW(), NOW()),
(5, 1, 5, 'MIDDLE_BERTH', NOW(), NOW()),
(6, 1, 6, 'UPPER_BERTH', NOW(), NOW()),
(7, 1, 7, 'SIDE_LOWER', NOW(), NOW()),
(8, 1, 8, 'SIDE_UPPER', NOW(), NOW()),
-- Bay 2 (Seats 9-16)
(9, 1, 9, 'LOWER_BERTH', NOW(), NOW()),
(10, 1, 10, 'MIDDLE_BERTH', NOW(), NOW()),
(11, 1, 11, 'UPPER_BERTH', NOW(), NOW()),
(12, 1, 12, 'LOWER_BERTH', NOW(), NOW()),
(13, 1, 13, 'MIDDLE_BERTH', NOW(), NOW()),
(14, 1, 14, 'UPPER_BERTH', NOW(), NOW()),
(15, 1, 15, 'SIDE_LOWER', NOW(), NOW()),
(16, 1, 16, 'SIDE_UPPER', NOW(), NOW());

-- AC 3 Tier (3A) - 64 seats per coach
INSERT INTO seat_layouts (seat_layout_id, coach_type_id, seat_number, seat_type, created_on, last_updated) VALUES
-- Bay 1 (Seats 1-8)
(17, 2, 1, 'LOWER_BERTH', NOW(), NOW()),
(18, 2, 2, 'MIDDLE_BERTH', NOW(), NOW()),
(19, 2, 3, 'UPPER_BERTH', NOW(), NOW()),
(20, 2, 4, 'LOWER_BERTH', NOW(), NOW()),
(21, 2, 5, 'MIDDLE_BERTH', NOW(), NOW()),
(22, 2, 6, 'UPPER_BERTH', NOW(), NOW()),
(23, 2, 7, 'SIDE_LOWER', NOW(), NOW()),
(24, 2, 8, 'SIDE_UPPER', NOW(), NOW());

-- AC 2 Tier (2A) - 48 seats per coach
INSERT INTO seat_layouts (seat_layout_id, coach_type_id, seat_number, seat_type, created_on, last_updated) VALUES
-- Bay 1 (Seats 1-6)
(25, 3, 1, 'LOWER_BERTH', NOW(), NOW()),
(26, 3, 2, 'UPPER_BERTH', NOW(), NOW()),
(27, 3, 3, 'LOWER_BERTH', NOW(), NOW()),
(28, 3, 4, 'UPPER_BERTH', NOW(), NOW()),
(29, 3, 5, 'SIDE_LOWER', NOW(), NOW()),
(30, 3, 6, 'SIDE_UPPER', NOW(), NOW());

-- =====================================================
-- TRAIN SCHEDULES DATA (Sample schedules for next 7 days)
-- =====================================================
INSERT INTO train_schedules (id, train_id, departure_date, status, actual_departure_time, actual_arrival_time, delay_reason, remarks, created_on, last_updated) VALUES
-- Punjab Mail (12137) - Daily
(1, 1, CURDATE(), 'RUNNING', NULL, NULL, NULL, 'On time', NOW(), NOW()),
(2, 1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'RUNNING', NULL, NULL, NULL, 'On time', NOW(), NOW()),
(3, 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'RUNNING', NULL, NULL, NULL, 'On time', NOW(), NOW()),

-- Karnataka Express (12627) - Daily
(4, 2, CURDATE(), 'RUNNING', NULL, NULL, NULL, 'On time', NOW(), NOW()),
(5, 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'RUNNING', NULL, NULL, NULL, 'On time', NOW(), NOW()),
(6, 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'RESCHEDULED', NULL, NULL, 'Technical maintenance', 'Delayed by 2 hours', NOW(), NOW()),

-- Vande Bharat Express (20926) - Mon-Sat
(7, 3, CURDATE(), 'RUNNING', NULL, NULL, NULL, 'On time', NOW(), NOW()),
(8, 3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'RUNNING', NULL, NULL, NULL, 'On time', NOW(), NOW()),

-- Dehradun Express (19019) - Daily
(9, 4, CURDATE(), 'RUNNING', NULL, NULL, NULL, 'On time', NOW(), NOW()),
(10, 4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'RUNNING', NULL, NULL, NULL, 'On time', NOW(), NOW()),

-- New Delhi Shatabdi Express (12002) - Mon-Sat
(11, 5, CURDATE(), 'RUNNING', NULL, NULL, NULL, 'On time', NOW(), NOW()),
(12, 5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'RUNNING', NULL, NULL, NULL, 'On time', NOW(), NOW()),

-- Jhelum Express (11077) - Daily
(13, 6, CURDATE(), 'RUNNING', NULL, NULL, NULL, 'On time', NOW(), NOW()),
(14, 6, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'RUNNING', NULL, NULL, NULL, 'On time', NOW(), NOW());

-- =====================================================
-- SAMPLE USERS DATA (for testing bookings)
-- =====================================================
INSERT INTO users (user_id, full_name, email, password, mobile, dob, gender, account_status, role, created_on, last_updated) VALUES
(1, 'Rajesh Kumar', 'rajesh.kumar@email.com', '$2a$10$encrypted_password_hash', '9876543210', '1985-06-15', 'MALE', 'ACTIVE', 'ROLE_CUSTOMER', NOW(), NOW()),
(2, 'Priya Sharma', 'priya.sharma@email.com', '$2a$10$encrypted_password_hash', '9876543211', '1990-03-22', 'FEMALE', 'ACTIVE', 'ROLE_CUSTOMER', NOW(), NOW()),
(3, 'Admin User', 'admin@orrs.com', '$2a$10$encrypted_password_hash', '9876543212', '1980-01-01', 'MALE', 'ACTIVE', 'ROLE_ADMIN', NOW(), NOW());

-- =====================================================
-- SAMPLE BOOKINGS DATA
-- =====================================================
INSERT INTO bookings (booking_id, user_id, schedule_id, coach_type_id, source_station_id, destination_station_id, journey_date, total_fare, status, booking_type, pnr_number, created_on, last_updated) VALUES
-- Train 1 (Punjab Mail) - Multiple bookings
(1, 1, 1, 2, 1, 2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 2088.00, 'CONFIRMED', 'INDIVIDUAL', 'PNR1234567890', NOW(), NOW()),
(2, 2, 1, 1, 1, 3, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 1145.50, 'CONFIRMED', 'INDIVIDUAL', 'PNR1234567891', NOW(), NOW()),
(3, 3, 1, 2, 1, 2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 3132.00, 'CONFIRMED', 'INDIVIDUAL', 'PNR1234567892', NOW(), NOW()),
(4, 1, 1, 1, 3, 2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 481.50, 'CONFIRMED', 'INDIVIDUAL', 'PNR1234567893', NOW(), NOW()),
(5, 2, 1, 3, 1, 2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 5094.00, 'CONFIRMED', 'INDIVIDUAL', 'PNR1234567894', NOW(), NOW()),
-- Train 3 (Vande Bharat) - One booking
(6, 2, 7, 5, 2, 3, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 1408.95, 'CONFIRMED', 'INDIVIDUAL', 'PNR2345678901', NOW(), NOW());

-- =====================================================
-- SAMPLE TICKETS DATA
-- =====================================================
INSERT INTO tickets (ticket_id, booking_id, passenger_name, age, gender, coach_label, seat_number, status, created_on, last_updated) VALUES
-- Booking 1: Rajesh Kumar - 2 passengers in 3A coach
(1, 1, 'Rajesh Kumar', 38, 'MALE', 'B1', 15, 'CONFIRMED', NOW(), NOW()),
(2, 1, 'Sunita Kumar', 35, 'FEMALE', 'B1', 16, 'CONFIRMED', NOW(), NOW()),
-- Booking 2: Priya Sharma - 1 passenger in SL coach
(3, 2, 'Priya Sharma', 33, 'FEMALE', 'S1', 25, 'CONFIRMED', NOW(), NOW()),
-- Booking 3: Admin User - 3 passengers in 3A coach (family booking)
(4, 3, 'Admin User', 43, 'MALE', 'B1', 17, 'CONFIRMED', NOW(), NOW()),
(5, 3, 'Kavita Admin', 40, 'FEMALE', 'B1', 18, 'CONFIRMED', NOW(), NOW()),
(6, 3, 'Arjun Admin', 15, 'MALE', 'B1', 19, 'CONFIRMED', NOW(), NOW()),
-- Booking 4: Rajesh Kumar - 1 passenger in SL coach (return journey)
(7, 4, 'Rajesh Kumar', 38, 'MALE', 'S2', 30, 'CONFIRMED', NOW(), NOW()),
-- Booking 5: Priya Sharma - 2 passengers in 2A coach (premium booking)
(8, 5, 'Priya Sharma', 33, 'FEMALE', 'A1', 5, 'CONFIRMED', NOW(), NOW()),
(9, 5, 'Meera Sharma', 28, 'FEMALE', 'A1', 6, 'CONFIRMED', NOW(), NOW()),
-- Booking 6: Vande Bharat Express booking
(10, 6, 'Priya Sharma', 33, 'FEMALE', 'C1', 25, 'CONFIRMED', NOW(), NOW());

-- =====================================================
-- SAMPLE PAYMENTS DATA
-- =====================================================
INSERT INTO payments (payment_id, user_id, booking_id, transaction_id, amount, payment_method, payment_status, payment_date, created_on, last_updated) VALUES
(1, 1, 1, 'TXN1234567890', 2088.00, 'CREDIT_CARD', 'SUCCESS', NOW(), NOW(), NOW()),
(2, 2, 2, 'TXN1234567891', 1145.50, 'UPI', 'SUCCESS', NOW(), NOW(), NOW()),
(3, 3, 3, 'TXN1234567892', 3132.00, 'DEBIT_CARD', 'SUCCESS', NOW(), NOW(), NOW()),
(4, 1, 4, 'TXN1234567893', 481.50, 'NET_BANKING', 'SUCCESS', NOW(), NOW(), NOW()),
(5, 2, 5, 'TXN1234567894', 5094.00, 'CREDIT_CARD', 'SUCCESS', NOW(), NOW(), NOW()),
(6, 2, 6, 'TXN2345678901', 1408.95, 'UPI', 'SUCCESS', NOW(), NOW(), NOW());

-- =====================================================
-- SAMPLE SEAT RESERVATIONS DATA
-- =====================================================
INSERT INTO seat_reservations (reservation_id, schedule_id, coach_type_id, coach_label, seat_number, user_id, session_id, reserved_at, expires_at, status, created_on, last_updated) VALUES
-- Train 1 (Punjab Mail) - Multiple seat reservations
(1, 1, 2, 'B1', 15, 1, 'SESSION_001', NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE), 'CONFIRMED', NOW(), NOW()),
(2, 1, 2, 'B1', 16, 1, 'SESSION_001', NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE), 'CONFIRMED', NOW(), NOW()),
(3, 1, 1, 'S1', 25, 2, 'SESSION_002', NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE), 'CONFIRMED', NOW(), NOW()),
(4, 1, 2, 'B1', 17, 3, 'SESSION_003', NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE), 'CONFIRMED', NOW(), NOW()),
(5, 1, 2, 'B1', 18, 3, 'SESSION_003', NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE), 'CONFIRMED', NOW(), NOW()),
(6, 1, 2, 'B1', 19, 3, 'SESSION_003', NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE), 'CONFIRMED', NOW(), NOW()),
(7, 1, 1, 'S2', 30, 1, 'SESSION_004', NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE), 'CONFIRMED', NOW(), NOW()),
(8, 1, 3, 'A1', 5, 2, 'SESSION_005', NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE), 'CONFIRMED', NOW(), NOW()),
(9, 1, 3, 'A1', 6, 2, 'SESSION_005', NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE), 'CONFIRMED', NOW(), NOW()),
-- Train 3 (Vande Bharat Express) - One seat reservation
(10, 7, 5, 'C1', 25, 2, 'SESSION_006', NOW(), DATE_ADD(NOW(), INTERVAL 15 MINUTE), 'CONFIRMED', NOW(), NOW());

-- =====================================================
-- QUERY EXAMPLES FOR TESTING
-- =====================================================

/*
-- 1. Get all trains with their source and destination stations
SELECT 
    t.train_number,
    t.train_name,
    t.train_type,
    s1.station_name AS source_station,
    s2.station_name AS destination_station,
    t.total_distance_km,
    t.days_of_run
FROM trains t
JOIN stations s1 ON t.source_station_id = s1.station_id
JOIN stations s2 ON t.destination_station_id = s2.station_id
WHERE t.train_active_status = 'ACTIVE';

-- 2. Get train routes with station details
SELECT 
    t.train_number,
    t.train_name,
    tr.sequence_no,
    s.station_code,
    s.station_name,
    tr.arrival_time,
    tr.departure_time,
    tr.distance_from_source,
    tr.stop_type
FROM train_routes tr
JOIN trains t ON tr.train_id = t.train_id
JOIN stations s ON tr.station_id = s.station_id
ORDER BY t.train_number, tr.sequence_no;

-- 3. Get coach details for each train
SELECT 
    t.train_number,
    t.train_name,
    tc.coach_label,
    ct.type_name,
    ct.total_seats,
    tc.sequence_in_train
FROM train_coaches tc
JOIN trains t ON tc.train_id = t.train_id
JOIN coach_types ct ON tc.coach_type_id = ct.coach_type_id
WHERE tc.is_active = true
ORDER BY t.train_number, tc.sequence_in_train;

-- 4. Get fare structure for trains
SELECT 
    t.train_number,
    t.train_name,
    ct.type_name,
    tf.base_fare,
    tf.rate_per_km,
    (tf.base_fare + (tf.rate_per_km * t.total_distance_km)) AS total_fare
FROM train_fares tf
JOIN trains t ON tf.train_id = t.train_id
JOIN coach_types ct ON tf.coach_type_id = ct.coach_type_id
WHERE tf.is_active = true
ORDER BY t.train_number, ct.type_name;

-- 5. Get available schedules for booking
SELECT 
    t.train_number,
    t.train_name,
    ts.departure_date,
    ts.status,
    s1.station_name AS source,
    s2.station_name AS destination
FROM train_schedules ts
JOIN trains t ON ts.train_id = t.train_id
JOIN stations s1 ON t.source_station_id = s1.station_id
JOIN stations s2 ON t.destination_station_id = s2.station_id
WHERE ts.departure_date >= CURDATE() 
AND ts.status IN ('RUNNING', 'RESCHEDULED')
ORDER BY ts.departure_date, t.train_number;
*/