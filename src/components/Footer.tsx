
import { Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
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
  );
};
