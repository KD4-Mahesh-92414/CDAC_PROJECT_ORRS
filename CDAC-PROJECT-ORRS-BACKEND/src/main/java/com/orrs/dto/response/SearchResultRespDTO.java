package com.orrs.dto.response;

import java.time.LocalTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SearchResultRespDTO {

	private Long trainId;
	private Long scheduleId;
    private String trainNumber;
    private String trainName;
    private String trainType;
    
    private String sourceStationName;
    private String destinationStationName;
    private Long sourceStationId;
    private Long destinationStationId;
    
    private LocalTime departureTime;
    private LocalTime arrivalTime;
    private Integer travelDurationMinutes; 
    
    private Integer distanceKm;
    private String daysOfRun;

    private List<TrainCoachRespDTO> classOptions;
    
    // Constructor for repository query
    public SearchResultRespDTO(Long trainId, Long scheduleId, String trainNumber, String trainName, 
                              String trainType, String sourceStationName, String destinationStationName,
                              LocalTime departureTime, LocalTime arrivalTime, Integer travelDurationMinutes,
                              Integer distanceKm, String daysOfRun) {
        this.trainId = trainId;
        this.scheduleId = scheduleId;
        this.trainNumber = trainNumber;
        this.trainName = trainName;
        this.trainType = trainType;
        this.sourceStationName = sourceStationName;
        this.destinationStationName = destinationStationName;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.travelDurationMinutes = travelDurationMinutes;
        this.distanceKm = distanceKm;
        this.daysOfRun = daysOfRun;
    }
}
