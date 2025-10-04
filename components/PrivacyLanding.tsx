
'use client';

import { useState } from 'react';

interface PrivacyLandingProps {
  onAccept: () => void;
}

export default function PrivacyLanding({ onAccept }: PrivacyLandingProps) {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    if (accepted) {
      localStorage.setItem('lms_privacy_accepted', 'true');
      onAccept();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-shield-check-line text-blue-600 text-3xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy & Data Protection</h1>
          <p className="text-gray-600">LMS Corporate Services Private Limited</p>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Collection & Usage</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <i className="ri-check-line text-green-500 mt-1"></i>
                <span>We collect personal information only for employment processing purposes</span>
              </li>
              <li className="flex items-start space-x-2">
                <i className="ri-check-line text-green-500 mt-1"></i>
                <span>Your data is stored securely and protected against unauthorized access</span>
              </li>
              <li className="flex items-start space-x-2">
                <i className="ri-check-line text-green-500 mt-1"></i>
                <span>Information is shared only with authorized personnel for application review</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Rights</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start space-x-2">
                <i className="ri-user-line text-blue-500 mt-1"></i>
                <span>Right to access and review your submitted information</span>
              </li>
              <li className="flex items-start space-x-2">
                <i className="ri-edit-line text-blue-500 mt-1"></i>
                <span>Right to request corrections to your personal data</span>
              </li>
              <li className="flex items-start space-x-2">
                <i className="ri-delete-bin-line text-blue-500 mt-1"></i>
                <span>Right to request deletion of your data (subject to legal requirements)</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Notice</h3>
            <p className="text-blue-800">
              By proceeding, you acknowledge that you have read and understood our privacy policy. 
              Your personal information will be processed in accordance with applicable data protection laws.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">
              I have read and agree to the privacy policy and terms of service
            </span>
          </label>

          <div className="flex space-x-4">
            <button
              onClick={handleAccept}
              disabled={!accepted}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors whitespace-nowrap ${
                accepted
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Accept & Continue
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
