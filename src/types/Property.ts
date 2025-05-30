
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
}
