import React from 'react';
import { Target, Heart, Globe, Users } from 'lucide-react';

const Mission = () => {
  const values = [
    {
      icon: Heart,
      title: "Compassion First",
      description: "Every decision we make is guided by empathy and love for animals in need."
    },
    {
      icon: Target,
      title: "Swift Action",
      description: "Time is critical in rescue operations. We prioritize speed without compromising care."
    },
    {
      icon: Globe,
      title: "Nationwide Impact",
      description: "Building a connected rescue ecosystem across every corner of India."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Powered by volunteers, citizens, and NGOs working together for a common cause."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Statement */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Our Mission
            </h2>
            
            <p className="text-2xl md:text-3xl text-gray-700 leading-relaxed font-light mb-8">
              To build India's most trusted digital rescue network where suffering animals find help faster.
            </p>
            
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-blue-500 lg:mx-0 mx-auto mb-8"></div>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              We envision a future where no injured or distressed animal goes unnoticed, where technology 
              bridges the gap between those who care and those who can act, and where every rescue story 
              becomes a testament to human compassion.
            </p>
          </div>
          
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="/image2.png" 
                alt="Happy rescued dog representing our mission success"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              
              {/* Overlay Badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-red-500" />
                  <div>
                    <div className="font-semibold text-gray-900">Success Story</div>
                    <div className="text-sm text-gray-600">Every rescue matters</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-red-500/20 rounded-full blur-xl"></div>
          </div>
        </div>
        
        {/* Core Values */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <div 
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6 group-hover:shadow-lg transition-all duration-300">
                <value.icon className="w-8 h-8" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Vision Statement */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Our Vision for 2025
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-700">Animals Rescued</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-gray-700">Partner NGOs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-700">Cities Connected</div>
            </div>
          </div>
          
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            By 2025, we aim to be the primary digital infrastructure for animal rescue operations 
            across India, ensuring that every animal emergency receives immediate, professional attention.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Mission;