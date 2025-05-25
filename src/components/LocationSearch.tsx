
import { useState, useEffect } from "react";
import { MapPin, Navigation } from "lucide-react";

interface LocationSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

export const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(true);

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          
          if (apiKey) {
            // Reverse geocoding to get address
            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
              );
              const data = await response.json();
              if (data.results && data.results.length > 0) {
                const formattedAddress = data.results[0].formatted_address;
                setAddress(formattedAddress);
                onLocationSelect({ lat: latitude, lng: longitude, address: formattedAddress });
              }
            } catch (error) {
              console.error("Error getting address:", error);
              onLocationSelect({ lat: latitude, lng: longitude, address: "Current Location" });
            }
          } else {
            onLocationSelect({ lat: latitude, lng: longitude, address: "Current Location" });
          }
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
          alert("Unable to get your location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  // Search for places using Google Places API
  const searchPlaces = async (query: string) => {
    if (!apiKey || !query) return;
    
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const place = data.results[0];
        const location = {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          address: place.formatted_address
        };
        setCurrentLocation({ lat: location.lat, lng: location.lng });
        setAddress(location.address);
        onLocationSelect(location);
      }
    } catch (error) {
      console.error("Error searching places:", error);
    }
  };

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      setShowApiInput(false);
    }
  };

  if (showApiInput) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 mb-4">
        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Google Maps Setup</h3>
            <p className="text-sm text-gray-600 mb-4">
              To use location features, please enter your Google Maps API key. 
              Get one from <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>.
            </p>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter Google Maps API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleApiKeySubmit}
              disabled={!apiKey.trim()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 mb-4">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Location Search</h3>
        
        {/* Current Location Button */}
        <button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <Navigation size={20} />
          <span>{isLoading ? "Getting Location..." : "Use My Current Location"}</span>
        </button>

        {/* Manual Search */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for a location (e.g., Westlands, Nairobi)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                searchPlaces(address);
              }
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={() => searchPlaces(address)}
          disabled={!address.trim()}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          Search Location
        </button>

        {currentLocation && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm">
              <strong>Selected Location:</strong> {address || `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
