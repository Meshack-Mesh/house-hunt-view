
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Phone, Mail, LogOut, Plus, Settings } from "lucide-react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Define the site owner email
  const SITE_OWNER_EMAIL = "meshackmwima@gmail.com";
  const isOwner = user?.email === SITE_OWNER_EMAIL;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Home className="text-blue-600" size={32} />
            <span className="text-2xl font-bold text-gray-800">House Hunt</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('properties')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Properties
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Contact
            </button>
          </nav>

          {/* User Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {profile?.full_name || profile?.email}
                </span>
                {profile?.role === 'landlord' && (
                  <Link to="/dashboard">
                    <Button size="sm" className="flex items-center space-x-1">
                      <Plus size={16} />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                )}
                {isOwner && (
                  <Link to="/admin">
                    <Button size="sm" variant="outline" className="flex items-center space-x-1">
                      <Settings size={16} />
                      <span>Admin</span>
                    </Button>
                  </Link>
                )}
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="flex items-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Phone size={16} className="mr-1" />
                  <span>+254 703 781 416</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-1" />
                  <span>meshackmwima@gmail.com</span>
                </div>
                <Link to="/auth">
                  <Button size="sm">Sign In</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-gray-700 hover:text-blue-600 py-2 transition-colors text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('properties')}
                className="text-gray-700 hover:text-blue-600 py-2 transition-colors text-left"
              >
                Properties
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="text-gray-700 hover:text-blue-600 py-2 transition-colors text-left"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-gray-700 hover:text-blue-600 py-2 transition-colors text-left"
              >
                Contact
              </button>
              
              {user ? (
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600 py-2">
                    {profile?.full_name || profile?.email}
                  </p>
                  {profile?.role === 'landlord' && (
                    <Link to="/dashboard" className="block">
                      <Button size="sm" className="w-full mb-2">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  {isOwner && (
                    <Link to="/admin" className="block">
                      <Button size="sm" variant="outline" className="w-full mb-2">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="pt-2 border-t">
                  <Link to="/auth" className="block">
                    <Button size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
