
export interface Property {
  id: string;
  title: string;
  location: string; // This will be the text location like "Kawangware"
  price: number;
  period: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  description: string;
  features: string[];
  coordinates: { lat: number; lng: number } | null; // Separate coordinates for directions
  image: string;
  images?: string[];
  distance?: number;
  landlordPhone?: string;
  status?: string;
  collection_id?: string;
  remaining_units?: number;
  total_units?: number;
  property_type?: string;
}

export interface DisplayProperty {
  id: string;
  title: string;
  location: string; // Text location like "Kawangware"
  price: string;
  period: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  description: string;
  features: string[];
  coordinates: { lat: number; lng: number }; // Coordinates for directions
  image: string;
  images?: string[];
  distance?: number;
  landlordPhone?: string;
  status?: string;
  collection_id?: string;
  remaining_units?: number;
  total_units?: number;
  property_type?: string;
}

export interface PropertyCollection {
  id: string;
  name: string;
  description: string;
  landlord_id: string;
  created_at: string;
  updated_at: string;
}
