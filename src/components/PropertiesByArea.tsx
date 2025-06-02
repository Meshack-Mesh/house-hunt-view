
import { PropertyCard } from "./PropertyCard";
import { DisplayProperty } from "@/types/Property";

interface PropertiesByAreaProps {
  properties: DisplayProperty[];
  onGetDirections: (property: DisplayProperty) => void;
}

export const PropertiesByArea = ({ properties, onGetDirections }: PropertiesByAreaProps) => {
  return (
    <section id="properties" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Available Properties</h2>
          <p className="text-gray-600 text-lg">
            Explore available rental properties in Nairobi ({properties.length} Properties)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              onGetDirections={onGetDirections}
              index={index}
            />
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">No properties found matching your criteria.</p>
            <p className="text-gray-400">Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </section>
  );
};
