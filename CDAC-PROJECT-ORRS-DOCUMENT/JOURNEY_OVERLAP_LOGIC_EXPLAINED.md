# 🔄 Journey Overlap Logic - Detailed Explanation

## 📋 The SQL Condition

```sql
AND (
    -- Journey overlap logic using sequence numbers
    (srcRoute.sequence_no <= userSrcRoute.sequence_no AND destRoute.sequence_no > userSrcRoute.sequence_no) OR
    (srcRoute.sequence_no < userDestRoute.sequence_no AND destRoute.sequence_no >= userDestRoute.sequence_no) OR
    (srcRoute.sequence_no >= userSrcRoute.sequence_no AND destRoute.sequence_no <= userDestRoute.sequence_no)
)
```

---

## 🎯 Purpose

**These conditions DETECT OVERLAP (conflict).**

**If ANY condition is TRUE → OVERLAP EXISTS → Seat is UNAVAILABLE**  
**If ALL conditions are FALSE → NO OVERLAP → Seat is AVAILABLE**

### **Critical Understanding:**

```sql
WHERE ... AND (
    Condition 1 OR Condition 2 OR Condition 3
)
```

**This query returns bookings that HAVE OVERLAP with user's journey.**

- ✅ **TRUE** = Overlap detected = Conflict = Seat LOCKED
- ❌ **FALSE** = No overlap = No conflict = Seat AVAILABLE

**Think of it as:** "Find all bookings that conflict with my journey"

---

## 🔍 Quick Summary

| Condition Result | Meaning | Seat Status |
|------------------|---------|-------------|
| **Any condition TRUE** | Journeys overlap | ❌ UNAVAILABLE (LOCKED) |
| **All conditions FALSE** | Journeys don't overlap | ✅ AVAILABLE |

**Example:**
```
Existing: Mumbai(1) → Nagpur(3)
User:     Pune(2) → Delhi(5)

Condition 1: TRUE ✅ → OVERLAP DETECTED!
Result: Seat shows as LOCKED (unavailable)
```

---

## 🚂 Train Route Example

**Train**: Rajdhani Express (Mumbai → Delhi)

| Station | Station ID | Sequence No | Distance (km) |
|---------|------------|-------------|---------------|
| Mumbai | 5 | **1** | 0 |
| Pune | 12 | **2** | 150 |
| Nagpur | 8 | **3** | 800 |
| Bhopal | 15 | **4** | 1200 |
| Delhi | 3 | **5** | 1500 |

**Key Point**: We use **sequence_no** (1, 2, 3, 4, 5), NOT station_id (5, 12, 8, 15, 3)

**Why?** Station IDs are auto-generated and don't reflect route order. Sequence numbers represent actual stop order.

---

## 📊 Understanding the Variables

### **Existing Booking (Already in Database)**
- `srcRoute.sequence_no` = Where existing booking starts
- `destRoute.sequence_no` = Where existing booking ends

### **User's Search (Current Request)**
- `userSrcRoute.sequence_no` = Where user wants to start
- `userDestRoute.sequence_no` = Where user wants to end

---

## 🔍 The Three Overlap Conditions

**IMPORTANT:** These conditions check for OVERLAP (conflict). If TRUE → Overlap exists → Seat unavailable.

### **Condition 1: Existing Booking Starts Before/At User's Start**

```sql
(srcRoute.sequence_no <= userSrcRoute.sequence_no AND destRoute.sequence_no > userSrcRoute.sequence_no)
```

**Meaning**: Existing booking starts before (or at) user's start point AND ends after user's start point.

**Visual**:
```
Existing: [========]
User:          [========]
              ↑
         Overlap here!
```

**Example**:
```
Existing Booking: Mumbai(1) → Nagpur(3)
User Searching:   Pune(2) → Delhi(5)

Check: 1 <= 2 AND 3 > 2
       TRUE AND TRUE = TRUE ✅ OVERLAP!

Explanation: Existing booking occupies Pune-Nagpur segment (seq 2-3)
             User also needs Pune-Nagpur segment (seq 2-3)
             CONFLICT! Seat unavailable.
```

**Real-World**: Someone already booked Mumbai to Nagpur. You want Pune to Delhi. Both of you need the seat from Pune to Nagpur → Conflict!

---

### **Condition 2: Existing Booking Ends After/At User's End**

```sql
(srcRoute.sequence_no < userDestRoute.sequence_no AND destRoute.sequence_no >= userDestRoute.sequence_no)
```

**Meaning**: Existing booking starts before user's end point AND ends at (or after) user's end point.

**Visual**:
```
Existing:     [========]
User:     [========]
                    ↑
              Overlap here!
```

