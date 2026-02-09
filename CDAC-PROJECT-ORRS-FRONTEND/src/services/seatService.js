import bookingService from './bookingService';

/**
 * Seat Service
 * Handles all seat matrix related API calls using the booking service
 */
const seatService = {
  /**
   * Get seat matrix for a specific train schedule and coach type
   * @param {Object} params - Seat matrix request parameters
   * @param {number} params.scheduleId - Train schedule ID
   * @param {number} params.coachTypeId - Coach type ID
   * @param {number} params.sourceStationId - Source station ID
   * @param {number} params.destinationStationId - Destination station ID
   * @returns {Promise} API response with seat matrix data
   */
  async getSeatMatrix(params) {
    try {
      console.log('=== SEAT SERVICE: GET SEAT MATRIX ===');
      console.log('Fetching seat matrix with params:', params);
      
      const seatMatrixData = {
        scheduleId: params.scheduleId,
        coachTypeId: params.coachTypeId,
        sourceStationId: params.sourceStationId,
        destinationStationId: params.destinationStationId
      };

      console.log('=== CALLING BACKEND API ===');
      console.log('Endpoint: /api/seats/matrix');
      console.log('Request data:', JSON.stringify(seatMatrixData, null, 2));
      
      const response = await bookingService.getSeatMatrix(seatMatrixData);
      console.log('=== BACKEND RESPONSE ===');
      console.log('Seat matrix response:', response);
      
      // Transform the response for frontend consumption
      const transformed = bookingService.transformSeatMatrix(response);
      console.log('=== TRANSFORMED RESPONSE ===');
      console.log('Transformed data:', transformed);
      
      return transformed;
    } catch (error) {
      console.error('=== SEAT MATRIX API ERROR ===');
      console.error('Seat matrix API error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        throw new Error('Please login to view seat availability');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Please login to view seat availability');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid request parameters');
      } else if (error.response?.status === 404) {
        throw new Error('Train schedule or coach type not found');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Failed to fetch seat matrix');
      }
    }
  },

  /**
   * Reserve selected seats
   * @param {Object} params - Seat reservation parameters
   * @returns {Promise} API response with reservation data
   */
  async reserveSeats(params) {
    try {
      console.log('Reserving seats with params:', params);
      
      const reservationData = {
        scheduleId: params.scheduleId,
        coachTypeId: params.coachTypeId,
        sourceStationId: params.sourceStationId,
        destinationStationId: params.destinationStationId,
        selectedSeats: bookingService.formatSelectedSeats(params.selectedSeats),
        sessionId: bookingService.generateSessionId()
      };

      const response = await bookingService.reserveSeats(reservationData);
      console.log('Seat reservation response:', response);
      return response;
    } catch (error) {
      console.error('Seat reservation error:', error);
      throw error;
    }
  },

  /**
   * Check reservation status
   * @param {number} reservationId - Reservation ID
   * @returns {Promise} API response with reservation status
   */
  async checkReservationStatus(reservationId) {
    try {
      return await bookingService.checkReservationStatus(reservationId);
    } catch (error) {
      console.error('Error checking reservation status:', error);
      throw error;
    }
  }
};

export default seatService;