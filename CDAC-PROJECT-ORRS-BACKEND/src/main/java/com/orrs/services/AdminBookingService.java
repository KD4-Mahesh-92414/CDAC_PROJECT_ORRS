package com.orrs.services;

import java.util.List;

import com.orrs.dto.common.ApiResponseDTO;
import com.orrs.dto.response.BookingAdminViewDTO;

public interface AdminBookingService {
    ApiResponseDTO<List<BookingAdminViewDTO>> getAllBookings();
    ApiResponseDTO<String> cancelBooking(Long bookingId);
}
