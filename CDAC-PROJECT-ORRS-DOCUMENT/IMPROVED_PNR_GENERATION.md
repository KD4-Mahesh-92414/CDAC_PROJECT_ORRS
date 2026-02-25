# 🎫 Improved PNR Generation - Time-Based Format

## 🔄 Problem with Current Implementation

**Current Format**: `YYYYMMDDXX` (Year + Month + Day + Random)

**Issue**: Only **90 unique PNRs per day** (random numbers 10-99)

**Risk**: High collision probability if 100+ bookings per day

---

## ✅ Improved Solution

**New Format**: `MMDDHHMMSS` (Month + Day + Hour + Minute + Second)

**Benefit**: **86,400 unique PNRs per day** (one per second)

---

## 📝 Improved Code Implementation

### **Updated generatePNR() Method**

```java
private String generatePNR() {
    // Generate 10-digit PNR: Format MMDDHHMMSS
    LocalDateTime now = LocalDateTime.now();
    return now.format(DateTimeFormatter.ofPattern("MMddHHmmss"));
}
```

---

## 🔍 Format Breakdown

**Format**: `MMDDHHMMSS`

| Position | Component | Description | Range | Example |
|----------|-----------|-------------|-------|---------|
| 1-2 | **MM** | Month | 01-12 | 06 |
| 3-4 | **dd** | Day | 01-31 | 15 |
| 5-6 | **HH** | Hour (24-hour) | 00-23 | 14 |
| 7-8 | **mm** | Minute | 00-59 | 30 |
| 9-10 | **ss** | Second | 00-59 | 45 |

**Complete PNR**: `0615143045`

---

## 📊 Generation Examples

| Date | Time | PNR | Breakdown |
|------|------|-----|-----------|
| June 15 | 10:30:45 AM | `0615103045` | 06(Jun) 15(Day) 10(Hour) 30(Min) 45(Sec) |
| June 15 | 11:45:23 AM | `0615114523` | 06(Jun) 15(Day) 11(Hour) 45(Min) 23(Sec) |
| June 15 | 02:15:30 PM | `0615141530` | 06(Jun) 15(Day) 14(Hour) 15(Min) 30(Sec) |
| Dec 25 | 09:00:12 AM | `1225090012` | 12(Dec) 25(Day) 09(Hour) 00(Min) 12(Sec) |
| Jan 01 | 12:00:00 AM | `0101000000` | 01(Jan) 01(Day) 00(Hour) 00(Min) 00(Sec) |

---

## 🎯 Advantages

### **1. High Uniqueness**
- **86,400 seconds per day** = 86,400 unique PNRs
- **40x better** than old format (90 PNRs/day)
- Collision only if 2 bookings in same second

### **2. Sortable**
- PNRs naturally sort by date and time
- Easy to find bookings chronologically

### **3. Readable**
- Can identify booking date and time from PNR
- Example: `0615143045` = June 15 at 2:30:45 PM

### **4. Fixed Length**
- Always 10 digits
- Easy to validate and store

### **5. No Database Query**
- Generated without checking existing PNRs
- Fast generation

### **6. No Random Component**
- Deterministic based on exact time
- Easier to debug and trace

---

## 📈 Uniqueness Analysis

### **Per Day Capacity**

**Full Day (24 hours):**
```
24 hours × 60 minutes × 60 seconds = 86,400 unique PNRs
```

**Peak Hours (12 hours: 8 AM - 8 PM):**
```
12 hours × 60 minutes × 60 seconds = 43,200 unique PNRs
```

**Single Hour:**
```
60 minutes × 60 seconds = 3,600 unique PNRs
```

---

### **Comparison Table**

| Format | Unique PNRs/Day | Collision Risk | Best For |
|--------|-----------------|----------------|----------|
| **YYYYMMDDXX** (Old) | 90 | High (>100 bookings/day) | Low traffic |
| **MMDDHHMMSS** (New) | 86,400 | Very Low | Medium-High traffic |
| **MMDDHHMMSSMS** (With milliseconds) | 86,400,000 | Negligible | Extremely high traffic |

