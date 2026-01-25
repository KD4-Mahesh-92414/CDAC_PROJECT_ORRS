# 🧪 Admin Panel Testing Guide

## 🚀 Getting Started

1. **Start the development server:**
```bash
npm run dev
```

2. **Open browser:**
```
http://localhost:5174/
```

## ✅ Test Checklist

### 1. Navigation Tests

#### Test 1.1: Access Admin Panel from User Flow
- [ ] Click "Admin Panel" link in main navbar
- [ ] Verify redirect to `/admin`
- [ ] Verify Dashboard loads with stats

#### Test 1.2: Navigate Back to User Flow
- [ ] From admin panel, click "Back to User Portal" in sidebar
- [ ] Verify redirect to `/`
- [ ] Verify user flow navbar appears

#### Test 1.3: Admin Sidebar Navigation
- [ ] Click "Dashboard" - verify `/admin` loads
- [ ] Click "Train Management" - verify `/admin/trains` loads
- [ ] Click "Station Management" - verify `/admin/stations` loads

### 2. Dashboard Tests

#### Test 2.1: Stats Display
- [ ] Verify "Active Trains" shows count (should be 5)
- [ ] Verify "Active Stations" shows count (should be 5)
- [ ] Verify "Total Trains" shows count (should be 5)
- [ ] Verify "Total Stations" shows count (should be 5)

#### Test 2.2: Train Status Overview
- [ ] Verify "Running" count (should be 5)
- [ ] Verify "Not Started" count (should be 0)
- [ ] Verify "Cancelled" count (should be 0)

### 3. Station Management Tests

#### Test 3.1: View Stations
- [ ] Navigate to `/admin/stations`
- [ ] Verify table shows 5 stations
- [ ] Verify columns: Code, Name, City, State, Zone, Platforms, Status
- [ ] Verify status badges are colored (green for Active)

#### Test 3.2: Search Stations
- [ ] Type "Delhi" in search box
- [ ] Verify only "New Delhi" appears
- [ ] Type "CSMT" in search box
- [ ] Verify only CSMT station appears
- [ ] Clear search, verify all stations appear

#### Test 3.3: Add Station - Success
- [ ] Click "Add Station" button
- [ ] Fill form:
  - Station Code: "BLR"
  - Station Name: "Bangalore City"
  - City: "Bangalore"
  - State: "Karnataka"
  - Zone: "South Western Railway"
  - Platforms: 10
  - Status: Active
- [ ] Click "Save"
- [ ] Verify modal closes
- [ ] Verify new station appears in table
- [ ] Verify dashboard "Total Stations" increased to 6

#### Test 3.4: Add Station - Validation Errors
- [ ] Click "Add Station"
- [ ] Leave Station Code empty
- [ ] Click "Save"
- [ ] Verify error: "Station code is required"
- [ ] Enter code longer than 10 chars: "VERYLONGCODE123"
- [ ] Verify error: "Station code must be 10 characters or less"
- [ ] Leave Station Name empty
- [ ] Verify error: "Station name is required"
- [ ] Enter Platforms: 100
- [ ] Verify error: "Platforms must be between 1 and 50"

#### Test 3.5: Edit Station
- [ ] Click edit icon (pencil) on "New Delhi" row
- [ ] Verify form pre-filled with station data
- [ ] Change Platforms to 20
- [ ] Click "Save"
- [ ] Verify modal closes
- [ ] Verify platforms updated in table

#### Test 3.6: Delete Station
- [ ] Click delete icon (trash) on any station
- [ ] Verify confirmation dialog appears
- [ ] Click "Cancel"
- [ ] Verify dialog closes, station still in table
- [ ] Click delete icon again
- [ ] Click "Confirm"
- [ ] Verify station status changed to "Inactive"
- [ ] Verify status badge is red

#### Test 3.7: Pagination
- [ ] Add more than 10 stations (if needed)
- [ ] Verify pagination controls appear
- [ ] Click "Next" button
- [ ] Verify page 2 loads
- [ ] Click "Previous" button
- [ ] Verify page 1 loads

### 4. Train Management Tests

#### Test 4.1: View Trains
- [ ] Navigate to `/admin/trains`
- [ ] Verify table shows 5 trains
- [ ] Verify columns: Number, Name, Type, Source, Destination, Distance, Days, Status
- [ ] Verify station names displayed (not IDs)
- [ ] Verify status badges are colored

#### Test 4.2: Add Train - Success
- [ ] Click "Add Train" button
- [ ] Fill form:
  - Train Number: "12345"
  - Train Name: "Test Express"
  - Train Type: "Express"
  - Source Station: "New Delhi"
  - Destination Station: "Mumbai Central"
  - Distance: 1400
  - Speed: 80
  - Days of Run: "Daily"
  - Active Status: Active
  - Current Status: Running
- [ ] Click "Save"
- [ ] Verify modal closes
- [ ] Verify new train appears in table
- [ ] Verify source/destination show station names
- [ ] Verify dashboard "Total Trains" increased to 6

#### Test 4.3: Add Train - Validation Errors
- [ ] Click "Add Train"
- [ ] Leave Train Number empty
- [ ] Click "Save"
- [ ] Verify error: "Train number is required"
- [ ] Enter Train Number: "123" (less than 5 digits)
- [ ] Verify error: "Train number must be 5 digits"
- [ ] Enter Train Number: "ABCDE" (not digits)
- [ ] Verify error: "Train number must be 5 digits"
- [ ] Leave Train Name empty
- [ ] Verify error: "Train name is required"
- [ ] Leave Source Station empty
- [ ] Verify error: "Source station is required"
- [ ] Select Source: "New Delhi"
- [ ] Select Destination: "New Delhi" (same as source)
- [ ] Verify error: "Source and destination cannot be same"
- [ ] Enter Distance: 6000
- [ ] Verify error: "Distance must be between 1 and 5000 km"
- [ ] Enter Speed: 250
- [ ] Verify error: "Speed must be between 10 and 200 km/h"

#### Test 4.4: Edit Train
- [ ] Click edit icon on "Mumbai Rajdhani Express"
- [ ] Verify form pre-filled with train data
- [ ] Change Train Type to "Superfast"
- [ ] Click "Save"
- [ ] Verify modal closes
- [ ] Verify type updated in table

#### Test 4.5: Delete Train
- [ ] Click delete icon on any train
- [ ] Verify confirmation dialog appears
- [ ] Click "Confirm"
- [ ] Verify train status changed to "Inactive"
- [ ] Verify status badge is red
- [ ] Verify dashboard "Active Trains" decreased

### 5. Theme Consistency Tests

