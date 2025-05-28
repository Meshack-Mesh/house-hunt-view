
import { PropertyCard } from "./PropertyCard";

interface Property {
  id: string; // Changed from number to string (UUID)
  title: string;
  location: string;
  price: string;
  period: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  description: string;
  features: string[];
  coordinates: { lat: number; lng: number };
}

interface PropertiesByAreaProps {
  properties: Property[];
  onGetDirections: (property: Property) => void;
}

export const PropertiesByArea = ({ properties, onGetDirections }: PropertiesByAreaProps) => {
  // Group properties by area
  const groupedProperties = properties.reduce((acc, property) => {
    const area = property.location.split(',')[0].trim();
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(property);
    return acc;
  }, {} as Record<string, Property[]>);

  return (
    <section id="properties" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Properties by Area</h2>
          <p className="text-gray-600 text-lg">
            Explore available empty houses organized by different areas in Nairobi
          </p>
        </div>

        {Object.entries(groupedProperties).map(([area, areaProperties]) => (
          <div key={area} className="mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {area} ({areaProperties.length} Properties)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {areaProperties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onGetDirections={onGetDirections}
                  index={index}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
