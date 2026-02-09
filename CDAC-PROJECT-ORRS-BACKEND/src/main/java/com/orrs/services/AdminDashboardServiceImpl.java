package com.orrs.services;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orrs.dto.common.ApiResponseDTO;
import com.orrs.dto.response.AdminDashboardStatsRespDTO;
import com.orrs.dto.response.MonthlyRevenueRespDTO;
import com.orrs.dto.response.WeeklyBookingsRespDTO;
import com.orrs.enums.TrainStatus;
import com.orrs.repositories.BookingRespository;
import com.orrs.repositories.StationRepository;
import com.orrs.repositories.TrainRepository;
import com.orrs.repositories.TrainScheduleRepository;
import com.orrs.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final TrainRepository trainRepository;
    private final StationRepository stationRepository;
    private final TrainScheduleRepository trainScheduleRepository;
    private final BookingRespository bookingRepository;
    private final UserRepository userRepository;

    @Override
    public ApiResponseDTO<AdminDashboardStatsRespDTO> getDashboardStats() {
        
        Long totalTrains = trainRepository.count();
        Long totalActiveTrains = trainRepository.countByTrainStatus(TrainStatus.ACTIVE);
        Long totalStations = stationRepository.countTotalStations();
        Long totalActiveStations = stationRepository.countActiveStations();
        
        LocalDate currentDate = LocalDate.now();
        Long totalScheduledTrains = trainScheduleRepository.countScheduledTrainsFromDate(currentDate);
        Long totalBookingsToday = bookingRepository.countBookingsByDate(currentDate);
        Long totalUsersRegistered = userRepository.countActiveUsers();

        AdminDashboardStatsRespDTO stats = new AdminDashboardStatsRespDTO(
                totalTrains,
                totalActiveTrains,
                totalStations,
                totalActiveStations,
                totalScheduledTrains,
                totalBookingsToday,
                totalUsersRegistered
        );

        return new ApiResponseDTO<>("Dashboard statistics retrieved successfully", "SUCCESS", stats);
    }

    @Override
    public ApiResponseDTO<List<WeeklyBookingsRespDTO>> getWeeklyBookings() {
        List<WeeklyBookingsRespDTO> weeklyBookings = new ArrayList<>();
        
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        
        for (int i = 0; i < 7; i++) {
            LocalDate date = startOfWeek.plusDays(i);
            String dayName = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            Long bookingCount = bookingRepository.countBookingsByDate(date);
            weeklyBookings.add(new WeeklyBookingsRespDTO(dayName, bookingCount));
        }
        
        return new ApiResponseDTO<>("Weekly bookings retrieved successfully", "SUCCESS", weeklyBookings);
    }

    @Override
    public ApiResponseDTO<List<MonthlyRevenueRespDTO>> getMonthlyRevenue() {
        List<MonthlyRevenueRespDTO> monthlyRevenue = new ArrayList<>();
        
        LocalDate today = LocalDate.now();
        
        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = today.minusMonths(i);
            String monthName = monthDate.getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            
            LocalDate startOfMonth = monthDate.with(TemporalAdjusters.firstDayOfMonth());
            LocalDate endOfMonth = monthDate.with(TemporalAdjusters.lastDayOfMonth());
            
            BigDecimal revenue = bookingRepository.sumTotalAmountByDateRange(startOfMonth, endOfMonth);
            monthlyRevenue.add(new MonthlyRevenueRespDTO(monthName, revenue != null ? revenue : BigDecimal.ZERO));
        }
        
        return new ApiResponseDTO<>("Monthly revenue retrieved successfully", "SUCCESS", monthlyRevenue);
    }
}