---

## ⚠️ Collision Scenario

**When Collision Happens:**
```
User A books at: 2024-06-15 14:30:45.123
User B books at: 2024-06-15 14:30:45.987
Both get PNR: 0615143045 (same second)
```

**Probability:**
- Depends on booking rate
- If 10 bookings/minute → ~1 collision per 360 minutes (6 hours)
- If 100 bookings/minute → ~1 collision per 36 minutes

---

## 🚀 Further Improvement (Optional)

### **Add Milliseconds for Ultra-High Traffic**

```java
private String generatePNR() {
    LocalDateTime now = LocalDateTime.now();
    String timePart = now.format(DateTimeFormatter.ofPattern("MMddHHmmss"));
    
    // Add 2 digits of milliseconds
    int millis = now.getNano() / 1000000; // Get milliseconds (0-999)
    String millisPart = String.format("%03d", millis).substring(0, 2); // First 2 digits
    
    return timePart + millisPart; // 12 digits: MMDDHHMMSSMS
}
```

**New Format**: `MMDDHHMMSSMS` (12 digits)

**Example**: `061514304523` (June 15, 14:30:45.23)

**Capacity**: **86,400,000 unique PNRs per day** (one per millisecond)

---

## 🔧 Implementation Steps

### **Step 1: Update BookingServiceImpl.java**

**Replace:**
```java
private String generatePNR() {
    LocalDateTime now = LocalDateTime.now();
    String datePart = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
    int randomPart = (int) (Math.random() * 90) + 10;
    return datePart + String.format("%02d", randomPart);
}
```

**With:**
```java
private String generatePNR() {
    LocalDateTime now = LocalDateTime.now();
    return now.format(DateTimeFormatter.ofPattern("MMddHHmmss"));
}
```

---

### **Step 2: Update Database (If Needed)**

**Check PNR column:**
```sql
DESCRIBE bookings;
-- Ensure pnr_number is VARCHAR(10) or VARCHAR(12)
```

**If needed, alter:**
```sql
ALTER TABLE bookings MODIFY COLUMN pnr_number VARCHAR(12);
```

---

### **Step 3: Test Generation**

```java
@Test
public void testPNRGeneration() {
    String pnr1 = generatePNR();
    Thread.sleep(1000); // Wait 1 second
    String pnr2 = generatePNR();
    
    assertNotEquals(pnr1, pnr2); // Should be different
    assertEquals(10, pnr1.length()); // Should be 10 digits
}
```

---

## 📊 Real-World Example

### **Booking Timeline**

```
10:30:45 - User A books → PNR: 0615103045
10:30:46 - User B books → PNR: 0615103046
10:30:47 - User C books → PNR: 0615103047
10:31:00 - User D books → PNR: 0615103100
11:00:00 - User E books → PNR: 0615110000
```

**All unique, no collisions!**

---

## 🎯 Interview Answer

> "The original PNR format used YYYYMMDDXX with a random 2-digit suffix, giving only 90 unique PNRs per day. This creates collision risk for high-traffic systems. I improved it to MMDDHHMMSS format, which uses the exact booking time (month, day, hour, minute, second). This provides 86,400 unique PNRs per day—one for each second. The format is still 10 digits, sortable, and readable. For extremely high traffic, we could add milliseconds to get 86 million unique PNRs per day. The key advantage is deterministic generation based on time, eliminating random collisions while maintaining all benefits of the original format."

---

## ✅ Summary

| Aspect | Old Format | New Format | Improvement |
|--------|-----------|------------|-------------|
| **Format** | YYYYMMDDXX | MMDDHHMMSS | Simpler |
| **Unique/Day** | 90 | 86,400 | **960x better** |
| **Collision Risk** | High | Very Low | **Much safer** |
| **Digits** | 10 | 10 | Same |
| **Sortable** | Yes | Yes | Same |
| **Readable** | Date only | Date + Time | Better |
| **Random** | Yes | No | More predictable |

**Recommendation**: Use `MMDDHHMMSS` format for production! 🚀
