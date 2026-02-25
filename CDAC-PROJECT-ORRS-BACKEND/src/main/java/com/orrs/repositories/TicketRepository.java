package com.orrs.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.orrs.entities.Ticket;
import com.orrs.enums.BookingStatus;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Fetches ONLY the coach label and seat number for confirmed bookings.
    // Enum is passed as a parameter to avoid JPQL syntax errors.
    @Query("""
        SELECT t.coachLabel, t.seatNumber 
        FROM Ticket t 
        JOIN t.booking b 
        WHERE b.schedule.id = :scheduleId 
        AND b.coachType.id = :coachTypeId 
        AND b.status = :status
        """)
    List<Object[]> findBookedSeats(
        @Param("scheduleId") Long scheduleId, 
        @Param("coachTypeId") Long coachTypeId,
        @Param("status") BookingStatus status
    );

    // Fetches booked seats for specific journey segment (station to station)
    // Uses sequence numbers from train_routes to correctly detect journey overlap
    @Query("""
        SELECT t.coachLabel, t.seatNumber 
        FROM Ticket t 
        JOIN t.booking b 
        JOIN TrainRoute srcRoute ON srcRoute.train.id = b.schedule.train.id 
                                 AND srcRoute.station.id = b.sourceStation.id
        JOIN TrainRoute destRoute ON destRoute.train.id = b.schedule.train.id 
                                  AND destRoute.station.id = b.destinationStation.id
        JOIN TrainRoute userSrcRoute ON userSrcRoute.train.id = b.schedule.train.id 
                                     AND userSrcRoute.station.id = :sourceStationId
        JOIN TrainRoute userDestRoute ON userDestRoute.train.id = b.schedule.train.id 
                                      AND userDestRoute.station.id = :destinationStationId
        WHERE b.schedule.id = :scheduleId 
        AND b.coachType.id = :coachTypeId 
        AND b.status = :status
        AND (
            (srcRoute.sequenceNo <= userSrcRoute.sequenceNo AND destRoute.sequenceNo > userSrcRoute.sequenceNo) OR
            (srcRoute.sequenceNo < userDestRoute.sequenceNo AND destRoute.sequenceNo >= userDestRoute.sequenceNo) OR
            (srcRoute.sequenceNo >= userSrcRoute.sequenceNo AND destRoute.sequenceNo <= userDestRoute.sequenceNo)
        )
        """)
    List<Object[]> findBookedSeatsForJourneySegment(
        @Param("scheduleId") Long scheduleId, 
        @Param("coachTypeId") Long coachTypeId,
        @Param("sourceStationId") Long sourceStationId,
        @Param("destinationStationId") Long destinationStationId,
        @Param("status") BookingStatus status
    );
}
