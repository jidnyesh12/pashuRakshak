import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft,
  Dog,
  Bird,
  Cat,
  Rabbit,
  MapPin,
  Camera,
  CheckCircle2,
  Heart,
  AlertTriangle,
  Stethoscope,
  Droplets,
  Moon,
  HelpCircle,
  Home
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/layout/DashboardLayout';
import ImageUpload from '../components/common/ImageUpload';
import LocationPicker from '../components/common/LocationPicker';
import { reportsAPI } from '../utils/api';
import type { ReportRequest } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Animal type options with icons
const animalTypes = [
  { value: 'DOG', label: 'Dog', icon: Dog, color: 'emerald' },
  { value: 'CAT', label: 'Cat', icon: Cat, color: 'amber' },
  { value: 'BIRD', label: 'Bird', icon: Bird, color: 'sky' },
  { value: 'COW', label: 'Cow', icon: Rabbit, color: 'orange' },
  { value: 'OTHER', label: 'Other', icon: HelpCircle, color: 'slate' },
];

// Condition options with icons
const conditions = [
  { value: 'INJURED', label: 'Injured', icon: AlertTriangle, description: 'Visible wounds or limping' },
  { value: 'BLEEDING', label: 'Bleeding', icon: Droplets, description: 'Active bleeding observed' },
  { value: 'UNCONSCIOUS', label: 'Unconscious', icon: Moon, description: 'Not responding, lying still' },
  { value: 'SICK', label: 'Sick', icon: Stethoscope, description: 'Appears unwell, weak' },
  { value: 'ABANDONED', label: 'Abandoned', icon: Home, description: 'Left alone, needs shelter' },
];

