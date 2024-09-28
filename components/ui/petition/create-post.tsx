'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../button';
import styled from 'styled-components';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Styled Components
const ImageUploadArea = styled.div`
  margin-top: 20px;
  padding: 20px;
  border: 2px dashed #8b5cf6;
  border-radius: 8px;
  text-align: center;
  color: #d8b4fe;
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  background: white;
  color: black;
  border: 1px solid #8b5cf6;
  border-radius: 8px;
  max-height: 150px;
  overflow-y: auto;
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0;
  list-style: none;
`;

const DropdownItem = styled.li`
  padding: 8px;
  cursor: pointer;
  &:hover {
    background: #8b5cf6;
    color: white;
  }
`;

const ImagePreview = styled.img`
  width: 100px; /* Adjust as needed */
  height: 100px; /* Adjust as needed */
  margin-top: 10px;
  border-radius: 8px;
`;

const FileNameDisplay = styled.div`
  color: #d8b4fe;
  margin-top: 10px;
`;

// Interface for location suggestions
interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export default function ReportForm() {
  const initialState = { message: null, errors: {} };
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null); // Store a single image URL
  const [imageName, setImageName] = useState<string | null>(null); // Store the image file name
  const [formMessage, setFormMessage] = useState<string | null>(null); // Form submission message

  // Handle form state changes such as submission, errors, or successful actions
  useEffect(() => {
    if (formMessage) {
      alert(formMessage);
    }
  }, [formMessage]);

  // Handle location search
  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length > 2) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${value}`);
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

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    const locationInput = document.getElementById('location') as HTMLInputElement;
    if (locationInput) {
      locationInput.value = suggestion.display_name;
      setLatitude(suggestion.lat);
      setLongitude(suggestion.lon);
    }
    setIsDropdownVisible(false);
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { data, error } = await supabase.storage
        .from('images')
        .upload(`public/${file.name}`, file);
      if (error) {
        throw new Error('Error uploading image');
      } else {
        const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(`public/${file.name}`);
        setImageURL(publicUrlData.publicUrl || '');
        setImageName(file.name);
      }
    } catch (error: any) {
      alert(`Error uploading image: ${error.message}`);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = (document.getElementById('title') as HTMLInputElement).value;
    const description = (document.getElementById('description') as HTMLInputElement).value;
    const location = (document.getElementById('location') as HTMLInputElement).value;

    if (!title || !description || !latitude || !longitude || !imageURL) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const { error } = await supabase
        .from('petitions') // Replace 'petitions' with your actual table name
        .insert([
          { title, description, latitude, longitude, image: imageURL }
        ]);
      
      if (error) throw error;
      
      setFormMessage('Petition created successfully!');
    } catch (error: any) {
      setFormMessage(`Error creating petition: ${error.message}`);
    }
  };

  return (
    <div className="w-full bg-black rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-center text-purple-300 mb-8">Create A Petition</h1>
      <form onSubmit={handleSubmit} className="space-y-6"> {/* Updated to use handleSubmit function */}
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-purple-300 mb-1">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter title"
            className="w-full px-3 py-2 bg-gray-800 border border-purple-500 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-purple-300 mb-1">
            Short description of what happened...
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Describe your situation..."
            className="w-full px-3 py-2 bg-gray-800 border border-purple-500 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-purple-300 mb-1">
            Location
          </label>
          <div className="flex items-center relative">
            <input
              id="location"
              name="location"
              type="text"
              placeholder="Where is this?"
              onChange={handleLocationChange}
              className="flex-grow px-3 py-2 bg-gray-800 border border-purple-500 rounded-md text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            {isDropdownVisible && locationSuggestions.length > 0 && (
              <DropdownList>
                {locationSuggestions.map((suggestion, index) => (
                  <DropdownItem key={index} onClick={() => handleSuggestionClick(suggestion)}>
                    {suggestion.display_name}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </div>
        </div>

        {/* Image Upload */}
        <ImageUploadArea>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="image-upload"
            required // Make sure this input is required
          />
          <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
            Click to upload an image (or drag and drop)
          </label>

          {/* Display Image and Name */}
          {imageURL && (
            <>
              <ImagePreview src={imageURL} alt="Uploaded image" />
              {imageName && <FileNameDisplay>Uploaded: {imageName}</FileNameDisplay>}
            </>
          )}
        </ImageUploadArea>

        {/* Submit Button */}
        <div>
          <Button type="submit" className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-green-400">
            Post Petition
          </Button>
        </div>
      </form>
    </div>
  );
}
