-- =====================================================
-- ORRS (Online Railway Reservation System) - Dummy Data
-- =====================================================
-- This file contains INSERT queries for 4 trains with complete data
-- Including: Stations, Trains, Coach Types, Seat Layouts, Train Routes, Train Fares, Train Coaches, Train Schedules
-- =====================================================

-- =====================================================
-- 1. STATIONS (10 Major Stations)
-- =====================================================
INSERT INTO stations (station_code, station_name, city, state, zone, platforms, status, created_on, last_updated) VALUES
('CSMT', 'Chhatrapati Shivaji Maharaj Terminus', 'Mumbai', 'Maharashtra', 'Central Railway', 18, 'ACTIVE', CURDATE(), CURDATE()),
('PUNE', 'Pune Junction', 'Pune', 'Maharashtra', 'Central Railway', 6, 'ACTIVE', CURDATE(), CURDATE()),
('NDLS', 'New Delhi', 'New Delhi', 'Delhi', 'Northern Railway', 16, 'ACTIVE', CURDATE(), CURDATE()),
('BCT', 'Mumbai Central', 'Mumbai', 'Maharashtra', 'Western Railway', 7, 'ACTIVE', CURDATE(), CURDATE()),
('HWH', 'Howrah Junction', 'Kolkata', 'West Bengal', 'Eastern Railway', 23, 'ACTIVE', CURDATE(), CURDATE()),
('MAS', 'Chennai Central', 'Chennai', 'Tamil Nadu', 'Southern Railway', 15, 'ACTIVE', CURDATE(), CURDATE()),
('SBC', 'Bangalore City Junction', 'Bangalore', 'Karnataka', 'South Western Railway', 10, 'ACTIVE', CURDATE(), CURDATE()),
('ADI', 'Ahmedabad Junction', 'Ahmedabad', 'Gujarat', 'Western Railway', 12, 'ACTIVE', CURDATE(), CURDATE()),
('JP', 'Jaipur Junction', 'Jaipur', 'Rajasthan', 'North Western Railway', 6, 'ACTIVE', CURDATE(), CURDATE()),
('LKO', 'Lucknow Junction', 'Lucknow', 'Uttar Pradesh', 'Northern Railway', 8, 'ACTIVE', CURDATE(), CURDATE());

-- =====================================================
-- 2. COACH TYPES (4 Different Types)
-- =====================================================
INSERT INTO coach_types (type_code, type_name, total_seats, coach_image_url, description, created_on, last_updated) VALUES
('SL', 'Sleeper Class', 72, '/images/coaches/sleeper.jpg', 'Economy class with sleeping berths', CURDATE(), CURDATE()),
('3A', 'AC 3 Tier', 64, '/images/coaches/3ac.jpg', 'Air-conditioned 3-tier sleeping berths', CURDATE(), CURDATE()),
('2A', 'AC 2 Tier', 48, '/images/coaches/2ac.jpg', 'Air-conditioned 2-tier sleeping berths', CURDATE(), CURDATE()),
('1A', 'AC First Class', 24, '/images/coaches/1ac.jpg', 'Premium air-conditioned cabins', CURDATE(), CURDATE());

-- =====================================================
-- 3. SEAT LAYOUTS (40 seats per coach for each coach type)
-- =====================================================

-- Sleeper Class (SL) - 40 seats (1-40)
INSERT INTO seat_layouts (coach_type_id, seat_number, seat_type, created_on, last_updated)
SELECT 1, n, 
  CASE 
    WHEN n % 8 IN (1, 4) THEN 'LOWER'
    WHEN n % 8 IN (2, 5) THEN 'MIDDLE'
    WHEN n % 8 IN (3, 6) THEN 'UPPER'
    ELSE 'SIDE_LOWER'
  END,
  CURDATE(), CURDATE()
FROM (
  SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
  UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20
  UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25 UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30
  UNION SELECT 31 UNION SELECT 32 UNION SELECT 33 UNION SELECT 34 UNION SELECT 35 UNION SELECT 36 UNION SELECT 37 UNION SELECT 38 UNION SELECT 39 UNION SELECT 40
) numbers;

-- AC 3 Tier (3A) - 40 seats (1-40)
INSERT INTO seat_layouts (coach_type_id, seat_number, seat_type, created_on, last_updated)
SELECT 2, n, 
  CASE 
    WHEN n % 8 IN (1, 4) THEN 'LOWER'
    WHEN n % 8 IN (2, 5) THEN 'MIDDLE'
    WHEN n % 8 IN (3, 6) THEN 'UPPER'
    ELSE 'SIDE_UPPER'
  END,
  CURDATE(), CURDATE()
