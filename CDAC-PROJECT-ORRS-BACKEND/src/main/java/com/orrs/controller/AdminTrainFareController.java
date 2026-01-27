package com.orrs.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.orrs.dto.request.AddTrainFareReqDTO;
import com.orrs.dto.request.UpdateTrainFareReqDTO;
import com.orrs.dto.request.UpdateTrainFareStatusReqDTO;
import com.orrs.services.TrainFareService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/fares")
@CrossOrigin(origins = "*")
public class AdminTrainFareController {

    private final TrainFareService trainFareService;

    @PostMapping
    public ResponseEntity<?> addTrainFare(@RequestBody @Valid AddTrainFareReqDTO dto) {
        return ResponseEntity.ok(trainFareService.addTrainFare(dto));
    }

    @GetMapping
    public ResponseEntity<?> getAllTrainFares() {
        return ResponseEntity.ok(trainFareService.getAllTrainFares());
    }

    @PutMapping("/{fareId}")
    public ResponseEntity<?> updateTrainFare(
            @PathVariable Long fareId,
            @RequestBody @Valid UpdateTrainFareReqDTO dto) {
        return ResponseEntity.ok(trainFareService.updateTrainFare(fareId, dto));
    }

    @PatchMapping("/{fareId}/status")
    public ResponseEntity<?> updateTrainFareStatus(
            @PathVariable Long fareId,
            @RequestBody @Valid UpdateTrainFareStatusReqDTO dto) {
        return ResponseEntity.ok(trainFareService.updateTrainFareStatus(fareId, dto));
    }

    @DeleteMapping("/{fareId}")
    public ResponseEntity<?> deleteTrainFare(@PathVariable Long fareId) {
        return ResponseEntity.ok(trainFareService.deleteTrainFare(fareId));
    }
}