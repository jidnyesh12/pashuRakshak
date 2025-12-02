import React from 'react';
import { 
  Shield, 
  FileText, 
  CheckCircle, 
  Lock, 
  Eye, 
  Users,
  ArrowRight,
  Award
} from 'lucide-react';

const LegalTrust = () => {
  const trustCards = [
    {
      icon: FileText,
      title: "Privacy Policy",
      description: "Comprehensive data protection and privacy guidelines ensuring your information stays secure.",
      features: [
        "GDPR compliant data handling",
        "Minimal data collection policy", 
        "Transparent usage guidelines",
        "Right to data deletion"
      ],
      link: "/privacy-policy"
    },
    {
      icon: CheckCircle,
      title: "NGO Verification Process",
      description: "Rigorous multi-step verification ensuring only legitimate rescue organizations join our network.",
      features: [
        "Legal registration verification",
        "Field operation validation",
        "Reference checks from authorities",
        "Ongoing performance monitoring"
      ],
      link: "/ngo-verification"
    },
    {
      icon: Shield,
      title: "Safety Guidelines",
      description: "Comprehensive safety protocols for volunteers, NGOs, and citizens during rescue operations.",
      features: [
        "Emergency response protocols",
        "Personal safety guidelines",
        "Equipment usage standards",
        "Risk assessment procedures"
      ],
      link: "/safety-guidelines"
    }
  ];

  const certifications = [
    {
      icon: Award,
      title: "ISO 27001 Certified",
      description: "Information security management system certification"
    },
    {
      icon: Lock,
      title: "SSL Encrypted",
      description: "End-to-end encryption for all data transmission"
    },
    {
      icon: Eye,
      title: "SOC 2 Compliant",
      description: "Service organization control for security and availability"
    },
    {
      icon: Users,
      title: "GDPR Compliant",
      description: "European data protection regulation compliance"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trust & Transparency
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built on the foundation of trust, security, and legal compliance to ensure safe rescue operations.
          </p>
        </div>
        
        {/* Trust Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {trustCards.map((card, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 text-blue-600 mb-6">
                <card.icon className="w-7 h-7" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {card.title}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                {card.description}
              </p>
              
              {/* Features */}
              <ul className="space-y-2 mb-6">
                {card.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* Link */}
              <a 
                href={card.link}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Read Full Document
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
        
        {/* Certifications */}
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Security Certifications
            </h3>
            <p className="text-gray-600 text-lg">
              Industry-standard security and compliance certifications
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                  <cert.icon className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{cert.title}</h4>
                <p className="text-gray-600 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Emergency Contact */}
        <div className="mt-16 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">
            Emergency Support
          </h3>
          <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
            For urgent rescue situations or platform emergencies, our support team is available 24/7
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold">Emergency Hotline: +91-XXXX-XXXX</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="font-semibold">Email: emergency@pashurakshak.org</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalTrust;