
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Lazy load step components for better performance
const PersonalInfoStep = dynamic(() => import('./steps/PersonalInfoStep'), {
  loading: () => <div className="p-8 animate-pulse"><div className="h-8 bg-gray-200 rounded mb-4"></div></div>
});
const ContactDetailsStep = dynamic(() => import('./steps/ContactDetailsStep'), {
  loading: () => <div className="p-8 animate-pulse"><div className="h-8 bg-gray-200 rounded mb-4"></div></div>
});
const AddressInfoStep = dynamic(() => import('./steps/AddressInfoStep'), {
  loading: () => <div className="p-8 animate-pulse"><div className="h-8 bg-gray-200 rounded mb-4"></div></div>
});
const EducationBankStep = dynamic(() => import('./steps/EducationBankStep'), {
  loading: () => <div className="p-8 animate-pulse"><div className="h-8 bg-gray-200 rounded mb-4"></div></div>
});
const ReviewSubmitStep = dynamic(() => import('./steps/ReviewSubmitStep'), {
  loading: () => <div className="p-8 animate-pulse"><div className="h-8 bg-gray-200 rounded mb-4"></div></div>
});

interface ResumeFormProps {
  currentStep: number;
  formData: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  onSave: (data: any) => void;
}

export default function ResumeForm({ 
  currentStep, 
  formData, 
  onNext, 
  onPrevious, 
  onSave 
}: ResumeFormProps) {
  const [stepData, setStepData] = useState({});

  // Optimize auto-save with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (Object.keys(stepData).length > 0) {
      timeoutId = setTimeout(() => {
        onSave(stepData);
      }, 2000); // Reduced from 10s to 2s for better UX
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [stepData, onSave]);

  const handleStepChange = useCallback((data: any) => {
    setStepData(data);
  }, []);

  const handleNext = useCallback((data: any) => {
    onNext(data);
    setStepData({});
  }, [onNext]);

  // Memoize step components to prevent unnecessary re-renders
  const stepComponent = useMemo(() => {
    const commonProps = {
      initialData: formData,
      onChange: handleStepChange,
      onNext: handleNext,
      onPrevious,
    };

    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            {...commonProps}
            isFirstStep={true}
          />
        );
      case 2:
        return <ContactDetailsStep {...commonProps} />;
      case 3:
        return <AddressInfoStep {...commonProps} />;
      case 4:
        return <EducationBankStep {...commonProps} />;
      case 5:
        return (
          <ReviewSubmitStep
            formData={formData}
            onPrevious={onPrevious}
            onSave={onSave}
          />
        );
      default:
        return <div className="p-8 text-center text-red-500">Invalid step</div>;
    }
  }, [currentStep, formData, handleStepChange, handleNext, onPrevious, onSave]);

  return (
    <div className="p-8">
      {stepComponent}
    </div>
  );
}