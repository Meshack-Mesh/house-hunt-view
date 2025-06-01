
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

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
  placeholder = "Enter property location (e.g., Westlands, Nairobi)" 
}: LocationInputProps) => {
  const [loading, setLoading] = useState(false);

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
          <MapPin className="h-4 w-4" />
          {loading ? "Getting..." : "Current"}
        </Button>
      </div>
    </div>
  );
};
