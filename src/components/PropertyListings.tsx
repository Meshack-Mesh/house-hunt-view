
import { Property } from "@/types/Property";
import { PropertyCard } from "./PropertyCard";

interface PropertyListingsProps {
  filteredProperties: Property[];
  userLocation: { lat: number; lng: number; address: string } | null;
  onGetDirections: (property: any) => void;
  paidProperties: Set<string>;
}

export const PropertyListings = ({ 
  filteredProperties, 
  userLocation, 
  onGetDirections,
  paidProperties 
}: PropertyListingsProps) => {
  // Convert Property to DisplayProperty for the PropertyCard
  const convertToDisplayProperty = (property: Property) => ({
    ...property,
    price: `KSh ${property.price.toLocaleString()}`,
    image: property.image || "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop",
    coordinates: property.coordinates || { lat: -1.2921, lng: 36.8219 }
  });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Available Properties
            {userLocation && userLocation.address !== "Nairobi County" && (
              <span className="text-blue-600"> near {userLocation.address}</span>
            )}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {filteredProperties.length} properties found
            {userLocation && userLocation.address !== "Current Location" && userLocation.address !== "Nairobi County" && 
              ` near ${userLocation.address}`
            }
          </p>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or location.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={convertToDisplayProperty(property)}
                onGetDirections={onGetDirections}
                index={index}
                hasAccessToContact={paidProperties.has(property.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
