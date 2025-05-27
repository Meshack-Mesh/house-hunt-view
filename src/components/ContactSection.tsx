
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-gray-800 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
          <p className="text-gray-300 text-lg">
            Ready to find your perfect home? Contact us today!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 p-3 rounded-full">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Phone Number</h4>
                  <p className="text-gray-300">+254 703 781 416</p>
                  <p className="text-sm text-gray-400">Available 24/7 for inquiries</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-green-600 p-3 rounded-full">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Email Address</h4>
                  <p className="text-gray-300">meshackmwima@gmail.com</p>
                  <p className="text-sm text-gray-400">We respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-purple-600 p-3 rounded-full">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Service Area</h4>
                  <p className="text-gray-300">Nairobi County & Surrounding Areas</p>
                  <p className="text-sm text-gray-400">Expanding to more locations soon</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h4 className="text-xl font-bold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/meshack.mwima"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition-colors"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="https://x.com/meshtriplem?t=BODvAHvAN_5BjzgF_sKaKQ&s=08"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-sky-500 p-3 rounded-full hover:bg-sky-600 transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a 
                  href="https://www.instagram.com/trip.plem?igsh=MWMwZWx1amV2NjZ3Yw=="
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-pink-600 p-3 rounded-full hover:bg-pink-700 transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://www.linkedin.com/in/meshack-mwima-27992a23b?"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-700 p-3 rounded-full hover:bg-blue-800 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              </div>
              <div className="mt-4 text-sm text-gray-400">
                <p>@HousehuntKenya - Follow us for daily property updates</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-700 p-8 rounded-lg">
            <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Tell us what type of house you're looking for..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
