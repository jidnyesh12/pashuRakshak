
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight,
  Shield,
  Clock
} from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'NGO Partners', href: '/ngo-partners' },
    { name: 'Success Stories', href: '/success-stories' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
    { name: 'Cookie Policy', href: '/cookie-policy' },
    { name: 'Disclaimer', href: '/disclaimer' }
  ];

  const emergencyServices = [
    { name: 'Report Emergency', href: '/report-animal' },
    { name: 'Track Report', href: '/track-report' },
    { name: 'Emergency Helpline', href: 'tel:+919876543210' },
    { name: 'Find Nearest NGO', href: '/find-ngo' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/pashurakshak' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/pashurakshak' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/pashurakshak' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/pashurakshak' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Emergency Banner */}
      <div className="bg-red-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-3 md:mb-0">
              <Heart className="w-6 h-6 animate-pulse" />
              <span className="font-semibold text-lg">Emergency? Every Second Counts!</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/report-animal"
                className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                Report Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+919876543210"
                className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors text-center"
              >
                Call +91-9876543210
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-600 p-2 rounded-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">PashuRakshak</h3>
                  <p className="text-gray-400 text-sm">Saving Lives Together</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Connecting compassionate citizens with verified NGOs to create a rapid response network for animal emergencies across India.
              </p>
              
              {/* Trust Indicators */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-400">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Verified NGO Network</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">24/7 Emergency Response</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Emergency Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Emergency Services</h4>
              <ul className="space-y-3">
                {emergencyServices.map((service, index) => (
                  <li key={index}>
                    {service.href.startsWith('tel:') ? (
                      <a
                        href={service.href}
                        className="text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2 group"
                      >
                        <Phone className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {service.name}
                      </a>
                    ) : (
                      <Link
                        to={service.href}
                        className="text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2 group"
                      >
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {service.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Get in Touch</h4>
              
              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary-400 mt-0.5" />
                  <div>
                    <p className="text-gray-300">support@pashurakshak.org</p>
                    <p className="text-gray-400 text-sm">General inquiries</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-gray-300">+91-9876543210</p>
                    <p className="text-gray-400 text-sm">Emergency hotline</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <p className="text-gray-300">New Delhi, India</p>
                    <p className="text-gray-400 text-sm">Nationwide coverage</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <p className="text-sm text-gray-400 mb-3">Follow us for updates</p>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 hover:bg-primary-600 p-2 rounded-lg transition-colors"
                      aria-label={social.name}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            
            {/* Copyright */}
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400">
                © 2024 PashuRakshak. All rights reserved.
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Made with ❤️ for animal welfare in India
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-6">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;