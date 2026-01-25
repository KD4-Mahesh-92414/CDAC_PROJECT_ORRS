package com.orrs.services;

import com.orrs.dto.common.ApiResponseDTO;
import com.orrs.dto.request.AddTrainReqDTO;
import com.orrs.dto.request.UpdateTrainReqDTO;

public interface TrainService {

    // Add new train (ADMIN)
    ApiResponseDTO<?> addTrain(AddTrainReqDTO trainReqDTO);

    // Get all trains (ADMIN)
    ApiResponseDTO<?> getAllTrains();

    // Update train details (ADMIN)
    ApiResponseDTO<?> updateTrain(Long trainId, UpdateTrainReqDTO updateTrainReqDTO);

    // Soft delete train (ADMIN)
    ApiResponseDTO<?> deleteTrain(Long trainId);
}
