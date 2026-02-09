package com.orrs.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orrs.dto.request.AddTrainReqDTO;
import com.orrs.dto.request.UpdateTrainReqDTO;
import com.orrs.dto.request.UpdateTrainStatusReqDTO;
import com.orrs.dto.common.ApiResponseDTO;
import com.orrs.security.UserPrincipal;
import com.orrs.services.TrainService;
import com.orrs.services.TrainSchedulingService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/trains")
@CrossOrigin(origins = "*")
public class AdminTrainController {

    private final TrainService trainService;
    private final TrainSchedulingService trainSchedulingService;

    // GET /admin/trains
    // - Fetch all trains
    // - Requires ADMIN authentication
    @GetMapping
    public ResponseEntity<?> getAllTrains() {
        return ResponseEntity.ok(trainService.getAllTrains());
    }

    // POST /admin/trains
    // - Add new train
    // - Input: TrainReqDTO
    // - Requires ADMIN authentication
    @PostMapping
    public ResponseEntity<?> addTrain(
            @RequestBody @Valid AddTrainReqDTO addTrainReqDTO) {

        return ResponseEntity.ok(trainService.addTrain(addTrainReqDTO));
    }

    // PUT /admin/trains/{trainId}
    // - Update train details
    // - Input: UpdateTrainReqDTO
    // - Requires ADMIN authentication
    @PutMapping("/{trainId}")
    public ResponseEntity<?> updateTrain(
            @PathVariable Long trainId,
            @RequestBody @Valid UpdateTrainReqDTO updateTrainReqDTO) {

        return ResponseEntity.ok(
                trainService.updateTrain(trainId, updateTrainReqDTO));
    }

    // DELETE /admin/trains/{trainId}
    // - Soft delete train
    // - Requires ADMIN authentication
    @DeleteMapping("/{trainId}")
    public ResponseEntity<?> deleteTrain(
            @PathVariable Long trainId) {

        return ResponseEntity.ok(
                trainService.deleteTrain(trainId));
    }
    
    // PATCH /admin/trains/{trainId}/status
    // - Update train status (e.g. ACTIVE / INACTIVE)
    // - Requires ADMIN authentication
    @PatchMapping("/{trainId}/status")
    public ResponseEntity<?> updateTrainStatus(
         @PathVariable Long trainId,
         @RequestBody @Valid UpdateTrainStatusReqDTO dto ) 
    {
     return ResponseEntity.ok(
             trainService.updateTrainStatus(trainId, dto)
     );
 }

    // POST /admin/trains/schedule
    // - Manually trigger train scheduling for next 60 days
    // - Requires ADMIN authentication
    @PostMapping("/schedule")
    public ResponseEntity<?> scheduleTrains() {
        trainSchedulingService.scheduleTrainsForNext60Days();
        return ResponseEntity.ok(
            new ApiResponseDTO<>("Train schedules created successfully for next 60 days", "SUCCESS", null)
        );
    }

}
