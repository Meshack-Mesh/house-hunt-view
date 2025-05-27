
import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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

// Combine constituencies and popular locations for the dropdown
const allLocations = [
  ...nairobiConstituencies.map(c => ({ name: c.name, lat: c.lat, lng: c.lng, type: 'constituency' })),
  ...popularLocations.map(l => ({ name: l.name, lat: l.lat, lng: l.lng, type: 'location' }))
];

export const LocationSearch = ({ onLocationSelect }: LocationSearchProps) => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArea, setSelectedArea] = useState("");

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

  // Handle area selection and search
  const handleAreaSearch = () => {
    if (!selectedArea) {
      alert("Please select an area first.");
      return;
    }

    const location = allLocations.find(l => l.name === selectedArea);
    if (location) {
      setCurrentLocation({ lat: location.lat, lng: location.lng });
      setAddress(location.name);
      onLocationSelect({ lat: location.lat, lng: location.lng, address: location.name });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 mb-4">
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Find Empty Houses in Your Area</h3>
        
        {/* Current Location Button */}
        <Button
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="flex items-center justify-center space-x-2 bg-green-600 text-white hover:bg-green-700"
        >
          <Navigation size={20} />
          <span>{isLoading ? "Getting Location..." : "Use My Current Location"}</span>
        </Button>

        {/* Area Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Area in Nairobi</label>
          <Select value={selectedArea} onValueChange={setSelectedArea}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an area to search for empty houses" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {allLocations.map((location) => (
                <SelectItem key={location.name} value={location.name}>
                  {location.name} {location.type === 'constituency' ? '(Constituency)' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleAreaSearch}
          disabled={!selectedArea}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Search Empty Houses in {selectedArea || 'Selected Area'}
        </Button>

        {currentLocation && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm">
              <strong>Searching in:</strong> {address}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
