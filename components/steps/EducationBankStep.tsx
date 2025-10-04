
'use client';

import { useState, useEffect } from 'react';
import { LOCATION_UTILS } from '@/lib/config';

interface EducationBankStepProps {
  initialData: any;
  onChange: (data: any) => void;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export default function EducationBankStep({ 
  initialData, 
  onChange, 
  onNext, 
  onPrevious 
}: EducationBankStepProps) {
  const [formData, setFormData] = useState({
    education: '',
    specialization: '',
    year: '',
    accountNo: '',
    ifsc: '',
    bankName: '',
    branchName: '',
    lmsExperience: '',
    employeeId: '',
    ...initialData
  });

  const [errors, setErrors] = useState<any>({});
  const [bankMessage, setBankMessage] = useState('');

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    
    // Clear employee ID if experience is changed to "No"
    if (field === 'lmsExperience' && value === 'No') {
      setFormData((prev: any) => ({ ...prev, employeeId: '' }));
    }
    
    // Auto-fill bank name from IFSC code
   if (field === 'ifsc' && value.length >= 4) {
  const bankDetailsPromise = LOCATION_UTILS.getBankNameFromIFSC(value);
  
  bankDetailsPromise.then((bankDetails) => {
    if (bankDetails) {
      setFormData((prev: any) => ({ ...prev, bankName: bankDetails.bankName, branchName: bankDetails.branchName }));
      setBankMessage(`Bank name and branch auto-filled: ${bankDetails.bankName} - ${bankDetails.branchName}`);
      setTimeout(() => setBankMessage(''), 3000);
    } else {
      setBankMessage('Bank name and branch not found. Please enter manually.');
      setTimeout(() => setBankMessage(''), 3000);
    }
  }).catch((error) => {
    console.error('Error fetching bank details:', error);
    setBankMessage('Error fetching bank details. Please try again.');
    setTimeout(() => setBankMessage(''), 3000);
  });
}
    
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const validateIFSC = (ifsc: string) => {
    return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc);
  };

  const validateAccountNumber = (accountNo: string) => {
    return /^\d{9,18}$/.test(accountNo);
  };

  const validateEmployeeId = (employeeId: string) => {
    return /^[A-Z0-9]{6,12}$/.test(employeeId);
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.education) newErrors.education = 'Education level is required';
    if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
    if (!formData.year.trim()) newErrors.year = 'Year is required';
    
    if (!formData.accountNo.trim()) {
      newErrors.accountNo = 'Account number is required';
    } else if (!validateAccountNumber(formData.accountNo)) {
      newErrors.accountNo = 'Invalid account number format';
    }
    
    if (!formData.ifsc.trim()) {
      newErrors.ifsc = 'IFSC code is required';
    } else if (!validateIFSC(formData.ifsc)) {
      newErrors.ifsc = 'Invalid IFSC code format';
    }
    
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
    if (!formData.branchName.trim()) newErrors.branchName = 'Branch name is required';
    if (!formData.lmsExperience) newErrors.lmsExperience = 'LMS experience is required';
    
    // Validate employee ID if experience is "Yes"
    if (formData.lmsExperience === 'Yes') {
      if (!formData.employeeId.trim()) {
        newErrors.employeeId = 'Employee ID is required for experienced candidates';
      } else if (!validateEmployeeId(formData.employeeId)) {
        newErrors.employeeId = 'Employee ID must be 6-12 characters (letters and numbers only)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Education & Banking Details</h2>
        <p className="text-gray-600">Please provide your educational background and banking information</p>
      </div>

      {/* Education Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Educational Information</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education Level <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8 ${
                errors.education ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select education level</option>
              <option value="10th">10th Standard</option>
              <option value="Inter">Intermediate (12th)</option>
              <option value="Diploma">Diploma</option>
              <option value="Degree">Bachelor's Degree</option>
              <option value="Master's">Master's Degree</option>
            </select>
            {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => handleInputChange('specialization', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.specialization ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Computer Science, Commerce"
            />
            {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year of Completion <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) => handleInputChange('year', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.year ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 2020"
              maxLength={4}
            />
            {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
          </div>
        </div>
      </div>

      {/* Banking Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Banking Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.accountNo}
              onChange={(e) => handleInputChange('accountNo', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.accountNo ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your bank account number"
              maxLength={18}
            />
            {errors.accountNo && <p className="text-red-500 text-sm mt-1">{errors.accountNo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ifsc}
              onChange={(e) => handleInputChange('ifsc', e.target.value.toUpperCase())}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.ifsc ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., SBIN0001234"
              maxLength={11}
            />
            {errors.ifsc && <p className="text-red-500 text-sm mt-1">{errors.ifsc}</p>}
            {bankMessage && (
              <p className={`text-sm mt-1 ${
                bankMessage.includes('auto-filled') ? 'text-green-600' : 'text-orange-600'
              }`}>
                {bankMessage}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">Bank name will be auto-filled if available</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => handleInputChange('bankName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.bankName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter bank name"
            />
            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.branchName}
              onChange={(e) => handleInputChange('branchName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.branchName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter branch name"
            />
            {errors.branchName && <p className="text-red-500 text-sm mt-1">{errors.branchName}</p>}
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Do you have previous LMS experience? <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="lmsExperience"
                  value="Yes"
                  checked={formData.lmsExperience === 'Yes'}
                  onChange={(e) => handleInputChange('lmsExperience', e.target.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="lmsExperience"
                  value="No"
                  checked={formData.lmsExperience === 'No'}
                  onChange={(e) => handleInputChange('lmsExperience', e.target.value)}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">No</span>
              </label>
            </div>
            {errors.lmsExperience && <p className="text-red-500 text-sm mt-1">{errors.lmsExperience}</p>}
          </div>

          {/* Employee ID field - only show if experience is "Yes" */}
          {formData.lmsExperience === 'Yes' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value.toUpperCase())}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.employeeId ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your previous employee ID"
                maxLength={12}
              />
              {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>}
              <p className="text-xs text-gray-500 mt-1">Enter your previous LMS employee ID (6-12 characters)</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
        <div className="flex items-start space-x-3">
          <i className="ri-shield-check-line text-yellow-600 mt-1"></i>
          <div>
            <h4 className="font-medium text-yellow-900 mb-1">Banking Security</h4>
            <p className="text-yellow-800 text-sm">
              Your banking information is securely encrypted and will only be used for salary processing. 
              Please ensure all details are accurate to avoid payment delays.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}