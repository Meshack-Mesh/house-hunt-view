
// Shared Property interface to ensure consistency across the app
export interface Property {
  id: string; // UUID from database
  title: string;
  location: string;
  price: number; // Raw price from database
  period: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  description: string;
  features: string[];
  coordinates: { lat: number; lng: number } | null;
  distance?: number;
  image?: string;
}

// Property interface for display components (with formatted price)
export interface DisplayProperty {
  id: string;
  title: string;
  location: string;
  price: string; // Formatted price for display
  period: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  description: string;
  features: string[];
  coordinates: { lat: number; lng: number };
  distance?: number;
  image: string;
}