const ReportAnimal: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [stepAnimating, setStepAnimating] = useState(false);

  // Form data
  const [animalType, setAnimalType] = useState<string>('');
  const [condition, setCondition] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return animalType && condition;
      case 2:
        return description.trim().length >= 10;
      case 3:
        return uploadedImage && location;
      default:
        return false;
    }
  };

  const goToStep = (step: number) => {
    if (step < 1 || step > totalSteps) return;
    setStepAnimating(true);
    setTimeout(() => {
      setCurrentStep(step);
      setStepAnimating(false);
    }, 200);
  };

  const nextStep = () => {
    if (canProceed() && currentStep < totalSteps) {
      goToStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!location || !uploadedImage) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const reportData: ReportRequest = {
        animalType,
        condition,
        description,
        injuryDescription: description,
        latitude: location.lat,
        longitude: location.lng,
        address: location.address,
        imageUrls: [uploadedImage],
        reporterName: 'Anonymous',
        reporterPhone: '0000000000',
      };

      await reportsAPI.createReport(reportData);
      toast.success('Report submitted successfully!');
      navigate('/track-report');
    } catch (error) {
      console.error('Report submission failed:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "What animal needs help?";
      case 2:
        return "Tell us what happened";
      case 3:
        return "Help us find them";
      default:
        return "";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return "Select the animal type and their current condition";
      case 2:
        return "Describe the situation in your own words";
      case 3:
        return "Add a photo and mark the exact location";
      default:
        return "";
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-8rem)] flex flex-col font-['Inter',system-ui,sans-serif]">
        
        {/* Progress Header */}
        <div 
          className={`mb-12 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-400 font-medium">
              Step {currentStep} of {totalSteps}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Progress bar */}
          <div className="relative h-1 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Collapsed previous steps */}
          {currentStep > 1 && (
            <div className="mt-6 flex items-center gap-4 text-sm">
              {currentStep > 1 && animalType && (
                <button 
                  onClick={() => goToStep(1)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="capitalize">{animalType.toLowerCase()}</span>
                  <span className="text-emerald-500">•</span>
                  <span className="capitalize">{condition.toLowerCase()}</span>
                </button>
              )}
              {currentStep > 2 && description && (
                <button 
                  onClick={() => goToStep(2)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="truncate max-w-[150px]">{description}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Step Content */}
        <div 
          className={`flex-1 max-w-3xl mx-auto w-full transition-all duration-300 ${
            stepAnimating ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'
          }`}
        >
          {/* Step Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              {getStepTitle()}
            </h1>
            <p className="text-lg text-slate-500">
              {getStepSubtitle()}
            </p>
          </div>

          {/* Step 1: Animal & Condition */}
          {currentStep === 1 && (
            <div className="space-y-12">
              {/* Animal Type Selection */}
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6 text-center">
                  Animal Type
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {animalTypes.map((animal) => {
                    const Icon = animal.icon;
                    const isSelected = animalType === animal.value;
                    return (
                      <button
                        key={animal.value}
                        onClick={() => setAnimalType(animal.value)}
                        className={`group relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-300 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                          isSelected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                        }`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <span className={`font-medium transition-colors ${
                          isSelected ? 'text-emerald-700' : 'text-slate-600'
                        }`}>
                          {animal.label}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="absolute top-3 right-3 w-5 h-5 text-emerald-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Condition Selection */}
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6 text-center">
                  Current Condition
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {conditions.map((cond) => {
                    const Icon = cond.icon;
                    const isSelected = condition === cond.value;
                    return (
                      <button
                        key={cond.value}
                        onClick={() => setCondition(cond.value)}
                        className={`group relative flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          isSelected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className={`font-semibold transition-colors ${
                            isSelected ? 'text-emerald-700' : 'text-slate-700'
                          }`}>
                            {cond.label}
                          </p>
                          <p className="text-sm text-slate-400 mt-1">
                            {cond.description}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-emerald-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Description */}
          {currentStep === 2 && (
            <div className="max-w-2xl mx-auto">
              {/* Decorative quote marks */}
              <div className="relative">
                <div className="absolute -top-8 -left-4 text-8xl text-emerald-100 font-serif leading-none select-none">"</div>
                
                {/* Main input card */}
                <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-sm p-8 overflow-hidden">
                  {/* Subtle gradient background */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-50/50 to-transparent rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                  
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="In your own words, describe what you witnessed..."
                    className="relative z-10 w-full text-lg text-slate-700 placeholder-slate-300 bg-transparent border-0 focus:ring-0 resize-none outline-none leading-relaxed"
                  />
                  
                  {/* Character count */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                      Minimum 10 characters required
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full transition-colors ${
                        description.length >= 10 ? 'bg-emerald-400' : 'bg-slate-200'
                      }`} />
                      <span className={`text-sm font-medium transition-colors ${
                        description.length >= 10 ? 'text-emerald-600' : 'text-slate-400'
                      }`}>
                        {description.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Helpful prompts - Redesigned */}
              <div className="mt-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">What helps</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Landmarks</p>
                      <p className="text-xs text-slate-400 mt-0.5">Shops, buildings, signs nearby</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Visible Injuries</p>
                      <p className="text-xs text-slate-400 mt-0.5">What you can observe</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Duration</p>
                      <p className="text-xs text-slate-400 mt-0.5">How long they've been there</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Dangers</p>
                      <p className="text-xs text-slate-400 mt-0.5">Traffic, crowds, hazards</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Encouraging note */}
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-400 italic">
                  "Every detail you share brings help closer to them"
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Photo & Location */}
          {currentStep === 3 && (
            <div className="space-y-10">
              {/* Photo Upload */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Add a Photo</p>
                    <p className="text-sm text-slate-400">Helps identify the animal quickly</p>
                  </div>
                </div>
                <ImageUpload
                  onUpload={setUploadedImage}
                  onRemove={() => setUploadedImage('')}
                  currentImage={uploadedImage}
                  label=""
                />
              </div>

              {/* Location Picker */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Mark the Location</p>
                    <p className="text-sm text-slate-400">Drag the pin to the exact spot</p>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <LocationPicker
                    onLocationSelect={(lat, lng, address) => setLocation({ lat, lng, address })}
                  />
                </div>
                {location?.address && (
                  <p className="mt-4 text-sm text-slate-500 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    {location.address}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div 
          className={`mt-12 pt-8 border-t border-slate-100 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            {/* Back button */}
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                currentStep === 1
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            {/* Next / Submit button */}
            {currentStep < totalSteps ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  canProceed()
                    ? 'bg-gradient-to-r from-[#1b5e20] to-[#2e7d32] text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-[1.02]'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || isSubmitting}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                  canProceed() && !isSubmitting
                    ? 'bg-gradient-to-r from-[#1b5e20] to-[#2e7d32] text-white shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 hover:scale-[1.02]'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" variant="white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    Submit Report
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportAnimal;