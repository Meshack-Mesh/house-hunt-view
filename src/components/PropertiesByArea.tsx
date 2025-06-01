
import { PropertyCard } from "./PropertyCard";
import { DisplayProperty } from "@/types/Property";

interface PropertiesByAreaProps {
  properties: DisplayProperty[];
  onGetDirections: (property: DisplayProperty) => void;
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
  }, {} as Record<string, DisplayProperty[]>);

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
                <div key={property.id} className="relative">
                  <PropertyCard
                    property={property}
                    onGetDirections={onGetDirections}
                    index={index}
                  />
                  {property.remaining_units && property.total_units && (
                    <div className="absolute top-4 left-4 bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                      {property.remaining_units} units remaining
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