**Example**:
```
Existing Booking: Pune(2) → Delhi(5)
User Searching:   Mumbai(1) → Nagpur(3)

Check: 2 < 3 AND 5 >= 3
       TRUE AND TRUE = TRUE ✅ OVERLAP!

Explanation: Existing booking occupies Pune-Nagpur segment (seq 2-3)
             User also needs Pune-Nagpur segment (seq 2-3)
             CONFLICT! Seat unavailable.
```

**Real-World**: Someone already booked Pune to Delhi. You want Mumbai to Nagpur. Both of you need the seat from Pune to Nagpur → Conflict!

---

### **Condition 3: User's Journey Completely Inside Existing Booking**

```sql
(srcRoute.sequence_no >= userSrcRoute.sequence_no AND destRoute.sequence_no <= userDestRoute.sequence_no)
```

**Meaning**: Existing booking is completely contained within user's journey.

**Visual**:
```
Existing:   [====]
User:     [==========]
          ↑        ↑
       Overlap entire existing journey!
```

**Example**:
```
Existing Booking: Pune(2) → Nagpur(3)
User Searching:   Mumbai(1) → Delhi(5)

Check: 2 >= 1 AND 3 <= 5
       TRUE AND TRUE = TRUE ✅ OVERLAP!

Explanation: Existing booking occupies Pune-Nagpur segment (seq 2-3)
             User needs entire route including Pune-Nagpur (seq 1-5)
             CONFLICT! Seat unavailable.
```

**Real-World**: Someone already booked Pune to Nagpur. You want Mumbai to Delhi (which includes Pune to Nagpur) → Conflict!

---

## ✅ Non-Overlapping Scenarios (Seat AVAILABLE)

### **Scenario 1: Existing Ends Exactly Where User Starts**

```
Existing Booking: Mumbai(1) → Pune(2)
User Searching:   Pune(2) → Delhi(5)

Check Condition 1: 1 <= 2 AND 2 > 2 = TRUE AND FALSE = FALSE ❌
Check Condition 2: 1 < 5 AND 2 >= 5 = TRUE AND FALSE = FALSE ❌
Check Condition 3: 1 >= 2 AND 2 <= 5 = FALSE AND TRUE = FALSE ❌

Result: NO OVERLAP ✅ Seat AVAILABLE!
```

**Visual**:
```
Existing: [====]
User:          [========]
              ↑
         No overlap! Different segments.
```

**Real-World**: Someone booked Mumbai to Pune. You want Pune to Delhi. The seat is free from Pune onwards → Available!

---

### **Scenario 2: User Ends Exactly Where Existing Starts**

```
Existing Booking: Nagpur(3) → Delhi(5)
User Searching:   Mumbai(1) → Nagpur(3)

Check Condition 1: 3 <= 1 AND 5 > 1 = FALSE AND TRUE = FALSE ❌
Check Condition 2: 3 < 3 AND 5 >= 3 = FALSE AND TRUE = FALSE ❌
Check Condition 3: 3 >= 1 AND 5 <= 3 = TRUE AND FALSE = FALSE ❌

Result: NO OVERLAP ✅ Seat AVAILABLE!
```

**Visual**:
```
Existing:     [========]
User:     [====]
              ↑
         No overlap! Different segments.
```

**Real-World**: Someone booked Nagpur to Delhi. You want Mumbai to Nagpur. The seat is free until Nagpur → Available!

---

### **Scenario 3: Completely Separate Journeys**

```
Existing Booking: Mumbai(1) → Pune(2)
User Searching:   Nagpur(3) → Delhi(5)

Check Condition 1: 1 <= 3 AND 2 > 3 = TRUE AND FALSE = FALSE ❌
Check Condition 2: 1 < 5 AND 2 >= 5 = FALSE AND FALSE = FALSE ❌
Check Condition 3: 1 >= 3 AND 2 <= 5 = FALSE AND TRUE = FALSE ❌

Result: NO OVERLAP ✅ Seat AVAILABLE!
```

**Visual**:
```
Existing: [====]
User:               [========]
         
         No overlap! Completely separate.
```

**Real-World**: Someone booked Mumbai to Pune. You want Nagpur to Delhi. No common segment → Available!

---

## 📊 Complete Truth Table

| Existing Start | Existing End | User Start | User End | Condition 1 | Condition 2 | Condition 3 | Result |
|----------------|--------------|------------|----------|-------------|-------------|-------------|--------|
| 1 | 3 | 2 | 5 | ✅ TRUE | ✅ TRUE | ❌ FALSE | **OVERLAP** |
| 2 | 5 | 1 | 3 | ❌ FALSE | ✅ TRUE | ❌ FALSE | **OVERLAP** |
| 2 | 3 | 1 | 5 | ❌ FALSE | ❌ FALSE | ✅ TRUE | **OVERLAP** |
| 1 | 2 | 2 | 5 | ❌ FALSE | ❌ FALSE | ❌ FALSE | **NO OVERLAP** |
| 3 | 5 | 1 | 3 | ❌ FALSE | ❌ FALSE | ❌ FALSE | **NO OVERLAP** |
| 1 | 2 | 3 | 5 | ❌ FALSE | ❌ FALSE | ❌ FALSE | **NO OVERLAP** |

---

## 🎯 Real-World Examples

### **Example 1: Peak Hour Conflict**

```
Train: Rajdhani Express (Mumbai → Delhi)
Date: June 15, 2024
Coach: S1, Seat: 15

Existing Booking:
- Passenger: John
- Journey: Mumbai(1) → Nagpur(3)
- Status: CONFIRMED

User Searching:
- Passenger: You
- Journey: Pune(2) → Bhopal(4)

Overlap Check:
Condition 1: 1 <= 2 AND 3 > 2 = TRUE AND TRUE = TRUE ✅

Result: Seat 15 shows as LOCKED (unavailable)
Reason: Both need Pune-Nagpur segment (seq 2-3)
```

---

### **Example 2: Segment-Based Availability**

```
Train: Rajdhani Express (Mumbai → Delhi)
Date: June 15, 2024
Coach: S1, Seat: 20

Existing Booking:
- Passenger: Sarah
- Journey: Mumbai(1) → Pune(2)
- Status: CONFIRMED

User Searching:
- Passenger: You
- Journey: Pune(2) → Delhi(5)

Overlap Check:
Condition 1: 1 <= 2 AND 2 > 2 = TRUE AND FALSE = FALSE ❌
Condition 2: 1 < 5 AND 2 >= 5 = TRUE AND FALSE = FALSE ❌
Condition 3: 1 >= 2 AND 2 <= 5 = FALSE AND TRUE = FALSE ❌

Result: Seat 20 shows as AVAILABLE
Reason: Sarah gets off at Pune, you board at Pune. No overlap!
```

---

## 🔧 Why This Logic is Critical

### **Without Overlap Detection:**
```
❌ Same seat booked twice for overlapping journeys
❌ Two passengers assigned same seat
❌ Conflict at boarding time
❌ Customer complaints
❌ System failure
```

### **With Overlap Detection:**
```
✅ Seat can be booked for multiple non-overlapping segments
✅ Maximum seat utilization
✅ No conflicts
✅ Happy customers
✅ Efficient system
```

---

## 💡 Key Insights

### **1. Sequence Numbers are Essential**
- Station IDs: 5, 12, 8, 15, 3 (random order)
- Sequence Numbers: 1, 2, 3, 4, 5 (logical order)
- **Must use sequence numbers for correct overlap detection!**

### **2. Boundary Conditions Matter**
- `destRoute.sequence_no > userSrcRoute.sequence_no` (strictly greater)
- `destRoute.sequence_no >= userDestRoute.sequence_no` (greater or equal)
- These ensure exact boundary cases (same station) don't count as overlap

### **3. Three Conditions Cover All Cases**
- Condition 1: Existing starts before user
- Condition 2: Existing ends after user
- Condition 3: User completely contains existing
- Together, they catch ALL possible overlaps

### **4. Segment-Based Booking**
- Same seat can be sold multiple times per journey
- Mumbai→Pune (Seat 15) + Pune→Delhi (Seat 15) = 2 bookings, 1 seat
- Maximizes revenue and utilization

---

## 🎓 Interview Answer Template

> **Question:** "Explain the journey overlap logic in your booking system."
>
> **Answer:** "Our system uses sequence numbers from the train_routes table to detect journey overlaps. We have three conditions that check if an existing booking conflicts with a user's requested journey:
>
> 1. **Condition 1** checks if the existing booking starts before or at the user's start point and ends after it - meaning the existing booking covers the user's starting segment.
>
> 2. **Condition 2** checks if the existing booking starts before the user's end point and ends at or after it - meaning the existing booking covers the user's ending segment.
>
> 3. **Condition 3** checks if the user's journey completely contains the existing booking - meaning the user needs the entire segment that's already booked.
>
> If any condition is true, there's an overlap and the seat is unavailable. If all three are false, the journeys don't overlap and the seat can be booked. This enables segment-based booking where the same seat can be sold for Mumbai-Pune and then Pune-Delhi separately, maximizing utilization. We use sequence numbers instead of station IDs because sequence numbers represent the actual route order, while station IDs are just auto-generated numbers."

---

## 📝 Summary

**The Logic**: Three OR conditions check different overlap scenarios  
**The Goal**: Detect if two journeys share any common segment  
**The Benefit**: Enable segment-based booking for maximum efficiency  
**The Key**: Use sequence numbers, not station IDs  

**Simple Rule**: If journeys share ANY station segment → OVERLAP → Seat unavailable ❌  
If journeys are completely separate → NO OVERLAP → Seat available ✅
