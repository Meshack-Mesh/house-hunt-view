
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { PaymentModal } from "@/components/PaymentModal";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { SearchFilters } from "@/components/SearchFilters";
import { LocationSearch } from "@/components/LocationSearch";
import { PropertyListings } from "@/components/PropertyListings";
import { PropertiesByArea } from "@/components/PropertiesByArea";
import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { Property, DisplayProperty } from "@/types/Property";

const Index = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { properties, loading: propertiesLoading } = useProperties();
  const [selectedProperty, setSelectedProperty] = useState<DisplayProperty | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 200000 });
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

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

  if (authLoading || propertiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      
      <HeroSection user={user} profile={profile} />

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

      <PropertyListings 
        filteredProperties={filteredProperties}
        userLocation={userLocation}
        onGetDirections={handleGetDirections}
      />

      <PropertiesByArea 
        properties={filteredProperties.map(convertToDisplayProperty)} 
        onGetDirections={handleGetDirections} 
      />

      <AboutSection />
      <ContactSection />
      <Footer />

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
