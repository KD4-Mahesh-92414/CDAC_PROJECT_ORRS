package com.orrs.services;

import java.util.List;

import com.orrs.dto.common.ApiResponseDTO;
import com.orrs.dto.response.AdminDashboardStatsRespDTO;
import com.orrs.dto.response.MonthlyRevenueRespDTO;
import com.orrs.dto.response.WeeklyBookingsRespDTO;

public interface AdminDashboardService {
    
    ApiResponseDTO<AdminDashboardStatsRespDTO> getDashboardStats();
    
    ApiResponseDTO<List<WeeklyBookingsRespDTO>> getWeeklyBookings();
    
    ApiResponseDTO<List<MonthlyRevenueRespDTO>> getMonthlyRevenue();
}