package com.orrs.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateTrainFareStatusReqDTO {

    @NotNull(message = "Active status is required")
    private boolean isActive;
}