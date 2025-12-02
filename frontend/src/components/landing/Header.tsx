import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Menu, 
  X, 
  Phone, 
  ArrowRight,
  Shield
} from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About Us', href: '#about' },
    { name: 'NGO Partners', href: '#partners' },
    { name: 'Success Stories', href: '#testimonials' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">PashuRakshak</h1>
              <p className="text-xs text-gray-500 -mt-1">Animal Rescue Network</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(link.href)}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors cursor-pointer"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Emergency Button */}
            <Link
              to="/report-animal"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Emergency
            </Link>
            
            {/* Login Button */}
            <Link
              to="/login"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Login
            </Link>
            
            {/* Signup Button */}
            <Link
              to="/signup"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex items-center gap-2"
            >
              Join Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-4">
              {navLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left text-gray-700 hover:text-primary-600 font-medium transition-colors py-2"
                >
                  {link.name}
                </button>
              ))}
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Link
                  to="/report-animal"
                  onClick={() => setIsMenuOpen(false)}
                  className="block bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-semibold text-center transition-colors"
                >
                  <Heart className="w-4 h-4 inline mr-2" />
                  Report Emergency
                </Link>
                
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 text-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 text-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Join Now
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-50 border-b border-red-200 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 text-red-700 text-sm">
            <Shield className="w-4 h-4" />
            <span className="font-medium">24/7 Emergency Helpline:</span>
            <a 
              href="tel:+919876543210" 
              className="font-bold hover:underline"
            >
              +91-9876543210
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;