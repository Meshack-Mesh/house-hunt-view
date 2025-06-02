
import { PropertyCard } from "./PropertyCard";
import { DisplayProperty, Property } from "@/types/Property";

interface PropertyListingsProps {
  filteredProperties: Property[];
  userLocation: { lat: number; lng: number; address: string } | null;
  onGetDirections: (property: DisplayProperty) => void;
}

export const PropertyListings = ({ 
  filteredProperties, 
  userLocation, 
  onGetDirections 
}: PropertyListingsProps) => {
  // Convert Property to DisplayProperty for components
  const convertToDisplayProperty = (property: Property): DisplayProperty => ({
    ...property,
    price: `KSh ${property.price.toLocaleString()}`,
    image: property.image || "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop",
    coordinates: property.coordinates || { lat: -1.2921, lng: 36.8219 },
    images: property.images
  });

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Available Empty Houses</h2>
        <p className="text-gray-600 text-lg">
          {filteredProperties.length} empty rental houses found
          {userLocation && userLocation.address !== "Current Location" && userLocation.address !== "Nairobi County" && ` in ${userLocation.address}`}
          {userLocation && userLocation.address === "Current Location" && " (sorted by distance from your location)"}
          {userLocation && userLocation.address === "Nairobi County" && " in Nairobi County"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.map((property, index) => (
          <div key={property.id} className="relative">
            <PropertyCard
              property={convertToDisplayProperty(property)}
              onGetDirections={onGetDirections}
              index={index}
            />
            {property.distance !== undefined && (
              <div className="absolute top-4 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                {property.distance} km away
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-xl">
            {userLocation && userLocation.address !== "Current Location" && userLocation.address !== "Nairobi County"
              ? `No empty houses found in ${userLocation.address}. Try searching a different area.`
              : "No empty houses match your search criteria."
            }
          </p>
        </div>
      )}
    </section>
  );
};
