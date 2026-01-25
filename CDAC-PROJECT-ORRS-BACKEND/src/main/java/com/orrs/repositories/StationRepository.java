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

    @Query("""
        select new com.orrs.dto.response.StationAdminViewDTO(
            s.id, s.stationName, s.stationCode, s.city, s.status
        )
        from Station s
        where s.status != :status
    """)
    List<StationAdminViewDTO> fetchAllStations(@Param("status") StationStatus status);
}
