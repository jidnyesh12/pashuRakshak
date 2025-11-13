import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">PashuRakshak</span>
            </div>
            <p className="text-gray-300 mb-4">
              Dedicated to rescuing and caring for injured animals. Together, we can make a difference 
              in the lives of our furry friends who need our help the most.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+91-9876543210</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>help@pashurakshak.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/report" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Report Animal
                </a>
              </li>
              <li>
                <a href="/track" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Track Report
                </a>
              </li>
              <li>
                <a href="/ngos" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Find NGOs
                </a>
              </li>
              <li>
                <a href="/volunteer" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Volunteer
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/help" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 PashuRakshak. All rights reserved. Made with ❤️ for animals in need.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;