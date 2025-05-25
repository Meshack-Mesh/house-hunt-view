
import { MapIcon, Phone, Star, Bed, Bath, Square } from "lucide-react";

interface Property {
  id: number;
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

interface PropertyCardProps {
  property: Property;
  onGetDirections: (property: Property) => void;
  index: number;
}

export const PropertyCard = ({ property, onGetDirections, index }: PropertyCardProps) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Property Image */}
      <div className="relative overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Available
        </div>
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full p-2">
          <Star className="text-yellow-500" size={16} />
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <p className="text-gray-600 mb-4 flex items-center">
          <MapIcon size={16} className="mr-1 text-blue-600" />
          {property.location}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl font-bold text-blue-600">
            {property.price}
            <span className="text-sm font-normal text-gray-500 ml-1">
              {property.period}
            </span>
          </div>
        </div>

        {/* Property Stats */}
        <div className="flex items-center space-x-4 mb-4 text-gray-600">
          <div className="flex items-center">
            <Bed size={16} className="mr-1" />
            <span className="text-sm">{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center">
            <Bath size={16} className="mr-1" />
            <span className="text-sm">{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center">
            <Square size={16} className="mr-1" />
            <span className="text-sm">{property.area}</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
          {property.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium"
            >
              {feature}
            </span>
          ))}
          {property.features.length > 3 && (
            <span className="text-blue-600 text-xs font-medium">
              +{property.features.length - 3} more
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onGetDirections(property)}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2"
          >
            <MapIcon size={16} />
            <span>Get Directions (KSh 20)</span>
          </button>
          <button className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
            <Phone size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
