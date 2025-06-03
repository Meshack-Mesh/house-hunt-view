
import { DisplayProperty } from "@/types/Property";
import { PropertyCard } from "./PropertyCard";

interface PropertiesByAreaProps {
  properties: DisplayProperty[];
  onGetDirections: (property: DisplayProperty) => void;
  paidProperties: Set<string>;
}

export const PropertiesByArea = ({ properties, onGetDirections, paidProperties }: PropertiesByAreaProps) => {
  if (properties.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Featured Properties
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover amazing rental properties across Nairobi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.slice(0, 6).map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              onGetDirections={onGetDirections}
              index={index}
              hasAccessToContact={paidProperties.has(property.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
