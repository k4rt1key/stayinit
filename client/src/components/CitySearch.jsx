import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

const CitySearch = ({ onSearch, type, value }) => {
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchCities();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/search/cities`);
      const data = await response.json();
      if (data.success) {
        setCities(data.data);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(search);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (city) => {
    setSearch(city);
    setShowSuggestions(false);
    onSearch(city);
  };

  const filteredCities = cities
    .filter(cityData => cityData.type === type)
    .filter(cityData => cityData.city.toLowerCase().includes(search.toLowerCase()))
    .map(cityData => cityData.city);

  return (
    <form onSubmit={handleSearch} className="flex flex-col z-10 w-full gap-2">
      <div className="relative w-full">
        <input
          ref={inputRef}
          placeholder={`Search for ${type}s by City or Locality`}
          value={search || value}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className="w-full rounded-md px-4 py-2 bg-gray-100 text-black placeholder-gray-900 focus:outline-none"
        />
        {showSuggestions && (
          <div 
            ref={suggestionsRef}
            className="absolute z-9 mt-1 w-full max-h-40 overflow-y-auto bg-gray-50 border border-gray-300 rounded-md shadow-lg"
          >
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSuggestionClick(city)}
                >
                  {city}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">No {type}s found in any city</div>
            )}
          </div>
        )}
      </div>
      <button
        type="submit"
        className="bg-black/85 flex justify-center items-center text-white px-4 py-2 rounded-md transition-colors duration-200"
      >
        <Search className="w-5 h-5 mr-2" />
        Search
      </button>
    </form>
  );
};

export default CitySearch;

