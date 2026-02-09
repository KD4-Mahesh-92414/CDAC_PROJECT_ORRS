import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

/**
 * useTrainData Hook
 * Responsibility: Manage train data from Redux store and validation
 */
export default function useTrainData(searchData) {
  const navigate = useNavigate();
  const { searchResults, isLoading, error } = useSelector((state) => state.trains);

  // Validate that search was performed
  useEffect(() => {
    if (!searchData?.fromCity && !searchData?.from) {
      navigate("/");
    }
  }, [searchData, navigate]);

  // Return empty state if no search data
  if (!searchData?.fromCity && !searchData?.from) {
    return { trains: [], isLoading: false, error: 'No search data' };
  }

  return {
    trains: searchResults,
    isLoading,
    error
  };
}