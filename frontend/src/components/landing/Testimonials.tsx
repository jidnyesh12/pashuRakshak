import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  location: string;
  image: string;
  content: string;
  rating: number;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Dr. Priya Sharma",
      role: "Veterinarian, Mumbai Animal Welfare Society",
      location: "Mumbai, Maharashtra",
      image: "/images/testimonial-vet.jpg",
      content: "PashuRakshak has revolutionized how we receive and respond to emergency cases. The real-time notifications and location tracking have reduced our response time by 60%. Every minute saved means a life saved.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Volunteer Coordinator",
      location: "Delhi, NCR",
      image: "/images/testimonial-volunteer.jpg",
      content: "As someone who has been rescuing animals for 8 years, I can say this platform is a game-changer. The verification process ensures we work with genuine cases, and the tracking system keeps everyone accountable.",
      rating: 5
    },
    {
      name: "Meera Patel",
      role: "Concerned Citizen & Regular Reporter",
      location: "Ahmedabad, Gujarat",
      image: "/images/testimonial-citizen.jpg",
      content: "I was hesitant to report animal emergencies before because I didn't know who to trust. PashuRakshak's verified NGO network gave me confidence. I've reported 12 cases so far, and each one was handled professionally.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Voices from Our Community
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from NGO workers, volunteers, and citizens who are making a difference every day.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-6 mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-8 italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-xs text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Network */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Growing Community Network
            </h3>
            <p className="text-gray-600">
              Join our expanding network of animal lovers and rescue volunteers
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-1">50+</div>
              <div className="text-sm text-gray-600">Verified NGOs</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-1">1000+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-1">25+</div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;