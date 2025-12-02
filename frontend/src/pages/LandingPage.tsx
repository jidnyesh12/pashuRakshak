import React from 'react';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import HowItWorks from '../components/landing/HowItWorks';
import WhyPashuRakshak from '../components/landing/WhyPashuRakshak';
import ImpactCounter from '../components/landing/ImpactCounter';
import Mission from '../components/landing/Mission';
import RoleBasedJoin from '../components/landing/RoleBasedJoin';
import Testimonials from '../components/landing/Testimonials';
import LegalTrust from '../components/landing/LegalTrust';
import Footer from '../components/landing/Footer';
import EmergencyButton from '../components/common/EmergencyButton';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="about">
        <WhyPashuRakshak />
      </div>
      <ImpactCounter />
      <Mission />
      <RoleBasedJoin />
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="partners">
        <LegalTrust />
      </div>
      <div id="contact">
        <Footer />
      </div>
      <EmergencyButton />
    </div>
  );
};

export default LandingPage;