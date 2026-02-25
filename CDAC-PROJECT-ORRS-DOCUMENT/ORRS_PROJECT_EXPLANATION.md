# Online Railway Reservation System (ORRS) - Project Explanation

I developed a comprehensive **Online Railway Reservation System** using **Spring Boot** for the backend and **React** for the frontend. This system enables administrators to manage trains, stations, routes, schedules, and fares through a robust admin dashboard, while passengers can search trains, check seat availability in real-time, and book tickets seamlessly. We also used git for version control, where we build our project in a team based development environment.

## Key Technical Highlights

### 1. **Seat Locking Mechanism with Timeout**

Implemented a sophisticated **temporary seat reservation system** that locks selected seats for 5 minutes during the booking process. This prevents double-booking and race conditions when multiple users attempt to book the same seats simultaneously. The system uses `LocalDateTime` expiry tracking and validates seat availability against both active reservations and confirmed bookings before allowing selection.

### 2. **Automatic Train Scheduling using cron job**

Utilized **Spring's @Scheduled annotation** for automated background tasks including expired reservation cleanup and train schedule status updates. This ensures system efficiency by automatically releasing expired seat locks and maintaining data integrity without manual intervention.

### 3. **Multi-Step Booking Flow**

Designed an intuitive **multi-step booking process** with distinct phases:

- **Step 1**: Train search with source/destination stations and journey date
- **Step 2**: Real-time seat selection with dynamic seat matrix visualization
- **Step 3**: Passenger details form with validation
- **Step 4**: Fare breakdown and payment confirmation
- **Step 5**: Booking confirmation with PNR generation

Each step maintains state using **Redux** for seamless navigation and data persistence across the booking journey.

### 4. **Dynamic Seat Matrix Visualization**

Created a **real-time seat availability matrix** that displays seat layouts by coach type (Sleeper, 3AC, 2AC, 1AC) with color-coded status indicators (Available, Reserved, Booked). The matrix updates dynamically based on active reservations and confirmed bookings, providing users with accurate seat availability information.

### 5. **Security Implementation**

Implemented comprehensive security features using **Spring Security** and **JWT authentication**:

- **Role-based access control (RBAC)** differentiating Admin and User roles
- **JWT token-based authentication** stored in sessionStorage for automatic logout on browser close
- **Protected routes** on both frontend and backend with authorization checks
- **Password encryption** using BCrypt for secure credential storage
- **CORS configuration** for secure cross-origin requests

### 6. **PNR Tracking System**

Developed a **PNR (Passenger Name Record) status tracking** feature that allows users to check their booking details, passenger information, seat assignments, and journey status using a unique 10-digit PNR number generated at booking confirmation.

### 7. **Advanced Search with Route Validation**

Implemented intelligent **train search functionality** that validates station connectivity through train routes, ensuring only trains that actually travel between the selected source and destination stations are displayed in search results. The system considers journey dates and schedule availability for accurate results.

### 8. **Transaction Management**

Applied **@Transactional annotations** across service layers to ensure data consistency during critical operations like booking confirmation, payment processing, and ticket generation. This guarantees atomicity where all operations succeed together or roll back completely in case of failures.

### 9. **Exception Handling with @RestControllerAdvice**

Centralized exception handling using **@RestControllerAdvice** to provide consistent error responses across all API endpoints. Custom exceptions like `ResourceNotFoundException`, `BusinessLogicException`, and `ServiceException` are mapped to appropriate HTTP status codes with meaningful error messages.

### 10. **Admin Dashboard with Analytics**

Built a comprehensive **admin dashboard** featuring:

- Real-time statistics (total bookings, revenue, active trains, stations)
- CRUD operations for trains, stations, routes, coach types, seat layouts, and fares
- User management with role assignment
- Booking management with cancellation capabilities
- Train schedule management with status updates (Active, Cancelled, Rescheduled)

## Technology Stack

**Backend**: Spring Boot 3.x, Spring Security, Spring Data JPA, Hibernate, MySQL, JWT, Bean Validation

**Frontend**: React 18, Redux Toolkit, React Router, Axios, Tailwind CSS, Phosphor Icons

**Architecture**: Layered architecture following **SOLID principles** and **separation of concerns**

## Database Design

Utilized **MySQL** with **Hibernate ORM** and **JPA** for efficient database management. The schema includes entities like Station, Train, TrainRoute, TrainSchedule, CoachType, SeatLayout, TrainFare, Booking, Ticket, Payment, and SeatReservation with proper relationships (OneToMany, ManyToOne, ManyToMany) and cascading operations.

## Best Practices Implemented

- **DTO Pattern** for data transfer between layers
- **Repository Pattern** for data access abstraction
- **Service Layer** for business logic encapsulation
- **Global Exception Handling** for consistent error responses
- **Input Validation** using Jakarta Bean Validation annotations
- **Code Reusability** through shared components and utility functions
- **State Management** using Redux for predictable state updates
- **Responsive Design** ensuring mobile and desktop compatibility

## Scalability and Maintainability

To ensure scalability and maintainability, we followed a **layered architecture** by implementing the **modularity concept**. We segregated the project into distinct layers such as **Services**, **Entities**, **Controllers**, **DTOs (Data Transfer Objects)**, **Repositories**, and **Custom Exception Handling**. This modular approach allowed us to maintain clear separation of concerns:

- **Controllers**: Handle HTTP requests and route them to appropriate services
- **Services**: Contain business logic and orchestrate data operations
- **Repositories**: Manage database interactions using Spring Data JPA
- **Entities**: Represent database tables with JPA annotations
- **DTOs**: Transfer data between layers without exposing internal entity structure
- **Exception Handling**: Centralized error management with @RestControllerAdvice

We also implemented best practices like **transaction management** (@Transactional), **optimistic concurrency control** (database-level seat locking), and **database-level synchronization** to handle concurrent bookings. This architecture not only made the system easier to maintain but also ensured that future extensions or feature additions could be implemented without affecting other layers, enhancing both scalability and maintainability.
