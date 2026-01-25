package com.orrs.entities;

import java.math.BigDecimal;
import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Entity
@Table(name = "train_fares", uniqueConstraints = {
    // Ensures only one active fare per train and coach class at a time
    @UniqueConstraint(columnNames = {"train_id", "coach_type_id"})
})
@AttributeOverride(name="id", column = @Column(name="fare_id"))
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class TrainFare extends BaseEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_id", nullable = false)
    private Train train;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coach_type_id", nullable = false)
    private CoachType coachType; // Links to SL, 3A, etc.

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal ratePerKm;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal baseFare = new BigDecimal("50.00");

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false)
    private Boolean isDeleted = false;

    /**
     * Helper method for calculation logic:
     * Final Fare = Base Fare + (Distance * RatePerKm)
     */
    public BigDecimal calculateFare(Integer distance) {
        BigDecimal distanceCost = ratePerKm.multiply(new BigDecimal(distance));
        return baseFare.add(distanceCost);
    }
}
