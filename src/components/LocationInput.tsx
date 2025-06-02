
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Compass, Navigation } from 'lucide-react';

interface LocationInputProps {
  value: string;
  onChange: (location: string, coordinates?: { lat: number; lng: number }) => void;
  label?: string;
  placeholder?: string;
}

export const LocationInput = ({ 
  value, 
  onChange, 
  label = "Location", 
  placeholder = "Enter location (e.g., Kawangware, Nairobi)" 
}: LocationInputProps) => {
  const [loading, setLoading] = useState(false);
  const [showCoordinateInput, setShowCoordinateInput] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const getCurrentLocation = () => {
    setLoading(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Use reverse geocoding to get address from coordinates
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=demo&limit=1`
            );
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
              const address = data.results[0].formatted;
              onChange(address, { lat: latitude, lng: longitude });
            } else {
              onChange(`${latitude}, ${longitude}`, { lat: latitude, lng: longitude });
            }
          } catch (error) {
            // Fallback to coordinates if geocoding fails
            onChange(`${latitude}, ${longitude}`, { lat: latitude, lng: longitude });
          }
          
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };

  const handleCoordinateSubmit = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      // Format coordinates with compass directions
      const latDirection = lat >= 0 ? 'N' : 'S';
      const lngDirection = lng >= 0 ? 'E' : 'W';
      const formattedLocation = `${Math.abs(lat).toFixed(5)}°${latDirection} ${Math.abs(lng).toFixed(5)}°${lngDirection}`;
      
      onChange(formattedLocation, { lat, lng });
      setShowCoordinateInput(false);
      setLatitude('');
      setLongitude('');
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="location">{label}</Label>
      <div className="flex space-x-2">
        <Input
          id="location"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          disabled={loading}
        >
          <Navigation className="h-4 w-4" />
          {loading ? "Getting..." : "Current"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowCoordinateInput(!showCoordinateInput)}
        >
          <Compass className="h-4 w-4" />
          Coordinates
        </Button>
      </div>
      
      {showCoordinateInput && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="text-sm font-medium text-gray-700">Enter precise coordinates:</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="latitude" className="text-xs">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g., -1.2921"
                className="text-sm"
              />
              <div className="text-xs text-gray-500 mt-1">North (+) / South (-)</div>
            </div>
            <div>
              <Label htmlFor="longitude" className="text-xs">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g., 36.8219"
                className="text-sm"
              />
              <div className="text-xs text-gray-500 mt-1">East (+) / West (-)</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              size="sm"
              onClick={handleCoordinateSubmit}
              disabled={!latitude || !longitude}
            >
              <MapPin className="h-3 w-3 mr-1" />
              Set Location
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowCoordinateInput(false)}
            >
              Cancel
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            Example: -1.2921°S 36.8219°E (Nairobi CBD)
          </div>
        </div>
      )}
    </div>
  );
};
