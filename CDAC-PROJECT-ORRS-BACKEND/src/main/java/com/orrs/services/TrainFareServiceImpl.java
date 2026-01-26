package com.orrs.services;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.orrs.custom_exceptions.InvalidRequestException;
import com.orrs.custom_exceptions.ResourceAlreadyExistsException;
import com.orrs.custom_exceptions.ResourceNotFoundException;
import com.orrs.dto.common.ApiResponseDTO;
import com.orrs.dto.request.AddTrainFareReqDTO;
import com.orrs.dto.request.UpdateTrainFareReqDTO;
import com.orrs.dto.request.UpdateTrainFareStatusReqDTO;
import com.orrs.dto.response.TrainFareAdminViewDTO;
import com.orrs.entities.CoachType;
import com.orrs.entities.Train;
import com.orrs.entities.TrainFare;
import com.orrs.repositories.CoachTypeRepository;
import com.orrs.repositories.TrainFareRepository;
import com.orrs.repositories.TrainRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class TrainFareServiceImpl implements TrainFareService {

    private final TrainFareRepository trainFareRepo;
    private final TrainRepository trainRepo;
    private final CoachTypeRepository coachTypeRepo;
    private final ModelMapper modelMapper;

    @Override
    public ApiResponseDTO<?> addTrainFare(AddTrainFareReqDTO dto) {
        
        if (trainFareRepo.findByTrainIdAndCoachTypeIdAndIsDeletedFalse(dto.getTrainId(), dto.getCoachTypeId()).isPresent()) {
            throw new ResourceAlreadyExistsException("Fare already exists for this train and coach type");
        }

        Train train = trainRepo.findById(dto.getTrainId())
                .orElseThrow(() -> new ResourceNotFoundException("Train not found"));

        CoachType coachType = coachTypeRepo.findById(dto.getCoachTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Coach type not found"));

        TrainFare trainFare = modelMapper.map(dto, TrainFare.class);
        trainFare.setTrain(train);
        trainFare.setCoachType(coachType);
        trainFare.setActive(dto.isActive());
        trainFare.setDeleted(false);

        trainFareRepo.save(trainFare);

        return new ApiResponseDTO<>("Train fare added successfully", "SUCCESS", null);
    }

    @Override
    public List<TrainFareAdminViewDTO> getAllTrainFares() {
        return trainFareRepo.fetchAllTrainFares();
    }

    @Override
    public ApiResponseDTO<?> updateTrainFare(Long fareId, UpdateTrainFareReqDTO dto) {
        
        TrainFare trainFare = trainFareRepo.findById(fareId)
                .filter(tf -> !tf.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Train fare not found"));

        if (!trainFare.getTrain().getId().equals(dto.getTrainId()) || 
            !trainFare.getCoachType().getId().equals(dto.getCoachTypeId())) {
            
            if (trainFareRepo.findByTrainIdAndCoachTypeIdAndIsDeletedFalse(dto.getTrainId(), dto.getCoachTypeId()).isPresent()) {
                throw new ResourceAlreadyExistsException("Fare already exists for this train and coach type");
            }
        }

        Train train = trainRepo.findById(dto.getTrainId())
                .orElseThrow(() -> new ResourceNotFoundException("Train not found"));

        CoachType coachType = coachTypeRepo.findById(dto.getCoachTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("Coach type not found"));

        trainFare.setTrain(train);
        trainFare.setCoachType(coachType);
        trainFare.setRatePerKm(dto.getRatePerKm());
        trainFare.setBaseFare(dto.getBaseFare());
        trainFare.setActive(dto.isActive());

        return new ApiResponseDTO<>("Train fare updated successfully", "SUCCESS", null);
    }

    @Override
    public ApiResponseDTO<?> updateTrainFareStatus(Long fareId, UpdateTrainFareStatusReqDTO dto) {
        
        TrainFare trainFare = trainFareRepo.findById(fareId)
                .filter(tf -> !tf.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Train fare not found"));

        if (trainFare.isActive() == dto.isActive()) {
            throw new InvalidRequestException("Train fare is already in the given status");
        }

        trainFare.setActive(dto.isActive());

        return new ApiResponseDTO<>("Train fare status updated successfully", "SUCCESS", null);
    }

    @Override
    public ApiResponseDTO<?> deleteTrainFare(Long fareId) {
        
        TrainFare trainFare = trainFareRepo.findById(fareId)
                .filter(tf -> !tf.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Train fare not found"));

        trainFare.setDeleted(true);
        trainFare.setActive(false);

        return new ApiResponseDTO<>("Train fare deleted successfully", "SUCCESS", null);
    }
}