FROM (
  SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
  UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20
  UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25 UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30
  UNION SELECT 31 UNION SELECT 32 UNION SELECT 33 UNION SELECT 34 UNION SELECT 35 UNION SELECT 36 UNION SELECT 37 UNION SELECT 38 UNION SELECT 39 UNION SELECT 40
) numbers;

-- AC 2 Tier (2A) - 40 seats (1-40)
INSERT INTO seat_layouts (coach_type_id, seat_number, seat_type, created_on, last_updated)
SELECT 3, n, 
  CASE 
    WHEN n % 4 IN (1, 3) THEN 'LOWER'
    ELSE 'UPPER'
  END,
  CURDATE(), CURDATE()
FROM (
  SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
  UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20
  UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25 UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30
  UNION SELECT 31 UNION SELECT 32 UNION SELECT 33 UNION SELECT 34 UNION SELECT 35 UNION SELECT 36 UNION SELECT 37 UNION SELECT 38 UNION SELECT 39 UNION SELECT 40
) numbers;

-- AC First Class (1A) - 40 seats (1-40)
INSERT INTO seat_layouts (coach_type_id, seat_number, seat_type, created_on, last_updated)
SELECT 4, n, 
  CASE 
    WHEN n % 2 = 1 THEN 'LOWER'
    ELSE 'UPPER'
  END,
  CURDATE(), CURDATE()
FROM (
  SELECT 1 n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
  UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19 UNION SELECT 20
  UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24 UNION SELECT 25 UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29 UNION SELECT 30
  UNION SELECT 31 UNION SELECT 32 UNION SELECT 33 UNION SELECT 34 UNION SELECT 35 UNION SELECT 36 UNION SELECT 37 UNION SELECT 38 UNION SELECT 39 UNION SELECT 40
) numbers;

-- =====================================================
-- 4. TRAINS (4 Different Trains)
-- =====================================================
INSERT INTO trains (train_number, train_name, train_type, source_station_id, destination_station_id, total_distance_km, avg_speed, days_of_run, train_active_status, created_on, last_updated) VALUES
('12301', 'Rajdhani Express', 'RAJDHANI', 3, 5, 1450, 110, 'Daily', 'ACTIVE', CURDATE(), CURDATE()),
('12951', 'Mumbai Rajdhani', 'RAJDHANI', 1, 3, 1384, 105, 'Daily', 'ACTIVE', CURDATE(), CURDATE()),
('12621', 'Tamil Nadu Express', 'SUPERFAST', 3, 6, 2194, 85, 'Daily', 'ACTIVE', CURDATE(), CURDATE()),
('12009', 'Shatabdi Express', 'SHATABDI', 3, 9, 308, 95, 'Mon,Tue,Wed,Thu,Fri,Sat', 'ACTIVE', CURDATE(), CURDATE());

-- =====================================================
-- 5. TRAIN ROUTES (Detailed routes for each train)
-- =====================================================

-- Train 1: Rajdhani Express (12301) - New Delhi to Howrah
INSERT INTO train_routes (train_id, station_id, sequence_no, arrival_time, departure_time, halt_minutes, distance_from_source, day_number, is_major_station, stop_type, created_on, last_updated) VALUES
(1, 3, 1, NULL, '16:55:00', 0, 0, 1, true, 'REGULAR', CURDATE(), CURDATE()),
(1, 10, 2, '22:30:00', '22:40:00', 10, 483, 1, true, 'REGULAR', CURDATE(), CURDATE()),
(1, 5, 3, '10:05:00', NULL, 0, 1450, 2, true, 'REGULAR', CURDATE(), CURDATE());

-- Train 2: Mumbai Rajdhani (12951) - Mumbai to New Delhi
INSERT INTO train_routes (train_id, station_id, sequence_no, arrival_time, departure_time, halt_minutes, distance_from_source, day_number, is_major_station, stop_type, created_on, last_updated) VALUES
(2, 1, 1, NULL, '16:40:00', 0, 0, 1, true, 'REGULAR', CURDATE(), CURDATE()),
(2, 2, 2, '19:25:00', '19:30:00', 5, 192, 1, true, 'REGULAR', CURDATE(), CURDATE()),
(2, 8, 3, '05:15:00', '05:25:00', 10, 531, 2, true, 'REGULAR', CURDATE(), CURDATE()),
(2, 9, 4, '11:30:00', '11:40:00', 10, 923, 2, true, 'REGULAR', CURDATE(), CURDATE()),
(2, 3, 5, '08:35:00', NULL, 0, 1384, 3, true, 'REGULAR', CURDATE(), CURDATE());

