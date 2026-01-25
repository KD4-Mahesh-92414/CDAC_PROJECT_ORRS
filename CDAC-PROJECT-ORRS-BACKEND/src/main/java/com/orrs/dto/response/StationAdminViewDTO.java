package com.orrs.dto.response;

import com.orrs.enums.StationStatus;

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
public class StationAdminViewDTO {

    private Long id;
    private String stationName;
    private String stationCode;
    private String city;
    private StationStatus status;
}

