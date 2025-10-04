
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import PrivacyLanding from '@/components/PrivacyLanding';
import ApplicationTracker from '@/components/ApplicationTracker';

export default function Home() {
  const [showPrivacy, setShowPrivacy] = useState(true);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Optimize initial load by batching localStorage reads
    const checkUserStatus = () => {
      try {
        const userToken = localStorage.getItem('lms_user_token');
        if (userToken) {
          setIsReturningUser(true);
          setShowPrivacy(false);
        }
      } catch (error) {
        console.error('Error checking user status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Use requestAnimationFrame for smooth transitions
    requestAnimationFrame(checkUserStatus);
  }, []);

  const handlePrivacyAccept = useCallback(() => {
    setShowPrivacy(false);
  }, []);

  const handleTrackApplication = useCallback(() => {
    setIsReturningUser(true);
  }, []);

  // Show loading state briefly to prevent flash
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-blue-200 rounded-lg mx-auto mb-4"></div>
          <div className="h-4 bg-blue-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (showPrivacy && !isReturningUser) {
    return <PrivacyLanding onAccept={handlePrivacyAccept} />;
  }

  if (isReturningUser) {
    return <ApplicationTracker />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="ri-building-line text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">LMS Corporate Services Pvt. Ltd.</span>
            </div>
            <Link 
              href="/admin" 
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-colors duration-200"
              prefetch={true}
            >
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Resume Builder & Application Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join LMS Corporate Services Pvt. Ltd. - Build your professional profile with our advanced resume builder
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-add-line text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">New Application</h3>
              <p className="text-gray-600 mb-4">Create your professional resume and submit your application</p>
              <Link 
                href="/resume-builder" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap"
                prefetch={true}
              >
                Start Application
                <i className="ri-arrow-right-line ml-2"></i>
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 transform hover:scale-105 transition-transform duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-search-line text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Application</h3>
              <p className="text-gray-600 mb-4">Check the status of your submitted application</p>
              <button 
                onClick={handleTrackApplication}
                className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 whitespace-nowrap"
              >
                Track Status
                <i className="ri-external-link-line ml-2"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose LMS Corporate Services Pvt. Ltd.?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-shield-check-line text-blue-600 text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Secure & Reliable</h4>
              <p className="text-gray-600 text-sm">Your data is protected with enterprise-grade security</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-speed-line text-green-600 text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fast Processing</h4>
              <p className="text-gray-600 text-sm">Quick application review and response times</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <i className="ri-customer-service-line text-purple-600 text-xl"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-gray-600 text-sm">Round-the-clock assistance for your applications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