-- Train 3: Tamil Nadu Express (12621) - New Delhi to Chennai
INSERT INTO train_routes (train_id, station_id, sequence_no, arrival_time, departure_time, halt_minutes, distance_from_source, day_number, is_major_station, stop_type, created_on, last_updated) VALUES
(3, 3, 1, NULL, '22:30:00', 0, 0, 1, true, 'REGULAR', CURDATE(), CURDATE()),
(3, 9, 2, '08:15:00', '08:25:00', 10, 308, 2, true, 'REGULAR', CURDATE(), CURDATE()),
(3, 7, 3, '05:30:00', '05:40:00', 10, 1478, 3, true, 'REGULAR', CURDATE(), CURDATE()),
(3, 6, 4, '11:00:00', NULL, 0, 2194, 3, true, 'REGULAR', CURDATE(), CURDATE());

-- Train 4: Shatabdi Express (12009) - New Delhi to Jaipur
INSERT INTO train_routes (train_id, station_id, sequence_no, arrival_time, departure_time, halt_minutes, distance_from_source, day_number, is_major_station, stop_type, created_on, last_updated) VALUES
(4, 3, 1, NULL, '06:00:00', 0, 0, 1, true, 'REGULAR', CURDATE(), CURDATE()),
(4, 9, 2, '10:30:00', NULL, 0, 308, 1, true, 'REGULAR', CURDATE(), CURDATE());

-- =====================================================
-- 6. TRAIN COACHES (4 coaches per train, one of each type)
-- =====================================================

-- Train 1: Rajdhani Express (12301)
INSERT INTO train_coaches (train_id, coach_type_id, coach_label, sequence_in_train, is_active, is_deleted, created_on, last_updated) VALUES
(1, 1, 'S1', 1, true, false, CURDATE(), CURDATE()),
(1, 2, 'B1', 2, true, false, CURDATE(), CURDATE()),
(1, 3, 'A1', 3, true, false, CURDATE(), CURDATE()),
(1, 4, 'H1', 4, true, false, CURDATE(), CURDATE());

-- Train 2: Mumbai Rajdhani (12951)
INSERT INTO train_coaches (train_id, coach_type_id, coach_label, sequence_in_train, is_active, is_deleted, created_on, last_updated) VALUES
(2, 1, 'S1', 1, true, false, CURDATE(), CURDATE()),
(2, 2, 'B1', 2, true, false, CURDATE(), CURDATE()),
(2, 3, 'A1', 3, true, false, CURDATE(), CURDATE()),
(2, 4, 'H1', 4, true, false, CURDATE(), CURDATE());

-- Train 3: Tamil Nadu Express (12621)
INSERT INTO train_coaches (train_id, coach_type_id, coach_label, sequence_in_train, is_active, is_deleted, created_on, last_updated) VALUES
(3, 1, 'S1', 1, true, false, CURDATE(), CURDATE()),
(3, 2, 'B1', 2, true, false, CURDATE(), CURDATE()),
(3, 3, 'A1', 3, true, false, CURDATE(), CURDATE()),
(3, 4, 'H1', 4, true, false, CURDATE(), CURDATE());

-- Train 4: Shatabdi Express (12009)
INSERT INTO train_coaches (train_id, coach_type_id, coach_label, sequence_in_train, is_active, is_deleted, created_on, last_updated) VALUES
(4, 1, 'S1', 1, true, false, CURDATE(), CURDATE()),
(4, 2, 'B1', 2, true, false, CURDATE(), CURDATE()),
(4, 3, 'A1', 3, true, false, CURDATE(), CURDATE()),
(4, 4, 'H1', 4, true, false, CURDATE(), CURDATE());

-- =====================================================
-- 7. TRAIN FARES (Fare for each train and coach type combination)
-- =====================================================

-- Train 1: Rajdhani Express (12301) - Premium pricing
INSERT INTO train_fares (train_id, coach_type_id, rate_per_km, base_fare, is_active, is_deleted, created_on, last_updated) VALUES
(1, 1, 0.50, 50.00, true, false, CURDATE(), CURDATE()),
(1, 2, 1.20, 100.00, true, false, CURDATE(), CURDATE()),
(1, 3, 1.80, 150.00, true, false, CURDATE(), CURDATE()),
(1, 4, 2.50, 200.00, true, false, CURDATE(), CURDATE());

