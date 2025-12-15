
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Heart,
  Users,
  Clock,
  Globe,
  Phone,
  ArrowRight,
  Quote,
  Shield,
  MapPin,
  Eye,
  Zap,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const mainRef = useRef<HTMLDivElement>(null);

  // Stats
  const impactStats = [
    { icon: Heart, count: 500, label: 'Animals Rescued', suffix: '+' },
    { icon: Users, count: 50, label: 'NGOs Connected', suffix: '+' },
    { icon: Clock, count: 1000, label: 'Active Volunteers', suffix: '+' },
    { icon: Globe, count: 25, label: 'Cities Covered', suffix: '+' },
  ];

  // Steps
  const howItWorksSteps = [
    { icon: Phone, title: "Inform Us", description: "Report animal emergencies through our secure platform." },
    { icon: Users, title: "NGOs Respond", description: "Verified rescue teams receive instant notifications." },
    { icon: Heart, title: "Animal Rescued", description: "Professional care and rehabilitation begins immediately." },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Veterinarian",
      quote: "PashuRakshak has revolutionized our rescue response time. Every minute saved is a life saved."
    },
    {
      name: "Rajesh Kumar",
      role: "Volunteer Coordinator",
      quote: "The verification process ensures we work with genuine cases. It's a game-changer for animal welfare."
    },
    {
      name: "Meera Patel",
      role: "Citizen Reporter",
      quote: "I used to feel helpless seeing injured animals. Now I know exactly how to help, and help arrives fast."
    }
  ];

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // 1. Enhanced Hero Parallax
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero-section",
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
          pin: true,
        },
      });

      heroTl.to("#left-branch", { x: '-200%', rotation: -15, opacity: 0, scale: 1.5, filter: "blur(10px)" }, 0)
        .to("#right-branch", { x: '200%', rotation: 15, opacity: 0, scale: 1.5, filter: "blur(10px)" }, 0)
        .to("#hero-text", { y: -200, opacity: 0, scale: 0.8 }, 0);


      // 2. Sequential "How It Works"
      // Pin the section, move the steps horizontally or fade them in sequence
      const workTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#works-section",
          start: "top top",
          end: "+=300%", // Scroll distance
          scrub: 1,
          pin: true,
        }
      });

      // Animate steps in
      howItWorksSteps.forEach((_, i) => {
        workTl.fromTo(`#work-step-${i}`,
          { opacity: 0, y: 100, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power2.out" }
        );
        // Hold for a bit
        if (i < howItWorksSteps.length - 1) {
          workTl.to(`#work-step-${i}`, { opacity: 0.5, scale: 0.9, duration: 0.5 });
        }
      });


      // 3. Left-aligned Testimonials
      // Pin the section, scroll through testimonials on the left
      const testTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#testimonial-section",
          start: "top top",
          end: "+=300%",
          scrub: 1,
          pin: true,
        }
      });

      testimonials.forEach((_, i) => {
        // Enter
        testTl.fromTo(`#testimonial-${i}`,
          { x: -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 1 }
        );
        // Exit (unless last)
        if (i < testimonials.length - 1) {
          testTl.to(`#testimonial-${i}`, { opacity: 0, y: -50, duration: 0.5 });
        }
      });
    });

    // Impact Numbers
    impactStats.forEach((stat, index) => {
      const el = document.getElementById(`stat-${index}`);
      if (el) {
        gsap.from(el, {
          textContent: 0,
          duration: 2,
          ease: "power1.out",
          snap: { textContent: 1 },
          stagger: 1,
          scrollTrigger: {
            trigger: "#impact-section",
            start: "top center+=100",
            toggleActions: "play none none reverse"
          }
        });
      }
    });

  }, { scope: mainRef });

  return (
    <div ref={mainRef} className="bg-[#f4f7f6] text-[#004432] overflow-x-hidden w-full font-sans selection:bg-[#e6ce00] selection:text-[#004432]">

      {/* Simplified Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-transparent pointer-events-none">
        <div className="pointer-events-auto cursor-pointer">
          <img src="/logo.png" alt="PashuRakshak Logo" className="h-20 w-auto object-contain drop-shadow-lg" />
        </div>
        <div className="flex gap-4 pointer-events-auto">
          <Link to="/login" className="px-8 py-3 rounded-full border-2 border-[#004432] text-[#004432] font-bold hover:bg-[#004432] hover:text-[#e6ce00] transition-all duration-300">
            Login
          </Link>
          <Link to="/signup" className="px-8 py-3 rounded-full bg-[#004432] text-[#e6ce00] font-bold border-2 border-[#004432] hover:bg-transparent hover:text-[#004432] transition-all duration-300 shadow-xl">
            Join
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero-section" className="h-screen relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#dcfce7] via-[#f0fdf4] to-[#f4f7f6] z-0"></div>

        <div id="hero-text" className="relative z-10 text-center px-4 max-w-6xl">
          <div className="mb-6 inline-block px-6 py-2 rounded-full bg-[#e6ce00] text-[#004432] text-sm font-bold tracking-widest uppercase shadow-lg">
            Wildlife Protection Initiative
          </div>
          <h1 className="text-7xl md:text-[10rem] font-black mb-4 font-serif text-[#004432] leading-none tracking-tighter mix-blend-darken">
            PASHU<br />RAKSHAK
          </h1>
          <p className="text-2xl md:text-3xl font-light text-[#15803d] mb-12 max-w-3xl mx-auto leading-relaxed">
            Where technology meets compassion. <br /> <strong className="font-semibold">Rescue. Rehabilitate. Release.</strong>
          </p>
        </div>

        {/* Dramatic Parallax Branches */}
        <div id="left-branch" className="absolute left-[-10%] bottom-[-10%] top-[-10%] w-[60%] z-20 pointer-events-none origin-center">
          <svg viewBox="0 0 500 1000" className="h-full w-full object-cover text-[#14532d]" fill="currentColor">
            <path d="M0,1000 C200,800 100,600 400,300 C500,200 400,50 300,0 L-100,0 L-100,1000 Z" opacity="0.95" />
            <path d="M-50,1000 C150,700 50,400 300,100 L-100,0 L-100,1000 Z" opacity="0.7" />
          </svg>
        </div>
        <div id="right-branch" className="absolute right-[-10%] bottom-[-10%] top-[-10%] w-[60%] z-20 pointer-events-none origin-center">
          <svg viewBox="0 0 500 1000" className="h-full w-full object-cover text-[#14532d] transform scale-x-[-1]" fill="currentColor">
            <path d="M0,1000 C200,800 100,600 400,300 C500,200 400,50 300,0 L-100,0 L-100,1000 Z" opacity="0.95" />
            <path d="M-50,1000 C150,700 50,400 300,100 L-100,0 L-100,1000 Z" opacity="0.7" />
          </svg>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact-section" className="relative z-30 py-40 px-6 bg-white rounded-[3rem] -mt-20 shadow-2xl mx-4 md:mx-10 lg:mx-20 border border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
            {impactStats.map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="mb-6 inline-flex p-5 rounded-full bg-[#f0fdf4] text-[#15803d] shadow-inner group-hover:scale-110 group-hover:bg-[#15803d] group-hover:text-[#e6ce00] transition-all duration-500">
                  <stat.icon size={48} strokeWidth={1.5} />
                </div>
                <div className="text-6xl md:text-8xl font-black text-[#004432] mb-4 font-serif leading-none tracking-tight">
                  <span id={`stat-${i}`}>{stat.count}</span>
                  <span className="text-4xl align-top text-[#e6ce00]">{stat.suffix}</span>
                </div>
                <p className="text-lg text-[#166534] font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sequential How It Works */}
      <section id="works-section" className="relative h-screen bg-[#004432] text-[#f4f7f6] overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <path d="M0,500 C400,500 400,0 800,0 S1200,1000 1600,1000" fill="none" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto w-full px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="text-left">
            <h2 className="text-6xl font-black font-serif mb-8 text-[#e6ce00] leading-tight">How We<br />Save Lives.</h2>
            <p className="text-2xl font-light text-gray-300 max-w-md">A seamless journey from distress to safety.</p>
          </div>

          <div className="space-y-0 relative min-h-[500px] flex flex-col justify-center">
            {howItWorksSteps.map((step, i) => (
              <div id={`work-step-${i}`} key={i} className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 flex gap-6 items-center shadow-xl absolute w-full top-1/2 left-0 -translate-y-1/2">
                <div className="h-20 w-20 rounded-full bg-[#e6ce00] text-[#004432] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <step.icon size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">{step.title}</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">{step.description}</p>
                </div>
                <div className="absolute -right-4 -top-4 text-8xl font-black text-white/5 font-serif">{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Cards (Preserved) */}
      <section className="py-40 px-6 bg-[#f4f7f6]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-[#004432] font-serif mb-20 text-center">Built for Trust & Speed</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Verified", desc: "100% Vetted Partners" },
              { icon: Eye, title: "Transparent", desc: "Real-time Updates" },
              { icon: MapPin, title: "Precise", desc: "GPS Location Tagging" },
              { icon: Zap, title: "Fast", desc: "Instant Notifications" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-b-8 border-[#004432]">
                <item.icon size={40} className="text-[#13735f] mb-6" />
                <h3 className="text-2xl font-bold text-[#004432] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Testimonials */}
      <section id="testimonial-section" className="h-screen bg-[#13735f] text-white flex items-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-6 grid md:grid-cols-2 gap-20">
          {/* Left Side: Testimonials stack */}
          <div className="relative min-h-[400px]">
            {testimonials.map((t, i) => (
              <div id={`testimonial-${i}`} key={i} className="absolute top-0 left-0 w-full">
                <Quote size={60} className="text-[#e6ce00] mb-8 opacity-50" />
                <p className="text-4xl md:text-5xl font-serif leading-tight mb-10 font-medium">"{t.quote}"</p>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-[#004432] border-2 border-[#e6ce00] flex items-center justify-center font-bold text-2xl">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-[#e6ce00]">{t.name}</h4>
                    <p className="text-green-200">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Static Header */}
          <div className="flex flex-col justify-center border-l border-white/20 pl-16">
            <h2 className="text-6xl font-black mb-6">Voices<br />of Impact.</h2>
            <p className="text-xl text-green-100 max-w-sm mb-12">Hear from the heroes on the ground who make a difference every single day.</p>
            <Link to="/signup" className="self-start px-10 py-4 bg-white text-[#004432] rounded-full font-bold text-lg hover:bg-[#e6ce00] transition-colors shadow-lg">
              Join the Community
            </Link>
          </div>
        </div>
      </section>

      {/* Final Footer */}
      <footer className="bg-[#002d20] py-12 text-center text-[#47b27a]/60">
        <p>© 2024 PashuRakshak. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Home;