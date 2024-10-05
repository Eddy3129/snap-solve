// components/LocationSearchInput.tsx

import React, { useState } from 'react';
import styled from 'styled-components';

// Styled Components
const SearchBoxContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 450px;
  font-family: 'Orbitron', sans-serif;
`;

const SearchInputContainer = styled.div`
  display: flex;
`;

const SearchInput = styled.input`
  padding: 12px;
  border: 2px solid #8b5cf6;
  border-radius: 12px 0 0 12px;
  background: black;
  color: white;
  outline: none;
  flex-grow: 1;
  ::placeholder {
    color: #d8b4fe;
  }
  box-shadow: 0 0 10px #8b5cf6;
  font-size: 1.2em;
  font-family: 'Orbitron', sans-serif;
`;

const SearchButton = styled.button`
  padding: 12px;
  border: 2px solid #8b5cf6;
  border-left: none;
  border-radius: 0 12px 12px 0;
  background: linear-gradient(45deg, #8b5cf6, #d8b4fe);
  color: white;
  cursor: pointer;
  box-shadow: 0 0 10px #8b5cf6;
  font-size: 1.2em;
  font-family: 'Orbitron', sans-serif;
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background: black;
  color: white;
  border: 1px solid #8b5cf6;
  border-radius: 0 0 12px 12px;
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
  box-shadow: 0 0 10px #8b5cf6;
  padding: 0;
  margin: 0;
  list-style: none;
  font-family: 'Orbitron', sans-serif;
  z-index: 1000;
`;

const DropdownItem = styled.li`
  padding: 12px;
  cursor: pointer;
  &:hover {
    background: #8b5cf6;
    color: white;
  }
`;

// Interface for location suggestions
interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationSearchInputProps {
  onLocationSelect: (suggestion: LocationSuggestion) => void;
  placeholder?: string;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({ onLocationSelect, placeholder }) => {
  const [query, setQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(value)}`
        );
        const results: LocationSuggestion[] = await response.json();
        setLocationSuggestions(results);
        setIsDropdownVisible(true);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    } else {
      setIsDropdownVisible(false);
    }
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setQuery(suggestion.display_name);
    setIsDropdownVisible(false);
    onLocationSelect(suggestion);
  };

  const handleSearch = async () => {
    if (query.length > 0) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        );
        const results: LocationSuggestion[] = await response.json();
        if (results && results.length > 0) {
          const suggestion = results[0];
          setQuery(suggestion.display_name);
          onLocationSelect(suggestion);
        } else {
          alert('Location not found');
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    }
  };

  return (
    <SearchBoxContainer>
      <SearchInputContainer>
        <SearchInput
          type="text"
          placeholder={placeholder || 'Search for a location...'}
          value={query}
          onChange={handleInputChange}
        />
        <SearchButton onClick={handleSearch}>Search</SearchButton>
      </SearchInputContainer>
      {isDropdownVisible && locationSuggestions.length > 0 && (
        <DropdownList>
          {locationSuggestions.map((suggestion, index) => (
            <DropdownItem key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.display_name}
            </DropdownItem>
          ))}
        </DropdownList>
      )}
    </SearchBoxContainer>
  );
};

export default LocationSearchInput;
