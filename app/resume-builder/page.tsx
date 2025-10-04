
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ProgressBar from '@/components/ProgressBar';

// Lazy load ResumeForm to improve initial page load
const ResumeForm = dynamic(() => import('@/components/ResumeForm'), {
  loading: () => (
    <div className="p-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  ),
  ssr: false
});

export default function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const totalSteps = useMemo(() => 5, []);

  useEffect(() => {
    // Optimize data loading with error handling
    const loadSavedData = async () => {
      try {
        const savedData = localStorage.getItem('lms_resume_data');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setFormData(parsed);
          setCurrentStep(parsed.currentStep || 1);
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        // Clear corrupted data
        localStorage.removeItem('lms_resume_data');
      } finally {
        setIsLoading(false);
      }
    };

    // Use setTimeout to prevent blocking the main thread
    setTimeout(loadSavedData, 0);
  }, []);

  const saveData = useCallback((data: any, step?: number) => {
    try {
      const updatedData = { ...formData, ...data };
      if (step) updatedData.currentStep = step;
      
      setFormData(updatedData);
      // Use requestIdleCallback for non-critical localStorage writes
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          localStorage.setItem('lms_resume_data', JSON.stringify(updatedData));
        });
      } else {
        localStorage.setItem('lms_resume_data', JSON.stringify(updatedData));
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }, [formData]);

  const nextStep = useCallback((data: any) => {
    const newStep = Math.min(currentStep + 1, totalSteps);
    saveData(data, newStep);
    setCurrentStep(newStep);
  }, [currentStep, totalSteps, saveData]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-blue-200 rounded-lg"></div>
                <div className="h-6 bg-blue-200 rounded w-48"></div>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3" prefetch={true}>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="ri-building-line text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">LMS Corporate Services</span>
            </Link>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Builder</h1>
          <p className="text-gray-600">Complete your professional profile step by step</p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-8">
          <ResumeForm
            currentStep={currentStep}
            formData={formData}
            onNext={nextStep}
            onPrevious={prevStep}
            onSave={saveData}
          />
        </div>
      </div>
    </div>
  );
}