# 🎫 PNR Generation & ⏰ Cron Job Scheduling

## 📋 Table of Contents
1. [PNR Generation Logic](#pnr-generation-logic)
2. [Transaction ID Generation](#transaction-id-generation)
3. [Cron Job Scheduling Implementation](#cron-job-scheduling-implementation)
4. [Complete Flow Diagrams](#complete-flow-diagrams)

---

## 🎫 PNR Generation Logic

### **Code Implementation**

**Location**: `BookingServiceImpl.java`

```java
private String generatePNR() {
    // Generate 10-digit PNR: Format MMDDMMSSXX
    // MM = Month, DD = Day, MM = Minute, SS = Second, XX = Random (10-99)
    LocalDateTime now = LocalDateTime.now();
    String timePart = now.format(DateTimeFormatter.ofPattern("MMddmmss"));
    int randomPart = (int) (Math.random() * 90) + 10; // Random 2-digit number (10-99)
    return timePart + String.format("%02d", randomPart);
}
```

---

### **PNR Format Breakdown**

**Format**: `MMDDMMSSXX` (All 2-digit components)

| Position | Component | Description | Range | Example |
|----------|-----------|-------------|-------|---------|
| 1-2 | **MM** | Month | 01-12 | 06 |
| 3-4 | **DD** | Day | 01-31 | 15 |
| 5-6 | **MM** | Minute | 00-59 | 30 |
| 7-8 | **SS** | Second | 00-59 | 45 |
| 9-10 | **XX** | Random | 10-99 | 47 |

**Complete PNR**: `0615304547`

**Capacity**: **7,776,000 unique PNRs per day** (60 min × 60 sec × 90 random × 24 hours)

---

### **Generation Logic Explained**

**Step 1: Get Current Date-Time**
```java
LocalDateTime now = LocalDateTime.now();
// Example: 2024-06-15T14:30:45
```

**Step 2: Format Time Part (MMDDMMSS)**
```java
String timePart = now.format(DateTimeFormatter.ofPattern("MMddmmss"));
// Pattern breakdown:
// MM = Month (06)
// dd = Day (15)
// mm = Minute (30)
// ss = Second (45)
// Result: "06153045"
```

**Step 3: Generate Random 2-Digit Number (10-99)**
```java
int randomPart = (int) (Math.random() * 90) + 10;
// Math.random() generates 0.0 to 0.999...
// Multiply by 90 → 0.0 to 89.999...
// Cast to int → 0 to 89
// Add 10 → 10 to 99
// Example: 47
```

**Step 4: Format Random Part (Ensure 2 digits)**
```java
String.format("%02d", randomPart)
// %02d = format as 2-digit integer with leading zeros
// Example: 47 → "47", 5 → "05"
```

**Step 5: Concatenate**
```java
return timePart + String.format("%02d", randomPart);
// "06153045" + "47" = "0615304547"
```

---

### **Example PNR Generation Timeline**

| Date | Time | Random | PNR | Breakdown |
|------|------|--------|-----|-----------|
| June 15 | 10:30:45 AM | 23 | `0615304523` | 06(Jun) 15(Day) 30(Min) 45(Sec) 23(Rand) |
| June 15 | 10:30:46 AM | 78 | `0615304678` | 06(Jun) 15(Day) 30(Min) 46(Sec) 78(Rand) |
| June 15 | 02:15:30 PM | 45 | `0615153045` | 06(Jun) 15(Day) 15(Min) 30(Sec) 45(Rand) |
| Dec 25 | 09:00:12 AM | 91 | `1225001291` | 12(Dec) 25(Day) 00(Min) 12(Sec) 91(Rand) |

---

### **Why This Format?**

**Advantages:**
✅ **Highly Unique**: 7,776,000 unique PNRs per day (60 min × 60 sec × 90 random)  
✅ **All 2-Digit Components**: Clean, uniform format (MM-DD-MM-SS-XX)  
✅ **Sortable**: PNRs naturally sort by date and time  
✅ **Readable**: Easy to identify booking date and time  
✅ **Fixed Length**: Always 10 digits  
✅ **Second Precision**: High time resolution  
✅ **Random Suffix**: Extra collision protection  
✅ **No Database Query**: Generated without checking existing PNRs

**Collision Probability:**
- Per second: 90 possible random numbers (10-99)
- Collision only if: Same second + same random number
- Probability: 1/90 = 1.1% per booking in same second
- Real-world: Extremely rare with random distribution

**Capacity Analysis:**
```
Per second: 90 unique PNRs
Per minute: 60 × 90 = 5,400 unique PNRs
Per hour: 60 × 60 × 90 = 324,000 unique PNRs
Per day: 24 × 324,000 = 7,776,000 unique PNRs
```

---

### **Where PNR is Used**

**1. Booking Confirmation**
```java
Booking booking = new Booking();
booking.setPnrNumber(generatePNR()); // Called here
booking.setUser(user);
booking.setSchedule(schedule);
// ... rest of booking creation
```

**2. Response to User**
```json
{
  "pnrNumber": "0615304547",
  "status": "CONFIRMED",
  "totalFare": 1484.0,
  "passengers": [...]
}
```

**3. PNR Status Check**
```
User enters PNR: 0615304547
System queries: SELECT * FROM bookings WHERE pnr_number = '0615304547'
Returns: Booking details, passenger info, journey details
```

---

## 💳 Transaction ID Generation

### **Code Implementation**

```java
private String generateTransactionId() {
    return "TXN" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
}
```

---

### **Transaction ID Format**

**Format**: `TXN{timestamp}{uuid-4-chars}`

**Example**: `TXN1718456789123ABCD`

| Component | Description | Example |
|-----------|-------------|---------|
| **TXN** | Prefix | TXN |
| **Timestamp** | Current time in milliseconds | 1718456789123 |
| **UUID** | First 4 chars of UUID (uppercase) | ABCD |

---

### **Generation Logic Explained**

**Step 1: Get Current Timestamp**
```java
System.currentTimeMillis()
// Returns milliseconds since Jan 1, 1970 (Unix epoch)
// Example: 1718456789123
```

**Step 2: Generate UUID**
```java
UUID.randomUUID().toString()
// Generates: "a3f2b1c4-5678-9abc-def0-123456789abc"
```

**Step 3: Extract First 4 Characters**
```java
.substring(0, 4)
// Takes first 4 chars: "a3f2"
```

**Step 4: Convert to Uppercase**
```java
.toUpperCase()
// Result: "A3F2"
```

**Step 5: Concatenate**
```java
"TXN" + "1718456789123" + "A3F2"
// Result: "TXN1718456789123A3F2"
```

---

### **Why This Format?**

**Advantages:**
✅ **Unique**: Timestamp + UUID ensures uniqueness  
✅ **Traceable**: Timestamp shows exact payment time  
✅ **Readable**: TXN prefix clearly identifies transaction  
✅ **Sortable**: Chronologically ordered by timestamp

---

## ⏰ Cron Job Scheduling Implementation

### **1. Enable Scheduling**

**Location**: `Application.java`

```java
@SpringBootApplication
@EnableScheduling  // ← Enables scheduling functionality
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

**What It Does:**
- Activates Spring's task scheduler
- Scans for `@Scheduled` annotations
- Registers scheduled methods with task executor

---

### **2. Scheduled Service Implementation**

**Location**: `TrainSchedulingServiceImpl.java`

```java
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TrainSchedulingServiceImpl implements TrainSchedulingService {

    private final TrainRepository trainRepository;
    private final TrainScheduleRepository trainScheduleRepository;

    // Method 1: Manual Initial Scheduling (Called once on startup or for new trains)
    @Override
    public void scheduleTrainsForNext60Days() {
        log.info("Starting initial 60-day train scheduling...");
        
        List<Train> activeTrains = trainRepository.findAllActiveTrains();
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(60);
        
        int totalScheduled = 0;
        
        for (Train train : activeTrains) {
            // Check if train has any existing schedules
            boolean hasSchedules = trainScheduleRepository.existsByTrainId(train.getId());
            
            if (!hasSchedules) {
                // New train - schedule for next 60 days
                log.info("New train detected: {} - Scheduling for 60 days", train.getTrainName());
                
                List<DayOfWeek> runningDays = parseDaysOfRun(train.getDaysOfRun());
                
                for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                    if (runningDays.contains(date.getDayOfWeek())) {
                        if (!trainScheduleRepository.existsByTrainIdAndDate(train.getId(), date)) {
                            TrainSchedule schedule = new TrainSchedule();
                            schedule.setTrain(train);
                            schedule.setDepartureDate(date);
                            schedule.setStatus(ScheduleStatus.RUNNING);
                            
                            trainScheduleRepository.save(schedule);
                            totalScheduled++;
                        }
                    }
                }
            }
        }
        
        log.info("Initial 60-day scheduling completed. Total schedules created: {}", totalScheduled);
    }

    // Method 2: Automated Daily Scheduling (Runs automatically at midnight)
    @Override
    @Scheduled(cron = "0 1 0 * * ?") // Run daily at 12:01 AM
    public void scheduleTrainsForNextDay() {
        log.info("Starting daily train scheduling for 60th day from now...");
        
        List<Train> activeTrains = trainRepository.findAllActiveTrains();
        LocalDate targetDate = LocalDate.now().plusDays(60); // Schedule for 60th day
        
        int totalScheduled = 0;
        
        for (Train train : activeTrains) {
            List<DayOfWeek> runningDays = parseDaysOfRun(train.getDaysOfRun());
            
            if (runningDays.contains(targetDate.getDayOfWeek())) {
                // Check if schedule already exists
                if (!trainScheduleRepository.existsByTrainIdAndDate(train.getId(), targetDate)) {
                    TrainSchedule schedule = new TrainSchedule();
                    schedule.setTrain(train);
                    schedule.setDepartureDate(targetDate);
                    schedule.setStatus(ScheduleStatus.RUNNING);
                    
                    trainScheduleRepository.save(schedule);
                    totalScheduled++;
                }
            }
        }
        
        log.info("Daily scheduling completed for date: {}. Total schedules created: {}", targetDate, totalScheduled);
    }

    // Helper method to parse days of run
    private List<DayOfWeek> parseDaysOfRun(String daysOfRun) {
        List<DayOfWeek> days = new ArrayList<>();
        
        if (daysOfRun == null || daysOfRun.trim().isEmpty()) {
            return days;
        }
        
        String[] dayStrings = daysOfRun.split(",");
        
        for (String dayStr : dayStrings) {
            String trimmedDay = dayStr.trim().toUpperCase();
            
            switch (trimmedDay) {
                case "MON", "MONDAY" -> days.add(DayOfWeek.MONDAY);
                case "TUE", "TUESDAY" -> days.add(DayOfWeek.TUESDAY);
                case "WED", "WEDNESDAY" -> days.add(DayOfWeek.WEDNESDAY);
                case "THU", "THURSDAY" -> days.add(DayOfWeek.THURSDAY);
                case "FRI", "FRIDAY" -> days.add(DayOfWeek.FRIDAY);
                case "SAT", "SATURDAY" -> days.add(DayOfWeek.SATURDAY);
                case "SUN", "SUNDAY" -> days.add(DayOfWeek.SUNDAY);
                case "DAILY" -> {
                    return Arrays.asList(DayOfWeek.values()); // All days
                }
                default -> log.warn("Unknown day format: {} for train scheduling", trimmedDay);
            }
        }
        
        return days;
    }
}
```

---

### **3. Cron Expression Explained**

**Expression**: `0 1 0 * * ?`

| Position | Value | Meaning |
|----------|-------|---------|
| 1st | 0 | Second = 0 |
| 2nd | 1 | Minute = 1 |
| 3rd | 0 | Hour = 0 (midnight) |
| 4th | * | Day of month = Every day |
| 5th | * | Month = Every month |
| 6th | ? | Day of week = No specific value |

**Result**: Runs every day at **00:01:00** (12:01 AM)

---

### **Common Cron Expressions**

| Expression | Description |
|------------|-------------|
| `0 0 * * * ?` | Every hour at minute 0 |
| `0 */15 * * * ?` | Every 15 minutes |
| `0 0 2 * * ?` | Every day at 2:00 AM |
| `0 0 9 * * MON-FRI` | Weekdays at 9:00 AM |
| `0 30 8 1 * ?` | 1st of every month at 8:30 AM |
| `0 0 0 * * SUN` | Every Sunday at midnight |

---

## 📊 Complete Flow Diagrams

### **Flow 1: PNR Generation During Booking**

```
User Confirms Booking
        ↓
BookingController.confirmBooking()
        ↓
BookingServiceImpl.confirmBooking()
        ↓
    [Validate Reservations]
        ↓
    [Calculate Fare]
        ↓
    [Create Booking Entity]
        ↓
    generatePNR() ← Called here
        ↓
    Get current time: 2024-06-15T14:30:45
        ↓
    Format as MMDDMMSS: "06153045"
        ↓
    Generate random: 47
        ↓
    Concatenate: "0615304547"
        ↓
    booking.setPnrNumber("0615304547")
        ↓
    [Create Tickets]
        ↓
    [Create Payment]
        ↓
    generateTransactionId() ← Called here
        ↓
    Get timestamp: 1718456789123
        ↓
    Generate UUID: "a3f2b1c4-..."
        ↓
    Extract 4 chars: "A3F2"
        ↓
    Concatenate: "TXN1718456789123A3F2"
        ↓
    payment.setTransactionId("TXN1718456789123A3F2")
        ↓
    [Save to Database]
        ↓
    [Delete Reservations]
        ↓
Return Response with PNR to User
```

---

### **Flow 2: Cron Job Scheduling**

```
Application Startup
        ↓
@EnableScheduling activated
        ↓
Spring scans for @Scheduled methods
        ↓
Finds: scheduleTrainsForNextDay()
        ↓
Registers with Task Scheduler
        ↓
    [Application Running]
        ↓
    [Users booking tickets]
        ↓
    [Time: 23:59:59]
        ↓
    [Time: 00:00:00 - Midnight]
        ↓
    [Time: 00:01:00] ← Cron triggers
        ↓
scheduleTrainsForNextDay() executes
        ↓
    [Step 1: Fetch Active Trains]
    Query: SELECT * FROM trains WHERE status = 'ACTIVE'
    Result: [Train1, Train2, Train3, ...]
        ↓
    [Step 2: Calculate Target Date]
    targetDate = LocalDate.now().plusDays(1)
    Example: 2024-06-16
        ↓
    [Step 3: Loop Through Each Train]
        ↓
    For Train1 (Rajdhani Express):
        ↓
        Parse daysOfRun: "Mon,Wed,Fri,Sun"
        Result: [MONDAY, WEDNESDAY, FRIDAY, SUNDAY]
        ↓
        Check if targetDate (2024-06-16) is Sunday
        Result: Yes
        ↓
        Check if schedule exists:
        Query: SELECT * FROM train_schedules 
               WHERE train_id = 1 AND departure_date = '2024-06-16'
        Result: Not found
        ↓
        Create new schedule:
        INSERT INTO train_schedules 
        (train_id, departure_date, status) 
        VALUES (1, '2024-06-16', 'RUNNING')
        ↓
        totalScheduled++
        ↓
    For Train2 (Shatabdi Express):
        ↓
        Parse daysOfRun: "DAILY"
        Result: [MON, TUE, WED, THU, FRI, SAT, SUN]
        ↓
        Check if targetDate (2024-06-16) is in list
        Result: Yes
        ↓
        Check if schedule exists: No
        ↓
        Create new schedule
        ↓
        totalScheduled++
        ↓
    [Repeat for all trains]
        ↓
    [Step 4: Log Results]
    log.info("Daily scheduling completed for date: 2024-06-16. Total schedules created: 15")
        ↓
    [Method Completes]
        ↓
    [Wait for next trigger: Tomorrow 00:01:00]
```

---

### **Flow 3: Train Days of Run Parsing**

```
Input: "Mon,Wed,Fri"
        ↓
parseDaysOfRun("Mon,Wed,Fri")
        ↓
Split by comma: ["Mon", "Wed", "Fri"]
        ↓
Loop through each:
        ↓
    "Mon" → trim → "MON" → DayOfWeek.MONDAY
    "Wed" → trim → "WED" → DayOfWeek.WEDNESDAY
    "Fri" → trim → "FRI" → DayOfWeek.FRIDAY
        ↓
Return: [MONDAY, WEDNESDAY, FRIDAY]
```

**Special Case - DAILY:**
```
Input: "DAILY"
        ↓
parseDaysOfRun("DAILY")
        ↓
Matches "DAILY" case
        ↓
Return: [MON, TUE, WED, THU, FRI, SAT, SUN]
```

---

## 🎯 Key Takeaways

### **PNR Generation:**
- **Format**: MMDDMMSSXX (10 digits, all 2-digit components)
- **Components**: Month + Day + Minute + Second + Random
- **Uniqueness**: 7,776,000 PNRs per day
- **No DB Query**: Generated without checking existing PNRs

### **Transaction ID Generation:**
- **Format**: TXN{timestamp}{uuid-4-chars}
- **Components**: Prefix + Timestamp + UUID
- **Uniqueness**: Timestamp + UUID guarantees uniqueness
- **Traceability**: Timestamp shows exact payment time

### **Cron Job Scheduling:**
- **Trigger**: `@Scheduled(cron = "0 1 0 * * ?")` = Daily at 12:01 AM
- **Purpose**: Auto-create train schedules for next day
- **Logic**: Check train's running days, create schedule if matches
- **Idempotency**: Checks if schedule exists before creating
- **Logging**: Tracks execution and results

### **Why Cron Job at 12:01 AM?**
- ✅ Low traffic time (minimal user impact)
- ✅ Schedules ready before users wake up
- ✅ Gives full day for bookings
- ✅ Consistent daily execution

---

## 📝 Interview Answer Template

> "PNR generation uses a 10-digit format MMDDMMSSXX with all 2-digit components: month, day, minute, second, and random number (10-99). For example, a booking on June 15 at 2:30:45 PM might generate PNR 0615304547. This provides 7.7 million unique PNRs per day—60 minutes times 60 seconds times 90 random numbers times 24 hours. The format is sortable, readable, and doesn't require database queries. Transaction IDs use TXN{timestamp}{uuid} for guaranteed uniqueness.
>
> For scheduling, we use Spring's `@Scheduled` annotation with cron expression '0 1 0 * * ?' to run daily at 12:01 AM. The `@EnableScheduling` annotation activates the scheduler. The scheduled method fetches all active trains, checks their running days (like Mon,Wed,Fri), and creates train schedules for the next day if they don't already exist. This ensures schedules are always available 30 days in advance without manual intervention. The cron job runs at midnight to avoid peak traffic and ensure schedules are ready for morning users."

**Key Point**: PNR = All 2-digit components (7.7M/day), Cron = Automated daily task at midnight! 🎫⏰
