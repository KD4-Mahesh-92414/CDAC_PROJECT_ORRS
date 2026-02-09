package com.orrs.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orrs.dto.common.ApiResponseDTO;
import com.orrs.dto.response.BookingAdminViewDTO;
import com.orrs.services.AdminBookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin/bookings")
@RequiredArgsConstructor
public class AdminBookingController {

    private final AdminBookingService adminBookingService;

    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<BookingAdminViewDTO>>> getAllBookings() {
        ApiResponseDTO<List<BookingAdminViewDTO>> response = adminBookingService.getAllBookings();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<ApiResponseDTO<String>> cancelBooking(@PathVariable Long bookingId) {
        ApiResponseDTO<String> response = adminBookingService.cancelBooking(bookingId);
        return ResponseEntity.ok(response);
    }
}
