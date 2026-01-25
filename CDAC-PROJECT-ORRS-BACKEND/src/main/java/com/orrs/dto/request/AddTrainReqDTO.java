package com.orrs.dto.request;

import com.orrs.enums.TrainStatus;
import com.orrs.enums.TrainType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AddTrainReqDTO {

    @NotBlank(message = "Train number is required")
    @Size(max = 10, message = "Train number must not exceed 10 characters")
    private String trainNumber;

    @NotBlank(message = "Train name is required")
    @Size(max = 100, message = "Train name must not exceed 100 characters")
    private String trainName;

    @NotNull(message = "Train type is required")
    private TrainType trainType;

    @NotNull(message = "Source station id is required")
    @Min(value = 1, message = "Invalid source station id")
    private Long sourceStationId;

    @NotNull(message = "Destination station id is required")
    @Min(value = 1, message = "Invalid destination station id")
    private Long destinationStationId;

    @NotNull(message = "Total distance is required")
    @Min(value = 1, message = "Distance must be greater than 0 km")
    private Integer totalDistanceKm;

    @NotNull(message = "Average speed is required")
    @Min(value = 1, message = "Average speed must be greater than 0")
    private Integer avgSpeed;

    @NotBlank(message = "Days of run is required")
    @Size(max = 50, message = "Days of run must not exceed 50 characters")
    private String daysOfRun; // Example: "Mon,Wed,Fri"

    @NotNull(message = "Train status is required")
    private TrainStatus trainStatus;
}
