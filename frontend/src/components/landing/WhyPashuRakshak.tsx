
import { 
  Shield, 
  MapPin, 
  Clock, 
  Users, 
  Eye, 
  Globe,
  CheckCircle,
  Zap
} from 'lucide-react';

const WhyPashuRakshak = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified NGO Network",
      description: "Every rescue partner is thoroughly vetted and certified",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Eye,
      title: "Live Case Tracking",
      description: "Monitor rescue progress in real-time (after login)",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: MapPin,
      title: "Location-Based Reports",
      description: "Secure, GPS-enabled emergency reporting system",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Zap,
      title: "Emergency-First Workflow",
      description: "Critical cases get immediate priority routing",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: Users,
      title: "Real Humans, Not Bots",
      description: "Every report is handled by trained rescue professionals",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: CheckCircle,
      title: "Transparent Pipeline",
      description: "Complete visibility into rescue operations and outcomes",
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      icon: Globe,
      title: "Nationwide Reach",
      description: "Connected rescue network across all major Indian cities",
      color: "bg-teal-100 text-teal-600"
    },
    {
      icon: Clock,
      title: "24/7 Response Network",
      description: "Round-the-clock emergency response and coordination",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why PashuRakshak?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            India's most trusted digital rescue platform, built by animal lovers for animal lovers.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">ISO 27001</div>
              <div className="text-gray-600">Security Certified</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">GDPR</div>
              <div className="text-gray-600">Privacy Compliant</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">24x7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyPashuRakshak;