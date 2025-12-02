import React, { useState, useEffect, useRef } from 'react';
import { Heart, Users, Clock, Globe } from 'lucide-react';

const ImpactCounter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    animals: 0,
    ngos: 0,
    volunteers: 0,
    cities: 0
  });
  
  const sectionRef = useRef(null);
  
  const finalCounts = {
    animals: 500,
    ngos: 50,
    volunteers: 1000,
    cities: 25
  };
  
  const stats = [
    {
      icon: Heart,
      key: 'animals',
      label: 'Animals Rescued',
      suffix: '+',
      color: 'text-red-500'
    },
    {
      icon: Users,
      key: 'ngos',
      label: 'NGOs Connected',
      suffix: '+',
      color: 'text-blue-500'
    },
    {
      icon: Clock,
      key: 'volunteers',
      label: 'Active Volunteers',
      suffix: '+',
      color: 'text-green-500'
    },
    {
      icon: Globe,
      key: 'cities',
      label: 'Cities Covered',
      suffix: '+',
      color: 'text-purple-500'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounts({
        animals: Math.floor(finalCounts.animals * progress),
        ngos: Math.floor(finalCounts.ngos * progress),
        volunteers: Math.floor(finalCounts.volunteers * progress),
        cities: Math.floor(finalCounts.cities * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounts(finalCounts);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Impact
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Every number represents a life saved, a family reunited, or hope restored.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.key}
              className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6 ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              
              {/* Number */}
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {counts[stat.key].toLocaleString()}{stat.suffix}
              </div>
              
              {/* Label */}
              <div className="text-blue-100 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional Context */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              24/7 Response Network
            </h3>
            <p className="text-blue-100 text-lg leading-relaxed">
              Our dedicated network operates around the clock, ensuring no emergency call goes unanswered. 
              From street dogs to exotic birds, every life matters in our mission to create a compassionate India.
            </p>
            
            {/* Response Time Indicator */}
            <div className="mt-8 flex items-center justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400">&lt; 15 min</div>
                <div className="text-blue-100 text-sm">Average Response Time</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">98%</div>
                <div className="text-blue-100 text-sm">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactCounter;