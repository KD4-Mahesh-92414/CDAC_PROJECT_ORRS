package com.orrs.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orrs.custom_exceptions.BusinessLogicException;
import com.orrs.custom_exceptions.ServiceException;
import com.orrs.dto.common.ApiResponseDTO;
import com.orrs.dto.request.BookingReqDTO;
import com.orrs.dto.request.SeatReservationReqDTO;
import com.orrs.dto.response.BookingRespDTO;
import com.orrs.dto.response.SeatReservationRespDTO;
import com.orrs.entities.Booking;
import com.orrs.entities.CoachType;
import com.orrs.entities.Payment;
import com.orrs.entities.SeatLayout;
import com.orrs.entities.SeatReservation;
import com.orrs.entities.Station;
import com.orrs.entities.Ticket;
import com.orrs.entities.TrainSchedule;
import com.orrs.entities.User;
import com.orrs.enums.Gender;
import com.orrs.repositories.*; // Imports all repositories

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final SeatReservationRepository seatReservationRepository;
    private final BookingRespository bookingRepository;
    private final TrainScheduleRepository scheduleRepository;
    private final StationRepository stationRepository;
    private final UserRepository userRepository;
    private final TrainFareRepository fareRepository;
    private final TrainCoachRepository coachRepository;
    private final CoachTypeRepository coachTypeRepository;
    private final SeatLayoutRepository seatLayoutRepository;

    private static final int RESERVATION_TIMEOUT_MINUTES = 5;

    @Override
    @Transactional
    public ApiResponseDTO<SeatReservationRespDTO> reserveSeats(SeatReservationReqDTO reqDTO, Long userId) {
        
        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime expiryTime = currentTime.plusMinutes(RESERVATION_TIMEOUT_MINUTES);

        // 1. Validate Schedule & User
        TrainSchedule schedule = scheduleRepository.findById(reqDTO.getScheduleId())
                .orElseThrow(() -> new BusinessLogicException("Schedule not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessLogicException("User not found"));

        // 2. Validate Stations
        Station sourceStation = stationRepository.findById(reqDTO.getSourceStationId())
                .orElseThrow(() -> new BusinessLogicException("Source station not found"));
        
        Station destinationStation = stationRepository.findById(reqDTO.getDestinationStationId())
                .orElseThrow(() -> new BusinessLogicException("Destination station not found"));

        // 3. Validate Coach Type
        boolean isValidCoach = coachRepository.existsByTrainIdAndCoachTypeId(
                schedule.getTrain().getId(), 
                reqDTO.getCoachTypeId()
        );

        if (!isValidCoach) {
            throw new BusinessLogicException("Selected Coach Type is not available in this train");
        }
        
        CoachType coachType = coachTypeRepository.findById(reqDTO.getCoachTypeId())
                 .orElseThrow(() -> new BusinessLogicException("Coach Type ID not found"));

        // 4. Validate Selected Seats exist in layout
        List<SeatLayout> seatLayouts = seatLayoutRepository.findByCoachType_IdOrderBySeatNumberAsc(reqDTO.getCoachTypeId());
        List<Integer> validSeatNumbers = seatLayouts.stream()
                .map(SeatLayout::getSeatNumber)
                .toList();

        List<String> invalidSeats = new ArrayList<>();
        for (String seatId : reqDTO.getSelectedSeats()) {
            try {
                String[] parts = seatId.split("-");
                if (parts.length != 2) {
                    invalidSeats.add(seatId);
                    continue;
                }
                
                String coachLabel = parts[0];
                Integer seatNumber = Integer.parseInt(parts[1]);
                
                // Validate coach label exists for this train
                boolean coachExists = coachRepository.existsByTrainIdAndCoachTypeIdAndCoachLabel(
                        schedule.getTrain().getId(), reqDTO.getCoachTypeId(), coachLabel);
                
                if (!coachExists || !validSeatNumbers.contains(seatNumber)) {
                    invalidSeats.add(seatId);
                }
            } catch (Exception e) {
                invalidSeats.add(seatId);
            }
        }

        if (!invalidSeats.isEmpty()) {
            throw new BusinessLogicException("Invalid seat selections: " + String.join(", ", invalidSeats));
        }

        // 5. Check seat availability (Are they already reserved or booked?)
        List<String> reservedSeats = seatReservationRepository.findReservedSeatsSimple(
                reqDTO.getScheduleId(), reqDTO.getCoachTypeId(), reqDTO.getSelectedSeats(), currentTime);

        if (!reservedSeats.isEmpty()) {
            return new ApiResponseDTO<>("Some seats are unavailable", "SEAT_UNAVAILABLE", 
                    new SeatReservationRespDTO(null, null, null, null, "FAILED", reservedSeats, 
                            generateAlternativeSeats(reqDTO, reservedSeats)));
        }

        // 6. Create seat reservations
        List<SeatReservation> reservations = new ArrayList<>();
        
        for (String seatId : reqDTO.getSelectedSeats()) {
            String[] parts = seatId.split("-");
            String coachLabel = parts[0];
            Integer seatNumber = Integer.parseInt(parts[1]);

            SeatReservation reservation = new SeatReservation();
            reservation.setSchedule(schedule);
            reservation.setCoachType(coachType);
            reservation.setCoachLabel(coachLabel);
            reservation.setSeatNumber(seatNumber);
            reservation.setUser(user);
            reservation.setSessionId(reqDTO.getSessionId());
            reservation.setExpiresAt(expiryTime);
            
            reservations.add(reservation);
        }

        seatReservationRepository.saveAll(reservations);

        SeatReservationRespDTO response = new SeatReservationRespDTO(
                reservations.get(0).getId(), reqDTO.getSelectedSeats(), expiryTime, 
                RESERVATION_TIMEOUT_MINUTES, "SUCCESS", null, null);

        return new ApiResponseDTO<>("Seats reserved successfully", "SUCCESS", response);
    }

    @Override
    @Transactional
    public ApiResponseDTO<BookingRespDTO> confirmBooking(BookingReqDTO reqDTO, Long userId) {
        
        System.out.println("=== BOOKING CONFIRMATION STARTED ===");
        System.out.println("Request DTO: " + reqDTO);
        System.out.println("User ID: " + userId);
        
        LocalDateTime currentTime = LocalDateTime.now();

        try {
            // 1. Fetch Active Reservations by reservation ID
            System.out.println("=== STEP 1: FETCHING RESERVATION ===");
            SeatReservation firstReservation = seatReservationRepository.findById(reqDTO.getReservationId())
                    .orElseThrow(() -> new BusinessLogicException("Reservation not found"));

            System.out.println("Found reservation: " + firstReservation.getId());

            if (!firstReservation.getUser().getId().equals(userId)) {
                throw new BusinessLogicException("Unauthorized access to reservation");
            }

            if (firstReservation.getExpiresAt().isBefore(currentTime)) {
                throw new BusinessLogicException("Reservation has expired. Please reserve seats again.");
            }

            // Get all reservations for this user and schedule
            List<SeatReservation> reservations = seatReservationRepository.findActiveReservationsByUser(
                    userId, firstReservation.getSchedule().getId(), currentTime);

            System.out.println("Found " + reservations.size() + " active reservations");

            if (reservations.isEmpty()) {
                throw new BusinessLogicException("No active seat reservations found. Please reserve seats again.");
            }

            TrainSchedule schedule = firstReservation.getSchedule();

            // 2. Validate Counts
            System.out.println("=== STEP 2: VALIDATING COUNTS ===");
            if (reqDTO.getPassengers().size() != reservations.size()) {
                throw new BusinessLogicException("Passenger count (" + reqDTO.getPassengers().size() + 
                    ") does not match reserved seats count (" + reservations.size() + ")");
            }

            // 3. Validate Stations
            System.out.println("=== STEP 3: VALIDATING STATIONS ===");
            Station sourceStation = stationRepository.findById(reqDTO.getSourceStationId())
                    .orElseThrow(() -> new ServiceException("Source station not found"));
            
            Station destStation = stationRepository.findById(reqDTO.getDestStationId())
                    .orElseThrow(() -> new ServiceException("Destination station not found"));

            System.out.println("Source: " + sourceStation.getStationName() + ", Dest: " + destStation.getStationName());

            // 4. Calculate Fare - Use fare sent from frontend
            System.out.println("=== STEP 4: USING FRONTEND CALCULATED FARE ===");
            
            // Get fare per seat from frontend request (already calculated with distance, taxes, etc.)
            BigDecimal farePerSeat = reqDTO.getFarePerSeat() != null ? 
                reqDTO.getFarePerSeat() : 
                calculateFarePerSeat(schedule.getTrain().getId(), firstReservation.getCoachType().getId(), reqDTO.getSourceStationId(), reqDTO.getDestStationId());
            
            BigDecimal totalFare = farePerSeat.multiply(BigDecimal.valueOf(reservations.size()));
            System.out.println("Using fare per seat from frontend: " + farePerSeat + ", Total fare: " + totalFare);

            // 5. Create Booking Header
            System.out.println("=== STEP 5: CREATING BOOKING ===");
            Booking booking = new Booking();
            booking.setPnrNumber(generatePNR());
            booking.setUser(firstReservation.getUser());
            booking.setSchedule(schedule);
            booking.setCoachType(firstReservation.getCoachType());
            booking.setSourceStation(sourceStation);
            booking.setDestinationStation(destStation);
            booking.setJourneyDate(schedule.getDepartureDate());
            booking.setTotalFare(totalFare);
            booking.setStatus(com.orrs.enums.BookingStatus.CONFIRMED);

            System.out.println("Created booking with PNR: " + booking.getPnrNumber());

            booking = bookingRepository.save(booking);
            System.out.println("Saved booking with ID: " + booking.getId());

            // 6. Create Tickets (Passengers)
            System.out.println("=== STEP 6: CREATING TICKETS ===");
            List<BookingRespDTO.PassengerDetailsDTO> passengerDetails = new ArrayList<>();
            
            for (int i = 0; i < reqDTO.getPassengers().size(); i++) {
                BookingReqDTO.PassengerReqDTO passengerReq = reqDTO.getPassengers().get(i);
                SeatReservation reservation = reservations.get(i);

                System.out.println("Creating ticket for passenger: " + passengerReq.getName());

                Ticket ticket = new Ticket();
                ticket.setBooking(booking);
                ticket.setPassengerName(passengerReq.getName());
                ticket.setAge(passengerReq.getAge());
                ticket.setGender(Gender.valueOf(passengerReq.getGender().toUpperCase()));
                
                // Assign the reserved seat
                ticket.setCoachLabel(reservation.getCoachLabel());
                ticket.setSeatNumber(reservation.getSeatNumber());
                ticket.setTicketFare(farePerSeat);

                booking.addTicket(ticket);

                passengerDetails.add(new BookingRespDTO.PassengerDetailsDTO(
                        passengerReq.getName(), passengerReq.getAge(), passengerReq.getGender(),
                        reservation.getCoachLabel() + "-" + reservation.getSeatNumber(),
                        "CONFIRMED", farePerSeat));
            }
            
            System.out.println("Created " + booking.getTickets().size() + " tickets");

            // 6.1. Create Payment Record (Simulating successful payment)
            System.out.println("=== STEP 6.1: CREATING PAYMENT ===");
            Payment payment = new Payment();
            payment.setUser(firstReservation.getUser());
            payment.setBooking(booking);
            payment.setTransactionId(generateTransactionId());
            payment.setAmount(totalFare);
            payment.setPaymentMethod(com.orrs.enums.PaymentMethod.UPI); // Default for now
            payment.setStatus(com.orrs.enums.PaymentStatus.SUCCESS);
            payment.setPaymentDate(LocalDateTime.now());
            payment.setGatewayResponse("Payment successful");
            
            booking.addPayment(payment);
            System.out.println("Created payment with transaction ID: " + payment.getTransactionId());

            // Save booking with tickets and payment
            System.out.println("=== STEP 7: SAVING BOOKING WITH TICKETS AND PAYMENT ===");
            booking = bookingRepository.save(booking);
            System.out.println("Final save completed. Booking ID: " + booking.getId());

            // 7. Delete Reservations (They are now converted to Booking)
            System.out.println("=== STEP 8: DELETING RESERVATIONS ===");
            seatReservationRepository.deleteAll(reservations);
            System.out.println("Deleted " + reservations.size() + " reservations");

            // 8. Response
            System.out.println("=== STEP 9: CREATING RESPONSE ===");
            BookingRespDTO.TrainDetailsDTO trainDetails = new BookingRespDTO.TrainDetailsDTO(
                    schedule.getTrain().getTrainNumber(),
                    schedule.getTrain().getTrainName(),
                    sourceStation.getStationName(),
                    destStation.getStationName(),
                    firstReservation.getCoachType().getTypeName());

            BookingRespDTO response = new BookingRespDTO(
                    booking.getPnrNumber(), "CONFIRMED", totalFare, 
                    schedule.getDepartureDate(), trainDetails, passengerDetails);

            System.out.println("=== BOOKING CONFIRMATION COMPLETED SUCCESSFULLY ===");
            System.out.println("Response: " + response);

            return new ApiResponseDTO<>("Booking confirmed successfully", "SUCCESS", response);
            
        } catch (Exception e) {
            System.err.println("=== BOOKING CONFIRMATION FAILED ===");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public ApiResponseDTO<String> checkReservationStatus(Long reservationId, Long userId) {
        SeatReservation reservation = seatReservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessLogicException("Reservation not found"));

        if (!reservation.getUser().getId().equals(userId)) {
            throw new BusinessLogicException("Unauthorized access to reservation");
        }

        if (reservation.getExpiresAt().isBefore(LocalDateTime.now())) {
            return new ApiResponseDTO<>("Reservation expired", "EXPIRED", "EXPIRED");
        }

        return new ApiResponseDTO<>("Reservation active", "SUCCESS", "ACTIVE");
    }
    
    private String generatePNR() {
        // Generate 10-digit PNR: Format YYYYMMDDXX where XX is random 2-digit number
        LocalDateTime now = LocalDateTime.now();
        String datePart = now.format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randomPart = (int) (Math.random() * 90) + 10; // Random 2-digit number (10-99)
        return datePart + String.format("%02d", randomPart);
    }

    private String generateTransactionId() {
        return "TXN" + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4).toUpperCase();
    }

    private BigDecimal calculateFarePerSeat(Long trainId, Long coachTypeId, Long sourceStationId, Long destinationStationId) {
        System.out.println("=== FARE CALCULATION DEBUG ===");
        System.out.println("Train ID: " + trainId + ", Coach Type ID: " + coachTypeId);
        
        // Get base fare from repository
        BigDecimal baseFare = fareRepository.findByTrainIdAndCoachTypeId(trainId, coachTypeId)
                .map(fare -> {
                    System.out.println("Found base fare in DB: " + fare.getBaseFare());
                    return fare.getBaseFare();
                })
                .orElse(BigDecimal.valueOf(500));
        
        System.out.println("Using base fare: " + baseFare);
        
        // Apply taxes and fees (5% tax + convenience fee)
        BigDecimal tax = baseFare.multiply(BigDecimal.valueOf(0.05));
        BigDecimal convenienceFee = BigDecimal.valueOf(20); // Fixed convenience fee
        BigDecimal finalFare = baseFare.add(tax).add(convenienceFee);
        
        System.out.println("Tax (5%): " + tax + ", Convenience Fee: " + convenienceFee + ", Final Fare: " + finalFare);
        
        return finalFare;
    }
    
    private List<String> generateAlternativeSeats(SeatReservationReqDTO reqDTO, List<String> unavailableSeats) {
        // TODO: Implement intelligent alternative seat suggestion
        return new ArrayList<>();
    }
}