-- Train 2: Mumbai Rajdhani (12951) - Premium pricing
INSERT INTO train_fares (train_id, coach_type_id, rate_per_km, base_fare, is_active, is_deleted, created_on, last_updated) VALUES
(2, 1, 0.55, 50.00, true, false, CURDATE(), CURDATE()),
(2, 2, 1.25, 100.00, true, false, CURDATE(), CURDATE()),
(2, 3, 1.85, 150.00, true, false, CURDATE(), CURDATE()),
(2, 4, 2.60, 200.00, true, false, CURDATE(), CURDATE());

-- Train 3: Tamil Nadu Express (12621) - Standard pricing
INSERT INTO train_fares (train_id, coach_type_id, rate_per_km, base_fare, is_active, is_deleted, created_on, last_updated) VALUES
(3, 1, 0.45, 50.00, true, false, CURDATE(), CURDATE()),
(3, 2, 1.10, 100.00, true, false, CURDATE(), CURDATE()),
(3, 3, 1.70, 150.00, true, false, CURDATE(), CURDATE()),
(3, 4, 2.40, 200.00, true, false, CURDATE(), CURDATE());

-- Train 4: Shatabdi Express (12009) - Day train pricing
INSERT INTO train_fares (train_id, coach_type_id, rate_per_km, base_fare, is_active, is_deleted, created_on, last_updated) VALUES
(4, 1, 0.60, 50.00, true, false, CURDATE(), CURDATE()),
(4, 2, 1.30, 100.00, true, false, CURDATE(), CURDATE()),
(4, 3, 1.90, 150.00, true, false, CURDATE(), CURDATE()),
(4, 4, 2.70, 200.00, true, false, CURDATE(), CURDATE());

-- =====================================================
-- 8. TRAIN SCHEDULES (Next 7 days for all trains)
-- =====================================================

-- Train 1: Rajdhani Express (12301) - Daily
INSERT INTO train_schedules (train_id, departure_date, status, actual_departure_time, actual_arrival_time, delay_reason, remarks, created_on, last_updated) VALUES
(1, CURDATE(), 'RUNNING', NULL, NULL, NULL, 'On time', CURDATE(), CURDATE()),
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(1, DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(1, DATE_ADD(CURDATE(), INTERVAL 6 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE());

-- Train 2: Mumbai Rajdhani (12951) - Daily
INSERT INTO train_schedules (train_id, departure_date, status, actual_departure_time, actual_arrival_time, delay_reason, remarks, created_on, last_updated) VALUES
(2, CURDATE(), 'RUNNING', NULL, NULL, NULL, 'On time', CURDATE(), CURDATE()),
(2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(2, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(2, DATE_ADD(CURDATE(), INTERVAL 6 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE());

-- Train 3: Tamil Nadu Express (12621) - Daily
INSERT INTO train_schedules (train_id, departure_date, status, actual_departure_time, actual_arrival_time, delay_reason, remarks, created_on, last_updated) VALUES
(3, CURDATE(), 'RUNNING', NULL, NULL, NULL, 'On time', CURDATE(), CURDATE()),
(3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(3, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(3, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(3, DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(3, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(3, DATE_ADD(CURDATE(), INTERVAL 6 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE());

-- Train 4: Shatabdi Express (12009) - 6 days a week (Mon-Sat)
INSERT INTO train_schedules (train_id, departure_date, status, actual_departure_time, actual_arrival_time, delay_reason, remarks, created_on, last_updated) VALUES
(4, CURDATE(), 'RUNNING', NULL, NULL, NULL, 'On time', CURDATE(), CURDATE()),
(4, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(4, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(4, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(4, DATE_ADD(CURDATE(), INTERVAL 4 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE()),
(4, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'RUNNING', NULL, NULL, NULL, 'Scheduled', CURDATE(), CURDATE());

-- =====================================================
-- END OF DUMMY DATA
-- =====================================================
-- Summary:
-- - 10 Stations
-- - 4 Coach Types (SL, 3A, 2A, 1A)
-- - 160 Seat Layouts (40 seats per coach type)
-- - 4 Trains
-- - 13 Train Routes (detailed stops for each train)
-- - 16 Train Coaches (4 coaches per train)
-- - 16 Train Fares (fare for each train-coach combination)
-- - 41 Train Schedules (7 days for 3 trains, 6 days for 1 train)
-- =====================================================
