package com.orrs.services;

import java.util.List;

import com.orrs.dto.common.ApiResponseDTO;
import com.orrs.dto.request.AddTrainFareReqDTO;
import com.orrs.dto.request.UpdateTrainFareReqDTO;
import com.orrs.dto.request.UpdateTrainFareStatusReqDTO;
import com.orrs.dto.response.TrainFareAdminViewDTO;

public interface TrainFareService {

    ApiResponseDTO<?> addTrainFare(AddTrainFareReqDTO dto);
    
    List<TrainFareAdminViewDTO> getAllTrainFares();
    
    ApiResponseDTO<?> updateTrainFare(Long fareId, UpdateTrainFareReqDTO dto);
    
    ApiResponseDTO<?> updateTrainFareStatus(Long fareId, UpdateTrainFareStatusReqDTO dto);
    
    ApiResponseDTO<?> deleteTrainFare(Long fareId);
}