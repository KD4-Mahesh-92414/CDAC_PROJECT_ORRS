# 🎯 OOP Concepts in ORRS Project

## 📋 Four Pillars of OOP + Method Overloading & Overriding

---

## 1️⃣ Encapsulation

**Definition**: Hiding internal data and providing controlled access through methods.

### **Real Example:**

**File**: `User.java`

```java
@Entity
@Getter
@Setter
public class User extends BaseEntity {
    
    @Column(length = 100, nullable = false)
    private String password;  // Private - hidden from outside
    
    @Column(length = 60, unique = true)
    private String email;     // Private
    
    private String mobile;    // Private
}
```

**Usage:**

```java
// ❌ Cannot access directly
user.password = "123456";  // Compilation error!

// ✅ Must use setter (controlled access)
user.setPassword(passwordEncoder.encode("123456"));  // Encrypted

// ✅ Getter provides read access
String email = user.getEmail();
```

**Real-World Analogy**: ATM machine - You can't directly access cash inside, must use buttons (methods) to withdraw.

---

## 2️⃣ Inheritance

**Definition**: Child class inherits properties and methods from parent class.

### **Real Example:**

**File**: `BaseEntity.java` (Parent)

```java
@MappedSuperclass
@Getter
@Setter
public class BaseEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @CreationTimestamp
    private LocalDate createdOn;
    
    @UpdateTimestamp
    private LocalDate lastUpdated;
}
```

**File**: `Train.java` (Child)

```java
@Entity
public class Train extends BaseEntity {  // Inherits from BaseEntity
    
    private String trainNumber;
    private String trainName;
    
    // Automatically has: id, createdOn, lastUpdated
}
```

**File**: `User.java` (Child)

```java
@Entity
public class User extends BaseEntity {  // Inherits from BaseEntity
    
    private String email;
    private String password;
    
    // Automatically has: id, createdOn, lastUpdated
}
```

**Usage:**

```java
Train train = new Train();
train.setTrainNumber("12301");
train.setId(1L);           // Inherited from BaseEntity
train.setCreatedOn(date);  // Inherited from BaseEntity

User user = new User();
user.setEmail("john@example.com");
user.setId(42L);           // Inherited from BaseEntity
user.setLastUpdated(date); // Inherited from BaseEntity
```

**Benefits:**
- All 14 entities inherit common fields
- No code duplication
- Single place to modify common behavior

**Real-World Analogy**: All vehicles (Car, Bike, Truck) inherit common features (wheels, engine) from Vehicle parent.

---

## 3️⃣ Polymorphism

**Definition**: Same method name behaves differently based on object type.

### **Real Example 1: Method Overriding (Runtime Polymorphism)**

**File**: `BookingService.java` (Interface)

```java
public interface BookingService {
    ApiResponseDTO<BookingRespDTO> confirmBooking(BookingReqDTO reqDTO, Long userId);
}
```

**File**: `BookingServiceImpl.java` (Implementation 1)

```java
@Service
public class BookingServiceImpl implements BookingService {
    
    @Override  // Overriding interface method
    public ApiResponseDTO<BookingRespDTO> confirmBooking(BookingReqDTO reqDTO, Long userId) {
        // Regular user booking logic
        validateReservations();
        createBooking();
        return new ApiResponseDTO<>("Booking confirmed", "SUCCESS", response);
    }
}
```

**File**: `AdminBookingServiceImpl.java` (Implementation 2)

```java
@Service
public class AdminBookingServiceImpl implements BookingService {
    
    @Override  // Same method, different implementation
    public ApiResponseDTO<BookingRespDTO> confirmBooking(BookingReqDTO reqDTO, Long userId) {
        // Admin booking logic with additional privileges
        skipValidations();
        createBookingWithOverride();
        return new ApiResponseDTO<>("Admin booking confirmed", "SUCCESS", response);
    }
}
```

**Usage:**

```java
BookingService service;  // Interface reference

if (user.getRole() == Role.ADMIN) {
    service = new AdminBookingServiceImpl();  // Admin implementation
} else {
    service = new BookingServiceImpl();       // Regular implementation
}

// Same method call, different behavior based on object type
service.confirmBooking(reqDTO, userId);
```

### **Real Example 2: toString() Overriding**

**File**: `Booking.java`

```java
@Entity
@ToString(exclude = {"tickets", "payments"})  // Overriding toString()
public class Booking extends BaseEntity {
    private String pnrNumber;
    private BigDecimal totalFare;
    
    // Lombok generates custom toString() excluding tickets and payments
}
```

**Usage:**

```java
Booking booking = new Booking();
booking.setPnrNumber("0615143047");

System.out.println(booking);  // Calls overridden toString()
// Output: Booking(pnrNumber=0615143047, totalFare=1484.00)
// (tickets and payments excluded to prevent circular reference)
```

**Real-World Analogy**: Payment method - Same "pay()" action, different behavior (UPI, Card, Cash).

---

## 4️⃣ Abstraction

**Definition**: Hiding implementation details and showing only essential features.

### **Real Example 1: Interface Abstraction**

**File**: `BookingService.java` (Abstract Interface)

```java
public interface BookingService {
    
    // Abstract methods - no implementation
    ApiResponseDTO<SeatReservationRespDTO> reserveSeats(SeatReservationReqDTO reqDTO, Long userId);
    
    ApiResponseDTO<BookingRespDTO> confirmBooking(BookingReqDTO reqDTO, Long userId);
    
    ApiResponseDTO<String> checkReservationStatus(Long reservationId, Long userId);
}
```

**File**: `BookingServiceImpl.java` (Concrete Implementation)

```java
@Service
public class BookingServiceImpl implements BookingService {
    
    @Override
    public ApiResponseDTO<SeatReservationRespDTO> reserveSeats(SeatReservationReqDTO reqDTO, Long userId) {
        // Complex implementation hidden from controller
        // Step 1: Validate schedule
        // Step 2: Validate stations
        // Step 3: Validate coach type
        // Step 4: Check seat availability
        // Step 5: Create reservations
        // Step 6: Set expiry time
        return response;
    }
}
```

**File**: `BookingController.java` (Uses Abstraction)

```java
@RestController
public class BookingController {
    
    private final BookingService bookingService;  // Interface reference
    
    @PostMapping("/reserve")
    public ResponseEntity<?> reserve(@RequestBody SeatReservationReqDTO reqDTO) {
        // Controller doesn't know HOW seats are reserved
        // It just knows WHAT to call
        return ResponseEntity.ok(bookingService.reserveSeats(reqDTO, userId));
    }
}
```

### **Real Example 2: JPA Repository Abstraction**

**File**: `TrainRepository.java`

```java
public interface TrainRepository extends JpaRepository<Train, Long> {
    
    // Abstract method - Spring implements automatically
    List<Train> findAllActiveTrains();
    
    Optional<Train> findByTrainNumber(String trainNumber);
}
```

**Usage:**

```java
@Service
public class TrainServiceImpl {
    
    private final TrainRepository trainRepository;
    
    public List<Train> getActiveTrains() {
        // Don't know HOW Spring executes query
        // Don't know HOW database connection is managed
        // Just know WHAT it returns
        return trainRepository.findAllActiveTrains();
    }
}
```

**Benefits:**
- Controller doesn't need to know complex reservation logic
- Implementation can change without affecting controller
- Easy to test with mock implementations

**Real-World Analogy**: Car driving - You use steering wheel and pedals (interface) without knowing how engine works (implementation).

---

## 5️⃣ Method Overloading (Compile-Time Polymorphism)

**Definition**: Multiple methods with same name but different parameters.

### **Real Example 1: Constructor Overloading**

**File**: `ApiResponseDTO.java`

```java
public class ApiResponseDTO<T> {
    private String message;
    private String status;
    private T data;
    
    // Constructor 1: All parameters
    public ApiResponseDTO(String message, String status, T data) {
        this.message = message;
        this.status = status;
        this.data = data;
    }
    
    // Constructor 2: Without data (overloaded)
    public ApiResponseDTO(String message, String status) {
        this.message = message;
        this.status = status;
        this.data = null;
    }
    
    // Constructor 3: Only message (overloaded)
    public ApiResponseDTO(String message) {
        this.message = message;
        this.status = "SUCCESS";
        this.data = null;
    }
}
```

**Usage:**

```java
// Using constructor 1 (3 parameters)
return new ApiResponseDTO<>("Booking confirmed", "SUCCESS", bookingResponse);

// Using constructor 2 (2 parameters)
return new ApiResponseDTO<>("Seats reserved", "SUCCESS");

// Using constructor 3 (1 parameter)
return new ApiResponseDTO<>("Operation completed");
```

### **Real Example 2: Method Overloading**

**File**: `BookingServiceImpl.java`

```java
@Service
public class BookingServiceImpl {
    
    // Method 1: Calculate fare with all parameters
    public BigDecimal calculateFare(Long trainId, Long coachTypeId, Integer distance) {
        BigDecimal baseFare = fareRepository.findBaseFare(trainId, coachTypeId);
        BigDecimal ratePerKm = fareRepository.findRatePerKm(trainId, coachTypeId);
        return baseFare.add(ratePerKm.multiply(BigDecimal.valueOf(distance)));
    }
    
    // Method 2: Calculate fare with default distance (overloaded)
    public BigDecimal calculateFare(Long trainId, Long coachTypeId) {
        return calculateFare(trainId, coachTypeId, 100);  // Default 100 km
    }
    
    // Method 3: Calculate fare with stations (overloaded)
    public BigDecimal calculateFare(Long trainId, Long coachTypeId, Long sourceId, Long destId) {
        Integer distance = routeRepository.calculateDistance(trainId, sourceId, destId);
        return calculateFare(trainId, coachTypeId, distance);
    }
}
```

**Usage:**

```java
// Call with 3 parameters
BigDecimal fare1 = calculateFare(1L, 2L, 150);

// Call with 2 parameters (uses default distance)
BigDecimal fare2 = calculateFare(1L, 2L);

// Call with 4 parameters (calculates distance from stations)
BigDecimal fare3 = calculateFare(1L, 2L, 5L, 12L);
```

**Real-World Analogy**: Calculator - add(2, 3), add(2, 3, 4), add(2, 3, 4, 5) - same operation, different number of inputs.

---

## 6️⃣ Method Overriding (Runtime Polymorphism)

**Definition**: Child class provides specific implementation of method already defined in parent class.

### **Real Example 1: toString() Overriding**

**File**: `Object.java` (Parent - Java built-in)

```java
public class Object {
    public String toString() {
        return getClass().getName() + "@" + Integer.toHexString(hashCode());
    }
}
```

**File**: `Train.java` (Child - Overrides toString)

```java
@Entity
@ToString  // Lombok overrides toString()
public class Train extends BaseEntity {
    private String trainNumber;
    private String trainName;
    
    // Lombok generates:
    // @Override
    // public String toString() {
    //     return "Train(trainNumber=" + trainNumber + ", trainName=" + trainName + ")";
    // }
}
```

**Usage:**

```java
Train train = new Train();
train.setTrainNumber("12301");
train.setTrainName("Rajdhani Express");

System.out.println(train);  // Calls overridden toString()
// Output: Train(trainNumber=12301, trainName=Rajdhani Express)
// Instead of: Train@15db9742 (default Object.toString())
```

### **Real Example 2: equals() and hashCode() Overriding**

**File**: `BaseEntity.java`

