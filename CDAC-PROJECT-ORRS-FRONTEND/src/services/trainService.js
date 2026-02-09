import api from './api'

/**
 * Train Service
 * Handles all train-related API calls
 */
const trainService = {
  /**
   * Search trains by city names
   * @param {Object} searchParams - { fromCity, toCity, date }
   * @returns {Promise} Search results
   */
  searchTrains: async (searchParams) => {
    try {
      // Validate input parameters
      if (!searchParams.fromCity || !searchParams.toCity || !searchParams.date) {
        throw new Error('Missing required search parameters');
      }

      // Convert date string to proper format for backend (YYYY-MM-DD)
      let formattedDate;
      try {
        const dateObj = new Date(searchParams.date);
        if (isNaN(dateObj.getTime())) {
          throw new Error('Invalid date format');
        }
        formattedDate = dateObj.toISOString().split('T')[0];
      } catch (dateError) {
        throw new Error('Invalid date format. Please use a valid date.');
      }

      const requestBody = {
        sourceStation: searchParams.fromCity.trim(),
        destinationStation: searchParams.toCity.trim(),
        journeyDate: formattedDate,
      };

      console.log('Train search request:', requestBody);
      
      const response = await api.post('/schedule/search', requestBody);
      
      console.log('Train search response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Train search error:', error);
      
      // Handle different types of errors
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message || 'Invalid search parameters';
        throw new Error(errorMessage);
      } else if (error.response?.status === 404) {
        throw new Error('No trains found for the selected route');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (!error.response) {
        throw new Error('Network error. Please check your connection.');
      }
      
      throw error.response?.data || { message: error.message || 'Failed to search trains' };
    }
  },

  /**
   * Get seat matrix for a train
   * @param {Object} seatParams - Train and date information
   * @returns {Promise} Seat availability data
   */
  getSeatMatrix: async (seatParams) => {
    try {
      const response = await api.post('/api/seats/matrix', seatParams)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get seat matrix' }
    }
  },

  /**
   * Get train status
   * @param {string} trainNumber - Train number
   * @returns {Promise} Train status information
   */
  getTrainStatus: async (trainNumber) => {
    try {
      const response = await api.get(`/api/train-status/${trainNumber}`)
      return response.data
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get train status' }
    }
  },
}

export default trainService