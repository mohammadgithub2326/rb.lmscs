
'use client';

import { useState, useEffect } from 'react';
import { LOCATION_UTILS } from '@/lib/config';

interface AddressInfoStepProps {
  initialData: any;
  onChange: (data: any) => void;
  onNext: (data: any) => void;
  onPrevious: () => void;
}

export default function AddressInfoStep({ 
  initialData, 
  onChange, 
  onNext, 
  onPrevious 
}: AddressInfoStepProps) {
  const [formData, setFormData] = useState({
    village: '',
    taluk: '',
    district: '',
    state: '',
    pincode: '',
    ...initialData
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const fetchLocationData = async (pincode: string) => {
    if (pincode.length === 6) {
      setLoading(true);
      setApiMessage('');
      
      try {
        const locationData = await LOCATION_UTILS.fetchLocationData(pincode);
        
        if (locationData) {
          setFormData((prev: any) => ({
            ...prev,
            district: locationData.district || prev.district,
            state: locationData.state || prev.state,
            taluk: locationData.taluk || prev.taluk
          }));
          setApiMessage('Location details auto-filled successfully!');
        } else {
          setApiMessage('Could not auto-fill location details. Please enter manually.');
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
        setApiMessage('Auto-fill unavailable. Please enter address details manually.');
      } finally {
        setLoading(false);
        // Clear message after 3 seconds
        setTimeout(() => setApiMessage(''), 3000);
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    
    if (field === 'pincode' && value.length === 6) {
      fetchLocationData(value);
    }
    
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
    
    // Clear API message when user starts typing manually
    if (['district', 'state', 'taluk'].includes(field) && apiMessage) {
      setApiMessage('');
    }
  };

  const validatePincode = (pincode: string) => {
    return /^\d{6}$/.test(pincode);
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.village.trim()) newErrors.village = 'Village/City is required';
    if (!formData.taluk.trim()) newErrors.taluk = 'Taluk is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!validatePincode(formData.pincode)) {
      newErrors.pincode = 'Invalid pincode format';
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Address Information</h2>
        <p className="text-gray-600">Please provide your current address details</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Village/City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.village}
            onChange={(e) => handleInputChange('village', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.village ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter village or city name"
          />
          {errors.village && <p className="text-red-500 text-sm mt-1">{errors.village}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.pincode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter 6-digit pincode"
              maxLength={6}
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <i className="ri-loader-line animate-spin text-blue-600"></i>
              </div>
            )}
          </div>
          {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
          {apiMessage && (
            <p className={`text-sm mt-1 ${
              apiMessage.includes('successfully') ? 'text-green-600' : 'text-orange-600'
            }`}>
              {apiMessage}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">District, State & Taluk will be auto-filled if available</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taluk <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.taluk}
            onChange={(e) => handleInputChange('taluk', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.taluk ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter taluk name"
          />
          {errors.taluk && <p className="text-red-500 text-sm mt-1">{errors.taluk}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            District <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.district}
            onChange={(e) => handleInputChange('district', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.district ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter district name"
          />
          {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter state name"
          />
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start space-x-3">
          <i className="ri-information-line text-blue-600 mt-1"></i>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Address Verification</h4>
            <p className="text-blue-800 text-sm">
              Please ensure your address details match your official documents. 
              This information will be used for verification purposes.
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
