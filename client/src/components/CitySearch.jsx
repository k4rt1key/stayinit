import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const CitySearch = ({ onSearch, initialType = 'flat', value , setPropertyType}) => {
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [type, setType] = useState(initialType);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const typeDropdownRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setShowTypeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/search/cities`);
      const data = await response.json();
      if (data.success) {
        setCities(data.data);
      } else {
        setError('Failed to fetch cities');
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setError('An error occurred while fetching cities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(search, type);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (city) => {
    setSearch(city);
    setShowSuggestions(false);
    onSearch(city, type);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setPropertyType(newType);
    setShowTypeDropdown(false);
  };

  const filteredCities = cities
    .filter(cityData => cityData.type === type)
    .filter(cityData => cityData.city.toLowerCase().includes(search.toLowerCase()))
    .map(cityData => cityData.city);

  return (
    <form ref={formRef} onSubmit={handleSearch} className="flex flex-col z-10 w-full max-w-md mx-auto">
      <div className="relative w-full flex">
        <input
          ref={inputRef}
          placeholder="Search city"
          value={search || value}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className="flex-grow rounded-l-full px-6 py-4 bg-white text-gray-800 placeholder-gray-500 shadow-md focus:outline-none transition-all duration-300 text-sm"
          aria-label={`Search for ${type}s by City`}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
        />
        <div className="relative">
          <button
            type="button"
            className="h-full px-3 bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 focus:outline-none transition-colors duration-200 flex items-center text-sm"
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            aria-haspopup="listbox"
            aria-expanded={showTypeDropdown}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
          {showTypeDropdown && (
            <div
              ref={typeDropdownRef}
              className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded-md shadow-lg z-20"
            >
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-indigo-50 focus:outline-none focus:bg-indigo-50 text-sm"
                onClick={() => handleTypeChange('flat')}
              >
                Flat
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-indigo-50 focus:outline-none focus:bg-indigo-50 text-sm"
                onClick={() => handleTypeChange('hostel')}
              >
                Hostel
              </button>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-r-full hover:bg-indigo-700 transition-colors duration-200 flex items-center"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
      {showSuggestions && (
        <div 
          ref={suggestionsRef}
          className="absolute z-20 mt-16 w-full max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg"
          style={{ width: formRef.current ? formRef.current.offsetWidth : '100%' }}
        >
          {filteredCities.length > 0 ? (
            filteredCities.map((city, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer transition-colors duration-200 text-sm"
                onClick={() => handleSuggestionClick(city)}
              >
                {city}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 text-sm">No {type}s found in any city</div>
          )}
        </div>
      )}
      {isLoading && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      {error && (
        <div className="mt-2 text-red-500 text-xs">{error}</div>
      )}
    </form>
  );
};

export default CitySearch;

