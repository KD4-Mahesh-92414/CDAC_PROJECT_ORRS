package com.orrs.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AddTrainFareReqDTO {

    @NotNull(message = "Train ID is required")
    @Min(value = 1, message = "Invalid train ID")
    private Long trainId;

    @NotNull(message = "Coach type ID is required")
    @Min(value = 1, message = "Invalid coach type ID")
    private Long coachTypeId;

    @NotNull(message = "Rate per km is required")
    @DecimalMin(value = "0.01", message = "Rate per km must be greater than 0")
    private BigDecimal ratePerKm;

    @NotNull(message = "Base fare is required")
    @DecimalMin(value = "0.01", message = "Base fare must be greater than 0")
    private BigDecimal baseFare;

    @NotNull(message = "Active status is required")
    private boolean isActive;
}