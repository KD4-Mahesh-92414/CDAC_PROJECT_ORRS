import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

/**
 * CityAutocomplete Component
 * Responsibility: Provide city search with autocomplete functionality
 */
export default function CityAutocomplete({ 
  value, 
  onChange, 
  placeholder, 
  cities = [], 
  isLoading = false,
  error = null 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [filteredCities, setFilteredCities] = useState([]);
  const [isValidSelection, setIsValidSelection] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter cities based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCities(cities.slice(0, 10)); // Show first 10 cities
    } else {
      const filtered = cities.filter(city =>
        city.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.stationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.stationCode.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 10);
      setFilteredCities(filtered);
    }
    setSelectedIndex(-1); // Reset selection when cities change
  }, [searchTerm, cities]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsValidSelection(false); // Reset validation when typing
    
    // Check if the typed value matches a valid city exactly
    const matchingCity = cities.find(city => 
      city.city.toLowerCase() === newValue.toLowerCase()
    );
    
    if (matchingCity) {
      setIsValidSelection(true);
      onChange(matchingCity.city);
    }
    
    setIsOpen(true);
  };

  const handleCitySelect = (city) => {
    setSearchTerm(city.city);
    setIsValidSelection(true); // Mark as valid selection
    setSelectedIndex(-1); // Reset selection
    onChange(city.city);
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSelectedIndex(-1); // Reset keyboard selection when opening
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < filteredCities.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : filteredCities.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && filteredCities[selectedIndex]) {
        handleCitySelect(filteredCities[selectedIndex]);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full h-full text-center outline-none text-lg bg-transparent placeholder:text-gray-600 font-medium pr-8 ${
            searchTerm && !isValidSelection ? 'text-red-600' : 'text-gray-900'
          }`}
          autoComplete="off"
        />
        <ChevronDownIcon 
          className={`absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-violet-600 mx-auto"></div>
              <p className="mt-2">Loading cities...</p>
            </div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">
              <p>Failed to load cities</p>
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No cities found</p>
            </div>
          ) : (
            <ul className="py-2">
              {filteredCities.map((city, index) => (
                <li
                  key={city.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCitySelect(city);
                  }}
                  className={`px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-gray-100 last:border-b-0 ${
                    index === selectedIndex 
                      ? 'bg-violet-100 text-violet-900' 
                      : 'hover:bg-violet-50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{city.city}</span>
                    <span className="text-sm text-gray-500">
                      {city.stationName} ({city.stationCode})
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}