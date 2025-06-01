
export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  period: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  description: string;
  features: string[];
  coordinates: { lat: number; lng: number } | null;
  image: string;
  distance?: number;
  landlordPhone?: string;
  status?: string;
  collection_id?: string;
  remaining_units?: number;
  total_units?: number;
}

export interface DisplayProperty {
  id: string;
  title: string;
  location: string;
  price: string;
  period: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  description: string;
  features: string[];
  coordinates: { lat: number; lng: number };
  image: string;
  distance?: number;
  landlordPhone?: string;
  status?: string;
  collection_id?: string;
  remaining_units?: number;
  total_units?: number;
}

export interface PropertyCollection {
  id: string;
  name: string;
  description: string;
  landlord_id: string;
  created_at: string;
  updated_at: string;
}
