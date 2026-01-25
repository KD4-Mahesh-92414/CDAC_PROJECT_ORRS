package com.orrs.dto.response;

import com.orrs.enums.TrainStatus;
import com.orrs.enums.TrainType;

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
public class TrainAdminViewDTO {

    private Long id;
    private String trainNumber;
    private String trainName;
    private TrainType trainType;
    private String sourceStation;
    private String destinationStation;
    private Integer totalDistanceKm;
    private Integer avgSpeed;
    private String daysOfRun;
    private TrainStatus trainStatus;
}

