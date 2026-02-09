import { useState, useMemo } from 'react';

/**
 * useTrainFilters Hook
 * Responsibility: Manage train filtering logic and state
 */
export default function useTrainFilters(trains = []) {
  const [filters, setFilters] = useState({
    classes: []
  });

  // Get unique class types from the actual train data structure
  const availableClasses = useMemo(() => {
    const classes = new Set();
    trains.forEach(train => {
      // Handle coaches array (from test data or transformed backend data)
      if (train.coaches && Array.isArray(train.coaches)) {
        train.coaches.forEach(coach => {
          // Handle nested coachType structure
          if (coach.coachType && coach.coachType.typeCode) {
            classes.add(coach.coachType.typeCode);
          }
          // Handle direct type property (fallback)
          else if (coach.type) {
            classes.add(coach.type);
          }
          // Handle direct code property (fallback)
          else if (coach.code) {
            classes.add(coach.code);
          }
        });
      }
      // Also check for classOptions if they exist (from backend API)
      if (train.classOptions && Array.isArray(train.classOptions)) {
        train.classOptions.forEach(classOption => {
          if (classOption.typeCode) {
            classes.add(classOption.typeCode);
          } else if (classOption.coachCode) {
            classes.add(classOption.coachCode);
          }
        });
      }
      // Handle legacy classes array
      if (train.classes && Array.isArray(train.classes)) {
        train.classes.forEach(cls => {
          if (cls.code) {
            classes.add(cls.code);
          } else if (cls.name) {
            classes.add(cls.name);
          }
        });
      }
    });
    return [...classes].sort();
  }, [trains]);

  // Filter trains based on current filters
  const filteredTrains = useMemo(() => {
    return trains.filter(train => {
      // Filter by class availability
      if (filters.classes.length > 0) {
        const trainClasses = [];
        
        // Extract class codes from coaches
        if (train.coaches && Array.isArray(train.coaches)) {
          train.coaches.forEach(coach => {
            // Handle nested coachType structure
            if (coach.coachType && coach.coachType.typeCode) {
              trainClasses.push(coach.coachType.typeCode);
            }
            // Handle direct type property (fallback)
            else if (coach.type) {
              trainClasses.push(coach.type);
            }
            // Handle direct code property (fallback)
            else if (coach.code) {
              trainClasses.push(coach.code);
            }
          });
        }
        
        // Also check classOptions if they exist (from backend API)
        if (train.classOptions && Array.isArray(train.classOptions)) {
          train.classOptions.forEach(classOption => {
            if (classOption.typeCode) {
              trainClasses.push(classOption.typeCode);
            } else if (classOption.coachCode) {
              trainClasses.push(classOption.coachCode);
            }
          });
        }
        
        // Handle legacy classes array
        if (train.classes && Array.isArray(train.classes)) {
          train.classes.forEach(cls => {
            if (cls.code) {
              trainClasses.push(cls.code);
            } else if (cls.name) {
              trainClasses.push(cls.name);
            }
          });
        }
        
        // Check if train has at least one of the selected classes
        const hasSelectedClass = filters.classes.some(selectedClass => 
          trainClasses.includes(selectedClass)
        );
        
        if (!hasSelectedClass) {
          return false;
        }
      }

      return true;
    });
  }, [trains, filters]);

  const activeFilters = filters.classes.length;

  const handleClassFilter = (cls) => {
    const newClasses = filters.classes.includes(cls)
      ? filters.classes.filter(c => c !== cls)
      : [...filters.classes, cls];
    setFilters(prev => ({ ...prev, classes: newClasses }));
  };

  const resetFilters = () => {
    setFilters({
      classes: []
    });
  };

  return {
    filters,
    activeFilters,
    availableClasses,
    filteredTrains,
    handleClassFilter,
    resetFilters
  };
}