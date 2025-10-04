
'use client';

import { useState, useEffect } from 'react';

interface ContactDetailsStepProps {
  initialData: any;
  onChange: (data: any) => void;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export default function ContactDetailsStep({ 
  initialData, 
  onChange, 
  onNext, 
  onPrevious 
}: ContactDetailsStepProps) {
  const [formData, setFormData] = useState({
    contact: '',
    email: '',
    fatherName: '',
    motherName: '',
    emergencyContactName: '',
    emergencyContactNo: '',
    bloodGroup: '',
    maritalStatus: '',
    marriageDate: '',
    spouseName: '',
    ...initialData
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const validateContact = (contact: string) => {
    return /^[6-9]\d{9}$/.test(contact);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.contact.trim()) {
      newErrors.contact = 'Contact number is required';
    } else if (!validateContact(formData.contact)) {
      newErrors.contact = 'Invalid contact number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.fatherName.trim()) newErrors.fatherName = 'Father\'s name is required';
    if (!formData.motherName.trim()) newErrors.motherName = 'Mother\'s name is required';
    if (!formData.emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
    
    if (!formData.emergencyContactNo.trim()) {
      newErrors.emergencyContactNo = 'Emergency contact number is required';
    } else if (!validateContact(formData.emergencyContactNo)) {
      newErrors.emergencyContactNo = 'Invalid emergency contact number';
    }

    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';

    if (formData.maritalStatus === 'Married') {
      if (!formData.marriageDate) newErrors.marriageDate = 'Marriage date is required';
      if (!formData.spouseName.trim()) newErrors.spouseName = 'Spouse name is required';
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact & Family Details</h2>
        <p className="text-gray-600">Please provide your contact and family information</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.contact}
            onChange={(e) => handleInputChange('contact', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.contact ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
          />
          {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Father's Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fatherName}
            onChange={(e) => handleInputChange('fatherName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.fatherName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter father's name"
          />
          {errors.fatherName && <p className="text-red-500 text-sm mt-1">{errors.fatherName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mother's Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.motherName}
            onChange={(e) => handleInputChange('motherName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.motherName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter mother's name"
          />
          {errors.motherName && <p className="text-red-500 text-sm mt-1">{errors.motherName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.emergencyContactName}
            onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.emergencyContactName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter emergency contact name"
          />
          {errors.emergencyContactName && <p className="text-red-500 text-sm mt-1">{errors.emergencyContactName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emergency Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.emergencyContactNo}
            onChange={(e) => handleInputChange('emergencyContactNo', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.emergencyContactNo ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter emergency contact number"
            maxLength={10}
          />
          {errors.emergencyContactNo && <p className="text-red-500 text-sm mt-1">{errors.emergencyContactNo}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blood Group <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.bloodGroup}
              onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8 ${
                errors.bloodGroup ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          {errors.bloodGroup && <p className="text-red-500 text-sm mt-1">{errors.bloodGroup}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marital Status <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={formData.maritalStatus}
              onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8 ${
                errors.maritalStatus ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
        </div>

        {formData.maritalStatus === 'Married' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marriage Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.marriageDate}
                onChange={(e) => handleInputChange('marriageDate', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.marriageDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.marriageDate && <p className="text-red-500 text-sm mt-1">{errors.marriageDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spouse Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.spouseName}
                onChange={(e) => handleInputChange('spouseName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.spouseName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter spouse name"
              />
              {errors.spouseName && <p className="text-red-500 text-sm mt-1">{errors.spouseName}</p>}
            </div>
          </>
        )}
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
