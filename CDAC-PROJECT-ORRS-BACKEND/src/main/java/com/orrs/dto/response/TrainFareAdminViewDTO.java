package com.orrs.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class TrainFareAdminViewDTO {

    private Long fareId;
    private Long trainId;
    private String trainNumber;
    private String trainName;
    private String coachTypeCode;
    private BigDecimal ratePerKm;
    private BigDecimal baseFare;
    private boolean isActive;
}