#### Test 5.1: Colors
- [ ] Verify primary color is violet (#6D28D9)
- [ ] Verify active links are violet
- [ ] Verify buttons are violet
- [ ] Verify success badges are green
- [ ] Verify error badges are red

#### Test 5.2: Components
- [ ] Verify rounded corners match user flow
- [ ] Verify shadows match user flow
- [ ] Verify hover effects match user flow
- [ ] Verify transitions are smooth

### 6. Responsive Design Tests

#### Test 6.1: Mobile View (< 768px)
- [ ] Resize browser to mobile width
- [ ] Verify sidebar is hidden
- [ ] Click hamburger menu icon
- [ ] Verify sidebar slides in
- [ ] Click outside sidebar
- [ ] Verify sidebar closes
- [ ] Verify tables are scrollable
- [ ] Verify forms are readable

#### Test 6.2: Tablet View (768px - 1024px)
- [ ] Resize browser to tablet width
- [ ] Verify sidebar is visible
- [ ] Verify tables fit properly
- [ ] Verify forms are readable

#### Test 6.3: Desktop View (> 1024px)
- [ ] Resize browser to desktop width
- [ ] Verify sidebar is always visible
- [ ] Verify tables display all columns
- [ ] Verify forms are well-spaced

### 7. Context API Tests

#### Test 7.1: Data Persistence
- [ ] Add a new station
- [ ] Navigate to Dashboard
- [ ] Verify "Total Stations" increased
- [ ] Navigate back to Station Management
- [ ] Verify new station still in table

#### Test 7.2: Cross-Component Updates
- [ ] Note current "Active Trains" count on Dashboard
- [ ] Navigate to Train Management
- [ ] Delete a train (soft delete)
- [ ] Navigate back to Dashboard
- [ ] Verify "Active Trains" count decreased

#### Test 7.3: Data Loss on Refresh
- [ ] Add a new station
- [ ] Refresh browser (F5)
- [ ] Verify new station is gone (expected - in-memory data)
- [ ] Verify original 5 stations are back

### 8. Edge Cases

#### Test 8.1: Empty Fields
- [ ] Try to submit forms with all fields empty
- [ ] Verify appropriate error messages

#### Test 8.2: Special Characters
- [ ] Try entering special characters in text fields
- [ ] Verify they are accepted (no crashes)

#### Test 8.3: Large Numbers
- [ ] Try entering very large numbers in numeric fields
- [ ] Verify validation catches them

#### Test 8.4: Negative Numbers
- [ ] Try entering negative numbers
- [ ] Verify validation catches them

### 9. User Experience Tests

#### Test 9.1: Loading States
- [ ] Verify no loading spinners (since no API calls)
- [ ] Verify instant updates

#### Test 9.2: Error Messages
- [ ] Verify error messages are clear
- [ ] Verify error messages are inline (below fields)
- [ ] Verify error messages are red

#### Test 9.3: Success Feedback
- [ ] After adding/editing, verify modal closes
- [ ] Verify data appears in table immediately

#### Test 9.4: Confirmation Dialogs
- [ ] Verify delete requires confirmation
- [ ] Verify confirmation message is clear

### 10. Integration Tests

#### Test 10.1: User Flow to Admin Flow
- [ ] Start at home page (`/`)
- [ ] Click "Admin Panel"
- [ ] Perform admin operations
- [ ] Click "Back to User Portal"
- [ ] Verify user flow works normally

#### Test 10.2: Admin Flow to User Flow
- [ ] Start at admin dashboard
- [ ] Click logo in sidebar
- [ ] Verify redirect to home page
- [ ] Verify user flow navbar appears

## 🐛 Known Limitations

1. **Data Persistence**: Data is in-memory, lost on refresh (expected)
2. **No Authentication**: Anyone can access admin panel (to be added)
3. **No Backend**: All operations are client-side only (expected)
4. **Limited Modules**: Only Trains and Stations have full CRUD (as required)

## ✅ Success Criteria

All tests should pass with:
- ✅ No console errors
- ✅ No visual glitches
- ✅ Smooth transitions
- ✅ Consistent theme
- ✅ Proper validation
- ✅ Data updates correctly

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

Navigation Tests: ___/3 passed
Dashboard Tests: ___/2 passed
Station Management Tests: ___/7 passed
Train Management Tests: ___/5 passed
Theme Consistency Tests: ___/2 passed
Responsive Design Tests: ___/3 passed
Context API Tests: ___/3 passed
Edge Cases: ___/4 passed
User Experience Tests: ___/4 passed
Integration Tests: ___/2 passed

Total: ___/35 passed

Issues Found:
1. ___________
2. ___________
3. ___________
```

## 🚀 Quick Test (5 minutes)

If you're short on time, run these critical tests:

1. [ ] Navigate to `/admin`
2. [ ] Add a new station
3. [ ] Edit the station
4. [ ] Delete the station
5. [ ] Add a new train
6. [ ] Verify validation errors work
7. [ ] Navigate back to user flow

If all 7 pass, the system is working! ✅
