package com.orrs.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orrs.custom_exceptions.InvalidRequestException;
import com.orrs.custom_exceptions.ResourceNotFoundException;
import com.orrs.dto.common.ApiResponseDTO;
import com.orrs.dto.response.BookingAdminViewDTO;
import com.orrs.entities.Booking;
import com.orrs.enums.BookingStatus;
import com.orrs.repositories.BookingRespository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminBookingServiceImpl implements AdminBookingService {

    private final BookingRespository bookingRepository;

    @Override
    @Transactional(readOnly = true)
    public ApiResponseDTO<List<BookingAdminViewDTO>> getAllBookings() {
        try {
            List<BookingAdminViewDTO> bookings = bookingRepository.fetchAllBookingsForAdmin();
            if (bookings == null) {
                bookings = List.of();
            }
            return new ApiResponseDTO<>("Bookings retrieved successfully", "SUCCESS", bookings);
        } catch (Exception e) {
            // Log the error and return empty list
            System.err.println("Error fetching bookings: " + e.getMessage());
            e.printStackTrace();
            return new ApiResponseDTO<>("Error fetching bookings: " + e.getMessage(), "ERROR", List.of());
        }
    }

    @Override
    public ApiResponseDTO<String> cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new InvalidRequestException("Booking is already cancelled");
        }

        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new InvalidRequestException("Only confirmed bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        return new ApiResponseDTO<>("Booking cancelled successfully", "SUCCESS", "Booking has been cancelled");
    }
}
