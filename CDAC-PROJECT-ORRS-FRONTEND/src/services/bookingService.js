import api from './api';

/**
 * Booking Service - Handles all booking-related API calls
 * 
 * API Flow:
 * 1. Get Seat Matrix -> Reserve Seats -> Confirm Booking
 * 2. Check Booking Status, Cancel Booking, etc.
 */

class BookingService {
  
  // ==================== SEAT RESERVATION FLOW ====================
  
  /**
   * Step 1: Get seat matrix for a specific coach type
   * POST /api/seats/matrix
   */
  async getSeatMatrix(seatMatrixData) {
    try {
      console.log('=== BOOKING SERVICE: GET SEAT MATRIX ===');
      console.log('Making API call to /api/seats/matrix');
      console.log('Request data:', JSON.stringify(seatMatrixData, null, 2));
      
      const response = await api.post('/api/seats/matrix', seatMatrixData);
      
      console.log('=== API RESPONSE SUCCESS ===');
      console.log('Response status:', response.status);
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('=== BOOKING SERVICE ERROR ===');
      console.error('Error fetching seat matrix:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  }

  /**
   * Step 2: Reserve seats temporarily (5-minute timeout)
   * POST /api/booking/reserve-seats
   */
  async reserveSeats(reservationData) {
    try {
      console.log('=== BOOKING SERVICE: RESERVE SEATS ===');
      console.log('Request data:', JSON.stringify(reservationData, null, 2));
      
      const response = await api.post('/api/booking/reserve-seats', reservationData);
      
      console.log('=== RESERVE SEATS SUCCESS ===');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('=== RESERVE SEATS ERROR ===');
      console.error('Error reserving seats:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  }

  /**
   * Step 3: Confirm booking and create tickets
   * POST /api/booking/confirm
   */
  async confirmBooking(bookingData) {
    try {
      console.log('=== BOOKING SERVICE: CONFIRM BOOKING ===');
      console.log('Request data:', JSON.stringify(bookingData, null, 2));
      console.log('API endpoint: /api/booking/confirm');
      console.log('Request headers:', {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : 'No token'
      });
      
      const response = await api.post('/api/booking/confirm', bookingData);
      console.log('=== BOOKING API SUCCESS ===');
      console.log('Full response:', response);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      console.error('=== BOOKING SERVICE ERROR ===');
      console.error('Error confirming booking:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error response status:', error.response?.status);
      console.error('Error response headers:', error.response?.headers);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Re-throw with more context
      const enhancedError = new Error(
        error.response?.data?.message || 
        error.message || 
        'Unknown booking confirmation error'
      );
      enhancedError.originalError = error;
      enhancedError.response = error.response;
      throw enhancedError;
    }
  }

  /**
   * Check reservation status
   * GET /api/booking/reservation/{reservationId}/status
   */
  async checkReservationStatus(reservationId) {
    try {
      const response = await api.get(`/api/booking/reservation/${reservationId}/status`);
      return response.data;
    } catch (error) {
      console.error('Error checking reservation status:', error);
      throw error;
    }
  }

  // ==================== USER BOOKING MANAGEMENT ====================

  /**
   * Get user's booking history
   * GET /users/bookings/history
   */
  async getBookingHistory() {
    try {
      const response = await api.get('/users/bookings/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching booking history:', error);
      throw error;
    }
  }

  /**
   * Get detailed booking information
   * GET /users/bookings/{bookingId}/details
   */
  async getBookingDetails(bookingId) {
    try {
      const response = await api.get(`/users/bookings/${bookingId}/details`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  }

  /**
   * Cancel a booking
   * POST /users/bookings/cancel
   */
  async cancelBooking(cancelData) {
    try {
      const response = await api.post('/users/bookings/cancel', cancelData);
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  /**
   * Get booking statistics
   * GET /users/bookings/stats
   */
  async getBookingStats() {
    try {
      const response = await api.get('/users/bookings/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw error;
    }
  }

  // ==================== PAYMENT MANAGEMENT ====================

  /**
   * Get payment history
   * GET /users/bookings/payments/history
   */
  async getPaymentHistory() {
    try {
      const response = await api.get('/users/bookings/payments/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  /**
   * Get payment summary
   * GET /users/bookings/payments/summary
   */
  async getPaymentSummary() {
    try {
      const response = await api.get('/users/bookings/payments/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      throw error;
    }
  }

  // ==================== SAVED PASSENGERS ====================

  /**
   * Get saved passengers
   * GET /users/bookings/saved-passengers
   */
  async getSavedPassengers() {
    try {
      const response = await api.get('/users/bookings/saved-passengers');
      return response.data;
    } catch (error) {
      console.error('Error fetching saved passengers:', error);
      throw error;
    }
  }

  /**
   * Add a new saved passenger
   * POST /users/bookings/saved-passengers
   */
  async addSavedPassenger(passengerData) {
    try {
      const response = await api.post('/users/bookings/saved-passengers', passengerData);
      return response.data;
    } catch (error) {
      console.error('Error adding saved passenger:', error);
      throw error;
    }
  }

  /**
   * Update saved passenger
   * PUT /users/bookings/saved-passengers/{passengerId}
   */
  async updateSavedPassenger(passengerId, passengerData) {
    try {
      const response = await api.put(`/users/bookings/saved-passengers/${passengerId}`, passengerData);
      return response.data;
    } catch (error) {
      console.error('Error updating saved passenger:', error);
      throw error;
    }
  }

  /**
   * Delete saved passenger
   * DELETE /users/bookings/saved-passengers/{passengerId}
   */
  async deleteSavedPassenger(passengerId) {
    try {
      const response = await api.delete(`/users/bookings/saved-passengers/${passengerId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting saved passenger:', error);
      throw error;
    }
  }

  // ==================== PNR STATUS (PUBLIC) ====================

  /**
   * Check PNR status (public endpoint, no auth required)
   * POST /pnr/status
   */
  async checkPNRStatus(pnrNumber) {
    try {
      const response = await api.post('/pnr/status', { pnrNumber });
      return response.data;
    } catch (error) {
      console.error('Error checking PNR status:', error);
      throw error;
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Transform seat matrix data for frontend consumption
   */
  transformSeatMatrix(backendData) {
    if (!backendData?.data) return [];
    
    return backendData.data.map(coach => ({
      coachLabel: coach.coachLabel,
      seats: coach.seats.map(seat => ({
        seatNumber: seat.seatNumber,
        seatType: seat.seatType,
        status: seat.status, // AVAILABLE, LOCKED, MY_RESERVATION
        seatId: `${coach.coachLabel}-${seat.seatNumber}`
      }))
    }));
  }

  /**
   * Transform booking data for frontend consumption
   */
  transformBookingData(backendData) {
    if (!backendData?.data) return null;
    
    const booking = backendData.data;
    return {
      pnrNumber: booking.pnrNumber,
      bookingStatus: booking.bookingStatus,
      totalFare: booking.totalFare,
      journeyDate: booking.journeyDate,
      trainDetails: booking.trainDetails,
      passengers: booking.passengers
    };
  }

  /**
   * Generate session ID for seat reservation
   */
  generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format selected seats for API
   */
  formatSelectedSeats(selectedSeats) {
    return selectedSeats.map(seat => {
      if (typeof seat === 'object' && seat.coach && seat.seatNumber) {
        return `${seat.coach}-${seat.seatNumber}`;
      }
      return seat;
    });
  }

  /**
   * Parse seat ID to coach and seat number
   */
  parseSeatId(seatId) {
    const [coach, seatNumber] = seatId.split('-');
    return {
      coach,
      seatNumber: parseInt(seatNumber)
    };
  }
}

export default new BookingService();