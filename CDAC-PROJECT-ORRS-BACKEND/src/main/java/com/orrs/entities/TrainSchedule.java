package com.orrs.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.orrs.enums.ScheduleStatus;

@Entity
@Table(name = "train_schedules", uniqueConstraints = {
    // Prevents duplicate instances of the same train on the same day
    @UniqueConstraint(columnNames = {"train_id", "departure_date"})
})
@Data
@EqualsAndHashCode(callSuper = true)
public class TrainSchedule extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_id", nullable = false)
    private Train train;

    @Column(nullable = false)
    private LocalDate departureDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleStatus status = ScheduleStatus.RUNNING;

    @Column(name = "actual_departure_time")
    private LocalDateTime actualDepartureTime; // Useful for tracking delays

    @Column(name = "actual_arrival_time")
    private LocalDateTime actualArrivalTime;

    private String delayReason;

    private String remarks;


    
//      Logic for Search: 
//      A schedule is only bookable if it is RUNNING or RESCHEDULED
     
    public boolean isBookable() {
        return this.status == ScheduleStatus.RUNNING || this.status == ScheduleStatus.RESCHEDULED;
    }
}