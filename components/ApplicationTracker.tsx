'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ApplicationTracker() {
  const [applicationNumber, setApplicationNumber] = useState('');
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const trackApplication = async () => {
    if (!applicationNumber.trim()) {
      setError('Please enter your application number');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // First check localStorage for application status
      const localAppData = localStorage.getItem(`lms_app_${applicationNumber}`);
      if (localAppData) {
        const appData = JSON.parse(localAppData);
        setStatus({
          applicationNumber: appData.applicationNumber,
          candidateName: appData.candidateName,
          status: appData.status,
          submissionDate: appData.submissionDate,
          lastUpdated: appData.lastUpdated,
          comments: appData.comments || ''
        });
        setLoading(false);
        return;
      }

      // If not found locally, try API
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      // const response = await fetch(`http://localhost:4000/api/resumebuilder/application/status`, {
            const response = await fetch(`https://api.lmscs.in/api/resumebuilder/application/status`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ applicationNumber }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        
        // Store the fetched data locally for future reference
        localStorage.setItem(`lms_app_${applicationNumber}`, JSON.stringify({
          applicationNumber: data.applicationNumber,
          candidateName: data.candidateName,
          status: data.status,
          submissionDate: data.submissionDate,
          lastUpdated: data.lastUpdated || new Date().toISOString(),
          comments: data.comments || ''
        }));
      } else if (response.status === 404) {
        setError('Application not found. Please check your application number.');
      } else {
        const errorText = await response.text().catch(() => 'Unknown server error');
        setError(`Server error: ${response.status} - ${errorText}`);
      }
    } catch (err: any) {
      console.error('Application tracking error:', err);
      
      if (err.name === 'AbortError') {
        setError('Request timeout. Please check your connection and try again.');
      } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        setError('Network connection error. Please check your internet connection and try again.');
      } else {
        setError('Unable to connect to server. Please try again later or contact support.');
      }
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="ri-building-line text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">LMS Corporate Services</span>
            </Link>
            <Link href="/admin" className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Tracker</h1>
          <p className="text-gray-600">Enter your application number to check status</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-8">
          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Number
              </label>
              <input
                type="text"
                value={applicationNumber}
                onChange={(e) => setApplicationNumber(e.target.value)}
                placeholder="Enter your application number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="flex items-start space-x-2">
                  <i className="ri-error-warning-line text-red-600 mt-0.5"></i>
                  <div>
                    <p className="font-medium">Tracking Error</p>
                    <p className="mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={trackApplication}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <i className="ri-loader-line animate-spin mr-2"></i>
                  Tracking...
                </span>
              ) : (
                'Track Application'
              )}
            </button>
          </div>
        </div>

        {status && (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Number</label>
                <p className="text-gray-900 font-semibold">{status.applicationNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Submission Date</label>
                <p className="text-gray-900">{status.submissionDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name</label>
                <p className="text-gray-900">{status.candidateName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status.status)}`}>
                  {status.status}
                </span>
              </div>
            </div>

            {status.comments && (
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                <p className="text-gray-700">{status.comments}</p>
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          <Link 
            href="/resume-builder"
            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
          >
            <i className="ri-add-line mr-2"></i>
            Submit New Application
          </Link>
        </div>
      </div>
    </div>
  );
}
