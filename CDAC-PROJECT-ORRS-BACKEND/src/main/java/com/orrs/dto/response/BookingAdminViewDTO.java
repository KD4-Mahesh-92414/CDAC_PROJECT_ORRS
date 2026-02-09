package com.orrs.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.orrs.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingAdminViewDTO {
    private Long bookingId;
    private String pnrNumber;
    private Long userId;
    private String userFullName;
    private String userEmail;
    private String trainNumber;
    private String trainName;
    private String sourceStation;
    private String destinationStation;
    private LocalDate journeyDate;
    private String coachType;
    private BigDecimal totalFare;
    private BookingStatus status;
    private LocalDateTime bookingDate;
    private Integer totalPassengers;
}
