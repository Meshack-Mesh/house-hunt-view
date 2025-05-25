
import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LocationSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

// Nairobi constituencies with approximate coordinates
const nairobiConstituencies = [
  { name: "Embakasi East", lat: -1.3215, lng: 36.8873 },
  { name: "Embakasi North", lat: -1.2823, lng: 36.8473 },
  { name: "Embakasi South", lat: -1.3456, lng: 36.8742 },
  { name: "Embakasi West", lat: -1.3089, lng: 36.8356 },
  { name: "Kibera", lat: -1.3123, lng: 36.7890 },
  { name: "Dagoretti North", lat: -1.2598, lng: 36.7345 },
  { name: "Dagoretti South", lat: -1.2889, lng: 36.7234 },
  { name: "Westlands", lat: -1.2577, lng: 36.7888 },
  { name: "Kamukunji", lat: -1.2833, lng: 36.8333 },
  { name: "Starehe", lat: -1.2833, lng: 36.8167 },
  { name: "Mathare", lat: -1.2567, lng: 36.8567 },
  { name: "Kasarani", lat: -1.2167, lng: 36.9000 },
  { name: "Ruaraka", lat: -1.2333, lng: 36.8833 },
  { name: "Roysambu", lat: -1.2000, lng: 36.8833 },
  { name: "Makadara", lat: -1.3000, lng: 36.8500 },
  { name: "Lang'ata", lat: -1.3500, lng: 36.7500 },
];

// Popular locations within constituencies
const popularLocations = [
  { name: "Kawangware", constituency: "Dagoretti North", lat: -1.2598, lng: 36.7345 },
  { name: "Pipeline", constituency: "Embakasi South", lat: -1.3456, lng: 36.8742 },
  { name: "Donholm", constituency: "Embakasi North", lat: -1.2823, lng: 36.8473 },
  { name: "Umoja", constituency: "Embakasi North", lat: -1.2890, lng: 36.8567 },
  { name: "Kibera DC", constituency: "Kibera", lat: -1.3123, lng: 36.7890 },
  { name: "Olympic", constituency: "Kibera", lat: -1.3090, lng: 36.7823 },
  { name: "Sarit Centre", constituency: "Westlands", lat: -1.2577, lng: 36.7888 },
  { name: "Parklands", constituency: "Westlands", lat: -1.2456, lng: 36.8123 },
  { name: "Githurai", constituency: "Kasarani", lat: -1.1833, lng: 36.9167 },
  { name: "Roysambu", constituency: "Roysambu", lat: -1.2000, lng: 36.8833 },
];

export const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  // Get user's current location
  const getCurrentLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setAddress("Current Location");
          onLocationSelect({ lat: latitude, lng: longitude, address: "Current Location" });
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

  // Handle constituency selection
  const handleConstituencySelect = (constituencyName: string) => {
    setSelectedConstituency(constituencyName);
    const constituency = nairobiConstituencies.find(c => c.name === constituencyName);
    if (constituency) {
      setCurrentLocation({ lat: constituency.lat, lng: constituency.lng });
      setAddress(constituencyName);
      onLocationSelect({ lat: constituency.lat, lng: constituency.lng, address: constituencyName });
    }
  };

  // Handle specific location selection
  const handleLocationSelect = (locationName: string) => {
    setSelectedLocation(locationName);
    const location = popularLocations.find(l => l.name === locationName);
    if (location) {
      setCurrentLocation({ lat: location.lat, lng: location.lng });
      setAddress(locationName);
      onLocationSelect({ lat: location.lat, lng: location.lng, address: locationName });
    }
  };

  // Search for custom location
  const searchCustomLocation = () => {
    if (!address.trim()) return;
    
    // Simple search within popular locations
    const foundLocation = popularLocations.find(l => 
      l.name.toLowerCase().includes(address.toLowerCase())
    );
    
    if (foundLocation) {
      setCurrentLocation({ lat: foundLocation.lat, lng: foundLocation.lng });
      onLocationSelect({ lat: foundLocation.lat, lng: foundLocation.lng, address: foundLocation.name });
    } else {
      // If not found in popular locations, try constituencies
      const foundConstituency = nairobiConstituencies.find(c => 
        c.name.toLowerCase().includes(address.toLowerCase())
      );
      
      if (foundConstituency) {
        setCurrentLocation({ lat: foundConstituency.lat, lng: foundConstituency.lng });
        onLocationSelect({ lat: foundConstituency.lat, lng: foundConstituency.lng, address: foundConstituency.name });
      } else {
        alert("Location not found. Please try selecting from the dropdown or use a different search term.");
      }
    }
  };

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

        {/* Constituency Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Constituency</label>
          <Select value={selectedConstituency} onValueChange={handleConstituencySelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a constituency in Nairobi" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {nairobiConstituencies.map((constituency) => (
                <SelectItem key={constituency.name} value={constituency.name}>
                  {constituency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Popular Locations Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Or Select Popular Location</label>
          <Select value={selectedLocation} onValueChange={handleLocationSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a popular location" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {popularLocations.map((location) => (
                <SelectItem key={location.name} value={location.name}>
                  {location.name} ({location.constituency})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Manual Search */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Or type a location (e.g., Kawangware, Pipeline)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                searchCustomLocation();
              }
            }}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={searchCustomLocation}
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
