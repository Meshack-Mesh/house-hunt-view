import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PropertyCard } from "@/components/PropertyCard";
import { PaymentModal } from "@/components/PaymentModal";
import { Header } from "@/components/Header";
import { SearchFilters } from "@/components/SearchFilters";
import { LocationSearch } from "@/components/LocationSearch";
import { PropertiesByArea } from "@/components/PropertiesByArea";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { Button } from "@/components/ui/button";
import { MapIcon, Phone, Mail, Plus, UserCheck, Building } from "lucide-react";
import { Property, DisplayProperty } from "@/types/Property";

// Updated property type to match database schema
interface Property {
  id: string; // Changed from number to string (UUID)
  title: string;
  location: string;
  price: number;
  period: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  description: string;
  features: string[];
  coordinates: { lat: number; lng: number } | null; // Explicitly typed instead of Json
  distance?: number;
  image?: string;
}

const Index = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const [selectedProperty, setSelectedProperty] = useState<DisplayProperty | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 200000 });
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
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

      if (error) throw error;

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
        image: property.property_images?.find((img: any) => img.is_primary)?.image_url || 
               property.property_images?.[0]?.image_url ||
               "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop"
      }));

      setProperties(formattedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two coordinates (in km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return d;
  };

  const handleGetDirections = (property: DisplayProperty) => {
    setSelectedProperty(property);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedProperty && selectedProperty.coordinates) {
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${selectedProperty.coordinates.lat},${selectedProperty.coordinates.lng}&travelmode=driving`;
      window.open(directionsUrl, '_blank');
      setIsPaymentModalOpen(false);
      setSelectedProperty(null);
    }
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setUserLocation(location);
    console.log("User location selected:", location);
  };

  const filteredProperties: Property[] = properties
    .filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = property.price >= priceFilter.min && property.price <= priceFilter.max;
      
      // Property type filter
      const matchesPropertyType = propertyTypeFilter === "all" || 
                                 property.title.toLowerCase().includes(propertyTypeFilter.toLowerCase());
      
      // If user has selected a location, filter accordingly
      let matchesLocation = true;
      if (userLocation) {
        if (userLocation.address === "Current Location") {
          matchesLocation = true;
        } else if (userLocation.address === "Nairobi County") {
          matchesLocation = true;
        } else {
          const searchLocation = userLocation.address.toLowerCase();
          const propertyLocation = property.location.toLowerCase();
          
          matchesLocation = propertyLocation.includes(searchLocation) || 
                           searchLocation.includes(propertyLocation.split(',')[0].trim().toLowerCase());
        }
      }
      
      return matchesSearch && matchesPrice && matchesPropertyType && matchesLocation;
    })
    .map(property => {
      // Add distance if user location is available and not searching county-wide
      if (userLocation && userLocation.address !== "Nairobi County" && property.coordinates) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          property.coordinates.lat,
          property.coordinates.lng
        );
        return { ...property, distance: Math.round(distance * 10) / 10 };
      }
      return property;
    })
    .sort((a, b) => {
      // Sort by distance if available
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return 0;
    });

  // Convert Property to DisplayProperty for components
  const convertToDisplayProperty = (property: Property): DisplayProperty => ({
    ...property,
    price: `KSh ${property.price.toLocaleString()}`,
    image: property.image || "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop",
    coordinates: property.coordinates || { lat: -1.2921, lng: 36.8219 }
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Find Your Perfect <span className="text-yellow-300">Rental Home</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Discover amazing empty rental houses across Nairobi. Find your way around the city seamless.
          </p>
          
          {/* Auth/Dashboard Buttons */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            {!user ? (
              <>
                <Link to="/auth">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100 flex items-center space-x-2">
                    <UserCheck size={20} />
                    <span>Sign In as Tenant</span>
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 flex items-center space-x-2">
                    <Building size={20} />
                    <span>Sign In as Landlord</span>
                  </Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-lg">Welcome, {profile?.full_name || profile?.email}!</span>
                {profile?.role === 'landlord' && (
                  <Link to="/dashboard">
                    <Button className="bg-white text-blue-600 hover:bg-gray-100 flex items-center space-x-2">
                      <Plus size={20} />
                      <span>Add Property</span>
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
          
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

      {/* Location Search and Filters */}
      <div className="container mx-auto px-6 -mt-8 relative z-10">
        <LocationSearch onLocationSelect={handleLocationSelect} />
        
        <SearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          priceFilter={priceFilter}
          setPriceFilter={setPriceFilter}
          propertyTypeFilter={propertyTypeFilter}
          setPropertyTypeFilter={setPropertyTypeFilter}
        />
      </div>

      {/* Search Results Section */}
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
                onGetDirections={handleGetDirections}
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

      {/* Properties by Area Section */}
      <PropertiesByArea 
        properties={filteredProperties.map(convertToDisplayProperty)} 
        onGetDirections={handleGetDirections} 
      />

      {/* About Section */}
      <AboutSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">House Hunt Kenya</h3>
              <p className="text-gray-300">
                Your trusted partner in finding the perfect empty rental house in Nairobi and beyond.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><button onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Home</button></li>
                <li><button onClick={() => document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Properties</button></li>
                <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">About</button></li>
                <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-white transition-colors">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-2 text-gray-300">
                <div className="flex items-center">
                  <Phone size={16} className="mr-2" />
                  <span>+254 703 781 416</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2" />
                  <span>meshackmwima@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 House Hunt Kenya. All rights reserved.</p>
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