```java
@MappedSuperclass
@EqualsAndHashCode  // Lombok overrides equals() and hashCode()
public class BaseEntity {
    @Id
    private Long id;
    
    // Lombok generates:
    // @Override
    // public boolean equals(Object o) { ... }
    // 
    // @Override
    // public int hashCode() { ... }
}
```

**Usage:**

```java
Train train1 = new Train();
train1.setId(1L);

Train train2 = new Train();
train2.setId(1L);

// Uses overridden equals() method
if (train1.equals(train2)) {  // true (same ID)
    System.out.println("Same train");
}
```

### **Real Example 3: Service Method Overriding**

**File**: `BookingService.java` (Interface)

```java
public interface BookingService {
    ApiResponseDTO<BookingRespDTO> confirmBooking(BookingReqDTO reqDTO, Long userId);
}
```

**File**: `BookingServiceImpl.java` (Implementation)

```java
@Service
public class BookingServiceImpl implements BookingService {
    
    @Override  // Overriding interface method
    public ApiResponseDTO<BookingRespDTO> confirmBooking(BookingReqDTO reqDTO, Long userId) {
        // Specific implementation
        validateReservations();
        createBooking();
        return response;
    }
}
```

**Real-World Analogy**: Recipe - Parent recipe says "add spices", child recipe overrides with specific spices (turmeric, chili, cumin).

---

## 📊 Summary Table

| Concept | Definition | Example in Project |
|---------|-----------|-------------------|
| **Encapsulation** | Data hiding with controlled access | Private fields in User.java with getters/setters |
| **Inheritance** | Child inherits from parent | All entities extend BaseEntity |
| **Polymorphism** | Same interface, different behavior | BookingService with multiple implementations |
| **Abstraction** | Hide complexity, show essentials | Service interfaces hide implementation |
| **Method Overloading** | Same name, different parameters | ApiResponseDTO multiple constructors |
| **Method Overriding** | Child redefines parent method | BookingServiceImpl overrides interface methods |

---

## 🎯 Key Differences

### **Overloading vs Overriding**

| Aspect | Method Overloading | Method Overriding |
|--------|-------------------|-------------------|
| **Definition** | Same name, different parameters | Same name, same parameters |
| **When** | Compile-time (static) | Runtime (dynamic) |
| **Where** | Same class | Parent-child classes |
| **Purpose** | Provide multiple ways to call | Provide specific implementation |
| **Example** | `calculateFare(a, b)` vs `calculateFare(a, b, c)` | Parent `toString()` vs Child `toString()` |

---

## 🎓 Interview Answer Template

> **Question:** "Explain the four pillars of OOP with examples from your project."
>
> **Answer:** "In my ORRS project, I used all four OOP pillars:
>
> **1. Encapsulation** - All entity fields are private with Lombok-generated getters/setters. For example, User entity has private password field that can only be accessed through controlled methods, allowing encryption before storage.
>
> **2. Inheritance** - I created BaseEntity parent class with common fields (id, createdOn, lastUpdated) that all 14 entities inherit from, eliminating code duplication across Train, User, Booking, and other entities.
>
> **3. Polymorphism** - I implemented BookingService interface with different implementations for regular users and admins. The same confirmBooking() method behaves differently based on the object type at runtime.
>
> **4. Abstraction** - I used service interfaces to hide complex implementation details. For example, BookingController only knows what methods to call on BookingService, not how seat reservation logic works internally.
>
> I also used **method overloading** in ApiResponseDTO with multiple constructors accepting different parameters, and **method overriding** where BookingServiceImpl overrides interface methods to provide specific implementations."

---

## ✅ Quick Reference

**Encapsulation** = Hide data, provide controlled access  
**Inheritance** = Reuse code through parent-child relationship  
**Polymorphism** = Same interface, different implementations  
**Abstraction** = Hide complexity, show only essentials  
**Overloading** = Same name, different parameters (compile-time)  
**Overriding** = Redefine parent method in child (runtime)  

**All concepts work together to create clean, maintainable code!** 🚀
