
import { useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { PaymentModal } from "@/components/PaymentModal";
import { Header } from "@/components/Header";
import { SearchFilters } from "@/components/SearchFilters";
import { MapIcon, Phone, Mail } from "lucide-react";

// Sample property data
const properties = [
  {
    id: 1,
    title: "Modern 2-Bedroom Apartment",
    location: "Westlands, Nairobi",
    price: "KSh 45,000",
    period: "per month",
    bedrooms: 2,
    bathrooms: 2,
    area: "120 sqm",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    description: "Spacious modern apartment with stunning city views, fully furnished with contemporary amenities.",
    features: ["Parking", "Security", "Generator", "Water"],
    coordinates: { lat: -1.2577, lng: 36.7888 }
  },
  {
    id: 2,
    title: "Luxury 3-Bedroom Villa",
    location: "Karen, Nairobi",
    price: "KSh 85,000",
    period: "per month",
    bedrooms: 3,
    bathrooms: 3,
    area: "250 sqm",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    description: "Beautiful villa in a quiet neighborhood with garden and modern finishes.",
    features: ["Garden", "Parking", "Swimming Pool", "Security"],
    coordinates: { lat: -1.3197, lng: 36.7084 }
  },
  {
    id: 3,
    title: "Cozy 1-Bedroom Studio",
    location: "Kilimani, Nairobi",
    price: "KSh 25,000",
    period: "per month",
    bedrooms: 1,
    bathrooms: 1,
    area: "65 sqm",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    description: "Perfect for young professionals, modern studio with all amenities included.",
    features: ["Furnished", "WiFi", "Security", "Lift"],
    coordinates: { lat: -1.2921, lng: 36.7842 }
  },
  {
    id: 4,
    title: "Family 4-Bedroom House",
    location: "Runda, Nairobi",
    price: "KSh 120,000",
    period: "per month",
    bedrooms: 4,
    bathrooms: 4,
    area: "300 sqm",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
    description: "Spacious family home with large compound and modern amenities.",
    features: ["Large Compound", "Parking", "Generator", "Borehole"],
    coordinates: { lat: -1.2297, lng: 36.7633 }
  },
  {
    id: 5,
    title: "Executive 2-Bedroom Apartment",
    location: "Upperhill, Nairobi",
    price: "KSh 65,000",
    period: "per month",
    bedrooms: 2,
    bathrooms: 2,
    area: "140 sqm",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop",
    description: "High-end apartment in prime location with city skyline views.",
    features: ["City View", "Gym", "Swimming Pool", "Concierge"],
    coordinates: { lat: -1.2921, lng: 36.8219 }
  },
  {
    id: 6,
    title: "Affordable 1-Bedroom Flat",
    location: "Eastleigh, Nairobi",
    price: "KSh 18,000",
    period: "per month",
    bedrooms: 1,
    bathrooms: 1,
    area: "50 sqm",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    description: "Budget-friendly apartment perfect for students and young professionals.",
    features: ["Security", "Water", "Near Transport", "Shops Nearby"],
    coordinates: { lat: -1.2841, lng: 36.8358 }
  }
];

const Index = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 200000 });

  const handleGetDirections = (property) => {
    setSelectedProperty(property);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedProperty) {
      // Generate Google Maps directions URL
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedProperty.coordinates.lat},${selectedProperty.coordinates.lng}&travelmode=driving`;
      window.open(directionsUrl, '_blank');
      setIsPaymentModalOpen(false);
      setSelectedProperty(null);
    }
  };

  const filteredProperties = properties.filter(property => {
    const price = parseInt(property.price.replace(/[^0-9]/g, ''));
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = price >= priceFilter.min && price <= priceFilter.max;
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Find Your Perfect <span className="text-yellow-300">Rental Home</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Discover amazing rental properties across Nairobi. Pay only KSh 20 to unlock exact locations and directions.
          </p>
          <div className="flex items-center justify-center space-x-6 text-lg">
            <div className="flex items-center">
              <MapIcon className="mr-2" size={24} />
              <span>Easy Directions</span>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2" size={24} />
              <span>Direct Contact</span>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <div className="container mx-auto px-6 -mt-8 relative z-10">
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
        />
      </div>

      {/* Properties Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Available Properties</h2>
          <p className="text-gray-600 text-lg">
            {filteredProperties.length} properties found
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => (
            <PropertyCard
              key={property.id}
              property={property}
              onGetDirections={handleGetDirections}
              index={index}
            />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">No properties match your search criteria.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">RentFind Kenya</h3>
              <p className="text-gray-300">
                Your trusted partner in finding the perfect rental home in Nairobi and beyond.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  <span>+254 700 123 456</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2" />
                  <span>info@rentfindkenya.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RentFind Kenya. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        property={selectedProperty}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Index;
