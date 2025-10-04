
'use client';

import { useState } from 'react';
import { API_CONFIG } from '@/lib/config';

interface ApplicationDetailsProps {
  application: any;
  onBack: () => void;
  onUpdate: (id: number, status: string, comments?: string) => void;
  onUpdateOnboarding: (id: number, onboardingStatus: string) => void;
}

export default function ApplicationDetails({ 
  application, 
  onBack, 
  onUpdate,
  onUpdateOnboarding
}: ApplicationDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...application });
  const [comments, setComments] = useState(application.comments || '');
  const [showComments, setShowComments] = useState(false);
  const [onboardingStatus, setOnboardingStatus] = useState(application.onboardingStatus || 'Not Done');

  const handleSave = async () => {
    try {
      if (API_CONFIG.shouldUseAPI()) {
        const response = await fetch(API_CONFIG.getEndpoint('resumeBuilderAPPLICATION_UPDATE'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('lms_admin_token')}`,
          },
          body: JSON.stringify({
            // applicationId: application.id,
            applicationNumber: application.applicationNumber,
            updatedData: editData,
            adminId: 'admin',
            timestamp: new Date().toISOString()
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save changes');
        }
      }

      setIsEditing(false);
      Object.assign(application, editData);
      
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.textContent = 'Changes saved successfully';
      document.body.appendChild(successDiv);
      setTimeout(() => successDiv.remove(), 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.textContent = 'Failed to save changes. Please try again.';
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
      
      setIsEditing(false);
      Object.assign(application, editData);
    }
  };

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      if (API_CONFIG.shouldUseAPI()) {
        const response = await fetch(API_CONFIG.getEndpoint('resumeBuilderAPPLICATION_UPDATE_STATUS'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('lms_admin_token')}`,
          },
          body: JSON.stringify({
            applicationId: application.id,
            applicationNumber: application.applicationNumber,
            statusUpdate: {
              status: newStatus,
              comments: comments,
              updatedBy: 'admin',
              updatedAt: new Date().toISOString()
            },
            adminId: 'admin',
            timestamp: new Date().toISOString()
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update status');
        }
      }

      onUpdate(application.id, newStatus, comments);
      
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.textContent = `Status updated to ${newStatus} successfully`;
      document.body.appendChild(successDiv);
      setTimeout(() => successDiv.remove(), 3000);
    } catch (error) {
      console.error('Error updating status:', error);
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.textContent = 'Failed to update status. Please try again.';
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
      
      onUpdate(application.id, newStatus, comments);
    }
  };

  const handleOnboardingToggle = async () => {
    const newStatus = onboardingStatus === 'Done' ? 'Not Done' : 'Done';
    
    try {
      if (API_CONFIG.shouldUseAPI()) {
        const response = await fetch(API_CONFIG.getEndpoint('resumeBuilderAPPLICATION_UPDATE_ONBOARDING_STATUS'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('lms_admin_token')}`,
          },
          body: JSON.stringify({
            applicationId: application.id,
            applicationNumber: application.applicationNumber,
            onboardingUpdate: {
              onboardingStatus: newStatus,
              updatedBy: 'admin',
              updatedAt: new Date().toISOString()
            },
            adminId: 'admin',
            timestamp: new Date().toISOString()
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update onboarding status');
        }
      }

      setOnboardingStatus(newStatus);
      onUpdateOnboarding(application.id, newStatus);
      
      const successDiv = document.createElement('div');
      successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successDiv.textContent = `Onboarding status updated to ${newStatus}`;
      document.body.appendChild(successDiv);
      setTimeout(() => successDiv.remove(), 3000);
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      errorDiv.textContent = 'Failed to update onboarding status. Please try again.';
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 3000);
      
      setOnboardingStatus(newStatus);
      onUpdateOnboarding(application.id, newStatus);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'reviewing': return 'text-yellow-600 bg-yellow-100';
      case 'submitted': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
              >
                <i className="ri-arrow-left-line"></i>
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                Application #{application.applicationNumber}
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Details'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => handleEditChange('firstName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.middleName || ''}
                      onChange={(e) => handleEditChange('middleName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.middleName || 'N/A'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => handleEditChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-gray-900 font-medium">{application.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  {isEditing ? (
                    <select
                      value={editData.gender}
                      onChange={(e) => handleEditChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{application.gender}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.dob}
                      onChange={(e) => handleEditChange('dob', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.dob}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <p className="text-gray-900">{application.age}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.aadhaar}
                      onChange={(e) => handleEditChange('aadhaar', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={12}
                    />
                  ) : (
                    <p className="text-gray-900">{application.aadhaar}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.pan}
                      onChange={(e) => handleEditChange('pan', e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={10}
                    />
                  ) : (
                    <p className="text-gray-900">{application.pan}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.contact}
                      onChange={(e) => handleEditChange('contact', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      maxLength={10}
                    />
                  ) : (
                    <p className="text-gray-900">{application.contact}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleEditChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.fatherName}
                      onChange={(e) => handleEditChange('fatherName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.fatherName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.motherName}
                      onChange={(e) => handleEditChange('motherName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.motherName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.emergencyContactName}
                      onChange={(e) => handleEditChange('emergencyContactName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.emergencyContactName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.emergencyContactNo}
                      onChange={(e) => handleEditChange('emergencyContactNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                      maxLength={10}
                    />
                  ) : (
                    <p className="text-gray-900">{application.emergencyContactNo}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  {isEditing ? (
                    <select
                      value={editData.bloodGroup}
                      onChange={(e) => handleEditChange('bloodGroup', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500 pr-8"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{application.bloodGroup}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  {isEditing ? (
                    <select
                      value={editData.maritalStatus}
                      onChange={(e) => handleEditChange('maritalStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500 pr-8"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{application.maritalStatus}</p>
                  )}
                </div>
                {(application.maritalStatus === 'Married' || editData.maritalStatus === 'Married') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marriage Date</label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editData.marriageDate || ''}
                          onChange={(e) => handleEditChange('marriageDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{application.marriageDate}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Spouse Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.spouseName || ''}
                          onChange={(e) => handleEditChange('spouseName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{application.spouseName}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Village/City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.village}
                      onChange={(e) => handleEditChange('village', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.village}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Taluk</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.taluk}
                      onChange={(e) => handleEditChange('taluk', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.taluk}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.district}
                      onChange={(e) => handleEditChange('district', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.district}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.state}
                      onChange={(e) => handleEditChange('state', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.state}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.pincode}
                      onChange={(e) => handleEditChange('pincode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                      maxLength={6}
                    />
                  ) : (
                    <p className="text-gray-900">{application.pincode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Education & Banking */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Education & Banking</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  {isEditing ? (
                    <select
                      value={editData.education}
                      onChange={(e) => handleEditChange('education', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500 pr-8"
                    >
                      <option value="10th">10th</option>
                      <option value="Inter">Inter</option>
                      <option value="Degree">Degree</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Master's">Master's</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{application.education}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.specialization}
                      onChange={(e) => handleEditChange('specialization', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.specialization}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.year}
                      onChange={(e) => handleEditChange('year', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.year}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.accountNo}
                      onChange={(e) => handleEditChange('accountNo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.accountNo}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.ifsc}
                      onChange={(e) => handleEditChange('ifsc', e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                      maxLength={11}
                    />
                  ) : (
                    <p className="text-gray-900">{application.ifsc}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.bankName}
                      onChange={(e) => handleEditChange('bankName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.bankName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.branchName}
                      onChange={(e) => handleEditChange('branchName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{application.branchName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LMS Experience</label>
                  {isEditing ? (
                    <select
                      value={editData.lmsExperience}
                      onChange={(e) => handleEditChange('lmsExperience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus-border-blue-500 pr-8"
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{application.lmsExperience}</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({ ...application });
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => handleStatusUpdate('Reviewing')}
                    className="w-full px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Mark as Reviewing
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('Approved')}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Approve Application
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('Rejected')}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Reject Application
                  </button>
                </div>
              </div>
            </div>

            {/* Onboarding Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    onboardingStatus === 'Done' 
                      ? 'text-purple-600 bg-purple-100' 
                      : 'text-orange-600 bg-orange-100'
                  }`}>
                    {onboardingStatus}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">Toggle Status:</span>
                  <button
                    onClick={handleOnboardingToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                      onboardingStatus === 'Done' ? 'bg-purple-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        onboardingStatus === 'Done' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Toggle to mark onboarding as complete or pending
                </p>
              </div>
            </div>

            {/* Comments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  {showComments ? 'Hide' : 'Add Comment'}
                </button>
              </div>
              
              {showComments && (
                <div className="space-y-3">
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Add your comments here..."
                  />
                  <button
                    onClick={async () => {
                      try {
                        if (API_CONFIG.shouldUseAPI()) {
                          const response = await fetch(API_CONFIG.getEndpoint('resumeBuilderAPPLICATION_UPDATE_COMMENT'), {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${localStorage.getItem('lms_admin_token')}`,
                            },
                            body: JSON.stringify({
                              applicationId: application.id,
                              applicationNumber: application.applicationNumber,
                              commentUpdate: {
                                comments: comments,
                                updatedBy: 'admin',
                                updatedAt: new Date().toISOString()
                              },
                              adminId: 'admin',
                              timestamp: new Date().toISOString()
                            }),
                          });

                          if (!response.ok) {
                            throw new Error('Failed to save comment');
                          }
                        }

                        onUpdate(application.id, application.status, comments);
                        setShowComments(false);
                        
                        const successDiv = document.createElement('div');
                        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                        successDiv.textContent = 'Comment saved successfully';
                        document.body.appendChild(successDiv);
                        setTimeout(() => successDiv.remove(), 3000);
                      } catch (error) {
                        console.error('Error saving comment:', error);
                        
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                        errorDiv.textContent = 'Failed to save comment. Please try again.';
                        document.body.appendChild(errorDiv);
                        setTimeout(() => errorDiv.remove(), 3000);
                        
                        onUpdate(application.id, application.status, comments);
                        setShowComments(false);
                      }
                    }}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Save Comment
                  </button>
                </div>
              )}

              {application.comments && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{application.comments}</p>
                </div>
              )}
            </div>

            {/* Application Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Submission Date:</span>
                  <span className="text-gray-900">{application.submissionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Application ID:</span>
                  <span className="text-gray-900">{application.applicationNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Vendor:</span>
                  <span className="text-gray-900 text-xs">{application.vendorName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
