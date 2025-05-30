
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapIcon, Phone, Plus, UserCheck, Building } from "lucide-react";

interface HeroSectionProps {
  user: any;
  profile: any;
}

export const HeroSection = ({ user, profile }: HeroSectionProps) => {
  return (
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
  );
};
