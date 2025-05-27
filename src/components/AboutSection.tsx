
import { Home, Search, MapPin, Phone } from "lucide-react";

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">About RentFind Kenya</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Your trusted partner in finding the perfect empty rental house across Nairobi and beyond
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Discover Your Dream Rental Home
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              RentFind Kenya is the premier platform for discovering empty rental houses across Nairobi County. 
              We understand that finding the perfect home can be challenging, which is why we've made it our 
              mission to simplify your house hunting journey.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our platform connects you directly with available empty houses, saving you time and effort. 
              For just KSh 20, you can unlock exact locations and get directions to your potential new home. 
              We believe everyone deserves to find their perfect living space without the hassle.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">Why Choose RentFind Kenya?</h4>
              <ul className="space-y-2 text-blue-700">
                <li>• Verified empty houses across Nairobi</li>
                <li>• Affordable unlock fee of just KSh 20</li>
                <li>• Direct contact with property owners</li>
                <li>• Accurate location mapping and directions</li>
                <li>• Wide range of budgets and preferences</li>
              </ul>
            </div>
            <p className="text-gray-600 leading-relaxed">
              <strong>Visit our site regularly</strong> to discover more empty houses as we continuously update 
              our listings with fresh properties. Your perfect home is just a click away!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white text-center">
              <Home size={48} className="mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">500+</h4>
              <p className="text-sm">Empty Houses</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg text-white text-center">
              <Search size={48} className="mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Easy</h4>
              <p className="text-sm">Search Process</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg text-white text-center">
              <MapPin size={48} className="mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">20+</h4>
              <p className="text-sm">Areas Covered</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg text-white text-center">
              <Phone size={48} className="mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">24/7</h4>
              <p className="text-sm">Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
