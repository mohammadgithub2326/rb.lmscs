
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { DATE_UTILS } from '@/lib/config';

interface PersonalInfoStepProps {
  initialData: any;
  onChange: (data: any) => void;
  onNext: (data: any) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
}

export default function PersonalInfoStep({ 
  initialData, 
  onChange, 
  onNext, 
  onPrevious, 
  isFirstStep 
}: PersonalInfoStepProps) {
  const [formData, setFormData] = useState({
    vendorName: 'LMS Corporate Services PVT LTD',
    firstName: '',
    middleName: '', // New middle name field
    lastName: '',
    fullName: '', // Auto-calculated full name
    gender: '',
    dob: '',
    age: '', // Detailed age calculation
    aadhaar: '',
    pan: '',
    ...initialData
  });

  const [errors, setErrors] = useState<any>({});

  // Auto-calculate full name when first, middle, or last name changes
  useEffect(() => {
    const { firstName, middleName, lastName } = formData;
    const fullNameParts = [firstName, middleName, lastName].filter(part => part.trim());
    const calculatedFullName = fullNameParts.join(' ');
    
    if (calculatedFullName !== formData.fullName) {
      setFormData((prev: any) => ({ ...prev, fullName: calculatedFullName }));
    }
  }, [formData.firstName, formData.middleName, formData.lastName, formData.fullName]);

  // Optimized detailed age calculation with memoization
  const calculatedAge = useMemo(() => {
    if (!formData.dob) return '';
    return DATE_UTILS.calculateDetailedAge(formData.dob);
  }, [formData.dob]);

  useEffect(() => {
    if (calculatedAge !== formData.age) {
      setFormData((prev: any) => ({ ...prev, age: calculatedAge }));
    }
  }, [calculatedAge, formData.age]);

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  // Memoized validation functions
  const validateAadhaar = useCallback((aadhaar: string) => {
    return /^\d{12}$/.test(aadhaar.replace(/\s/g, ''));
  }, []);

  const validatePAN = useCallback((pan: string) => {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    
    // Clear error immediately when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: any = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    // Middle name is optional, no validation needed
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.aadhaar.trim()) {
      newErrors.aadhaar = 'Aadhaar number is required';
    } else if (!validateAadhaar(formData.aadhaar)) {
      newErrors.aadhaar = 'Invalid Aadhaar number';
    }
    if (!formData.pan.trim()) {
      newErrors.pan = 'PAN number is required';
    } else if (!validatePAN(formData.pan)) {
      newErrors.pan = 'Invalid PAN number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateAadhaar, validatePAN]);

  const handleNext = useCallback(() => {
    if (validateForm()) {
      onNext(formData);
    }
  }, [validateForm, formData, onNext]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
        <p className="text-gray-600">Please provide your basic personal details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendor Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.vendorName}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
            autoComplete="given-name"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Middle Name <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            value={formData.middleName}
            onChange={(e) => handleInputChange('middleName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter your middle name"
            autoComplete="additional-name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
            autoComplete="family-name"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            placeholder="Auto-generated from first, middle, and last name"
          />
          <p className="text-xs text-gray-500 mt-1">Automatically generated from your name fields</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8 transition-colors duration-200 ${
                errors.gender ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => handleInputChange('dob', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.dob ? 'border-red-500' : 'border-gray-300'
            }`}
            autoComplete="bday"
            style={{
              colorScheme: 'light'
            }}
          />
          {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
          {/* <p className="text-xs text-gray-500 mt-1">Format: DD/MM/YYYY</p> */}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="text"
            value={formData.age}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
            placeholder="Auto-calculated from date of birth"
          />
          <p className="text-xs text-gray-500 mt-1">Automatically calculated in years, months, and days</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Aadhaar Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.aadhaar}
            onChange={(e) => handleInputChange('aadhaar', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.aadhaar ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter 12-digit Aadhaar number"
            maxLength={12}
          />
          {errors.aadhaar && <p className="text-red-500 text-sm mt-1">{errors.aadhaar}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PAN Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.pan}
            onChange={(e) => handleInputChange('pan', e.target.value.toUpperCase())}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
              errors.pan ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter PAN number (e.g., ABCDE1234F)"
            maxLength={10}
          />
          {errors.pan && <p className="text-red-500 text-sm mt-1">{errors.pan}</p>}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          disabled={isFirstStep}
          className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap ${
            isFirstStep 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}