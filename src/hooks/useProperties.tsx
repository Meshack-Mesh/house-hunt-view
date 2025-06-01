
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/Property";

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images(image_url, is_primary)
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
        return;
      }

      const formattedProperties: Property[] = data.map(property => ({
        id: property.id,
        title: property.title,
        location: property.location,
        price: property.price,
        period: property.period,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        description: property.description || '',
        features: property.features || [],
        coordinates: property.coordinates as { lat: number; lng: number } | null,
        remaining_units: property.remaining_units || 1,
        total_units: property.total_units || 1,
        image: property.property_images?.find((img: any) => img.is_primary)?.image_url || 
               property.property_images?.[0]?.image_url ||
               "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop"
      }));

      setProperties(formattedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  return { properties, loading, fetchProperties };
};
