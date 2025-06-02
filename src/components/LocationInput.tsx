
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

interface LocationInputProps {
  locationValue: string;
  coordinatesValue: { lat: number; lng: number } | null;
  onLocationChange: (location: string) => void;
  onCoordinatesChange: (coordinates: { lat: number; lng: number } | null) => void;
}

export const LocationInput = ({ 
  locationValue, 
  coordinatesValue, 
  onLocationChange, 
  onCoordinatesChange 
}: LocationInputProps) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onCoordinatesChange({ lat: latitude, lng: longitude });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please enter coordinates manually.');
        setIsGettingLocation(false);
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Location Text Input */}
      <div>
        <Label htmlFor="location">Property Location</Label>
        <div className="flex items-center space-x-2">
          <MapPin className="text-gray-400" size={20} />
          <Input
            id="location"
            value={locationValue}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="e.g., Kawangware, Nairobi"
            required
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Enter the area or neighborhood name (e.g., Kawangware, Westlands, etc.)
        </p>
      </div>

      {/* Coordinates Section */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium">Exact Coordinates (Optional)</Label>
          <Button
            type="button"
            onClick={handleGetCurrentLocation}
            disabled={isGettingLocation}
            size="sm"
            variant="outline"
            className="flex items-center space-x-1"
          >
            <Navigation size={14} />
            <span>{isGettingLocation ? 'Getting...' : 'Use Current Location'}</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="latitude" className="text-sm">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={coordinatesValue?.lat || ''}
              onChange={(e) => {
                const lat = parseFloat(e.target.value);
                if (!isNaN(lat)) {
                  onCoordinatesChange({
                    lat,
                    lng: coordinatesValue?.lng || 0
                  });
                } else if (e.target.value === '') {
                  onCoordinatesChange(null);
                }
              }}
              placeholder="-1.2921"
            />
          </div>
          <div>
            <Label htmlFor="longitude" className="text-sm">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={coordinatesValue?.lng || ''}
              onChange={(e) => {
                const lng = parseFloat(e.target.value);
                if (!isNaN(lng)) {
                  onCoordinatesChange({
                    lat: coordinatesValue?.lat || 0,
                    lng
                  });
                } else if (e.target.value === '') {
                  onCoordinatesChange(null);
                }
              }}
              placeholder="36.8219"
            />
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Coordinates help tenants get exact directions to your property. Leave empty if not available.
        </p>
        
        {coordinatesValue && (
          <div className="mt-2 text-sm text-green-600">
            ✓ Coordinates set: {coordinatesValue.lat.toFixed(6)}, {coordinatesValue.lng.toFixed(6)}
          </div>
        )}
      </div>
    </div>
  );
};
