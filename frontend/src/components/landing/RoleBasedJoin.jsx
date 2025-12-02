import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Building2, 
  Users, 
  ArrowRight, 
  CheckCircle,
  Clock,
  Shield
} from 'lucide-react';

const RoleBasedJoin = () => {
  const roles = [
    {
      icon: Heart,
      title: "Volunteer",
      subtitle: "Be the first responder",
      description: "Join our network of compassionate individuals ready to help animals in emergency situations.",
      benefits: [
        "Receive emergency alerts in your area",
        "Connect with local NGOs and rescue teams", 
        "Track your rescue impact and contributions",
        "Access to volunteer training programs"
      ],
      cta: "Join as Volunteer",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: Building2,
      title: "NGO Partner",
      subtitle: "Expand your rescue reach",
      description: "Register your organization to receive verified emergency reports and coordinate rescue operations.",
      benefits: [
        "Receive geo-tagged emergency reports",
        "Manage rescue operations efficiently",
        "Access volunteer network in your region",
        "Transparent case tracking and reporting"
      ],
      cta: "Register NGO",
      color: "from-blue-500 to-indigo-500", 
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      icon: Users,
      title: "Citizen",
      subtitle: "Report & make a difference",
      description: "Create an account to report animal emergencies and track rescue progress in your community.",
      benefits: [
        "Report emergencies with location tracking",
        "Follow up on your reported cases",
        "Connect with local rescue community",
        "Receive updates on rescue outcomes"
      ],
      cta: "Create Account",
      color: "from-green-500 to-teal-500",
      bgColor: "bg-green-50", 
      borderColor: "border-green-200"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Role in Rescue
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every role is crucial in our mission. Find where you fit best and start making an impact today.
          </p>
        </div>
        
        {/* Role Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {roles.map((role, index) => (
            <div 
              key={index}
              className={`${role.bgColor} ${role.borderColor} border-2 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
            >
              {/* Background Gradient */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${role.color} opacity-10 rounded-full transform translate-x-16 -translate-y-16`}></div>
              
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${role.color} text-white mb-6 relative z-10`}>
                <role.icon className="w-8 h-8" />
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {role.title}
                </h3>
                <p className="text-sm font-medium text-gray-600 mb-4">
                  {role.subtitle}
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {role.description}
                </p>
                
                {/* Benefits */}
                <ul className="space-y-3 mb-8">
                  {role.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                {/* CTA Button */}
                <Link
                  to="/signup"
                  className={`w-full bg-gradient-to-r ${role.color} text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  {role.cta}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Process Overview */}
        <div className="bg-gray-50 rounded-3xl p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Getting Started is Simple
            </h3>
            <p className="text-gray-600 text-lg">
              Join our community in three easy steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white font-bold text-xl mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Sign Up</h4>
              <p className="text-gray-600">Choose your role and create your account with basic verification</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white font-bold text-xl mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Get Verified</h4>
              <p className="text-gray-600">Complete identity verification to ensure network security and trust</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500 text-white font-bold text-xl mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Start Helping</h4>
              <p className="text-gray-600">Begin reporting, volunteering, or coordinating rescue operations</p>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-5 h-5 text-green-500" />
              <span>Secure & Verified</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>5-minute Setup</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Free to Join</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoleBasedJoin;