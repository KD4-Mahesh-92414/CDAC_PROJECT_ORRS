package com.orrs.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.orrs.dto.response.StationAdminViewDTO;
import com.orrs.entities.Station;
import com.orrs.enums.StationStatus;

public interface StationRepository extends JpaRepository<Station, Long> {

    boolean existsByStationCode(String stationCode);

    Optional<Station> findByStationCode(String stationCode);

    Optional<Station> findByStationNameIgnoreCase(String name);

    Optional<Station> findByCityIgnoreCase(String city);

    // Find first active station by city name (handles multiple stations per city)
    @Query("SELECT s FROM Station s WHERE UPPER(s.city) = UPPER(:city) AND s.status = :status ORDER BY s.id ASC")
    Optional<Station> findFirstByCityIgnoreCaseAndStatusOrderByIdAsc(@Param("city") String city, @Param("status") StationStatus status);

    @Query("""
        select new com.orrs.dto.response.StationAdminViewDTO(
            s.id, s.stationCode, s.stationName, s.city, s.state, s.zone, s.status
        )
        from Station s

    """)
    List<StationAdminViewDTO> fetchAllStations();

    // Admin Dashboard Stats
    @Query("SELECT COUNT(s) FROM Station s WHERE s.status = 'ACTIVE'")
    Long countActiveStations();

    @Query("SELECT COUNT(s) FROM Station s")
    Long countTotalStations();
}
