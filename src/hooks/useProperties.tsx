
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

      const formattedProperties: Property[] = data.map(property => {
        // Get up to 3 images for the slideshow
        const images = property.property_images?.slice(0, 3).map((img: any) => img.image_url) || [];
        // If we have fewer than 3 images, fill with placeholder
        while (images.length < 3) {
          images.push("https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop");
        }

        return {
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
          property_type: property.property_type || 'Apartment / Flat',
          landlordPhone: property.landlord_phone,
          images: images,
          image: images[0] // Keep the main image for backward compatibility
        };
      });

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
