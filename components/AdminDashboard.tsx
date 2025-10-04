
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ApplicationDetails from './ApplicationDetails';
import { API_CONFIG, DATE_UTILS, EXCEL_UTILS } from '@/lib/config';


export default function AdminDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<any[]>([]);
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    submitted: 0,
    reviewing: 0,
    approved: 0,
    rejected: 0,
    onboardDone: 0,
    onboardPending: 0
  });

  // Date filter states
  const [dateFilter, setDateFilter] = useState('All');
  const [customDateRange, setCustomDateRange] = useState({
    fromDate: '',
    toDate: ''
  });
  const [showCustomRange, setShowCustomRange] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    applyDateFilter();
  }, [applications, dateFilter, customDateRange]);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    
    if (!API_CONFIG.shouldUseAPI()) {
      // Demo mode - use local data
      const localApps = JSON.parse(localStorage.getItem('lms_all_applications') || '[]');
      const mockApps = API_CONFIG.shouldShowSampleData() && localApps.length === 0 ? getMockApplications() : [];
      const allApps = [...localApps, ...mockApps];
      setApplications(allApps);
      setLoading(false);
      return;
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      console.log("NODE_ENV:", process.env.NODE_ENV);
      const response = await fetch(API_CONFIG.getEndpoint('resumeBuilderAPPLICATIONS'), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lms_admin_token')}`,
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const apiData = await response.json();
        let fetchedApplications = [];
        
        if (Array.isArray(apiData)) {
          fetchedApplications = apiData;
        } else if (apiData.applications && Array.isArray(apiData.applications)) {
          fetchedApplications = apiData.applications;
        } else if (apiData.data && Array.isArray(apiData.data)) {
          fetchedApplications = apiData.data;
        }

        const localApps = JSON.parse(localStorage.getItem('lms_all_applications') || '[]');
        const allApplications = [...fetchedApplications, ...localApps.filter((localApp: any) => 
          !fetchedApplications.some((apiApp: any) => 
            apiApp.applicationNumber === localApp.applicationNumber || apiApp.id === localApp.id
          )
        )];

        setApplications(allApplications);
        
      } else if (response.status === 401) {
        setError('Unauthorized access. Please login again.');
        localStorage.removeItem('lms_admin_token');
      } else if (response.status === 404) {
        setError('Applications endpoint not found. Using local data.');
        const localApps = JSON.parse(localStorage.getItem('lms_all_applications') || '[]');
        setApplications(localApps);
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      
      if (error.name === 'AbortError') {
        setError('Request timeout. Loading local data.');
      } else {
        setError('Failed to fetch applications from server. Loading local data.');
      }
      
      const localApps = JSON.parse(localStorage.getItem('lms_all_applications') || '[]');
      const mockApplications = API_CONFIG.shouldShowSampleData() && localApps.length === 0 ? getMockApplications() : [];
      const allApplications = [...localApps, ...mockApplications];
      setApplications(allApplications);
    } finally {
      setLoading(false);
    }
  };

  const getMockApplications = () => [
    {
      id: 1,
      applicationNumber: '23876957639',
      firstName: 'John',
      middleName: 'Michael',
      lastName: 'Smith',
      fullName: 'John Michael Smith',
      email: 'john.smith@email.com',
      contact: '9876543210',
      status: 'Reviewing',
      submissionDate: '21/09/2023',
      lastUpdated: new Date().toISOString(),
      comments: '',
      onboardingStatus: 'Not Done',
      vendorName: 'LMS Corporate Services PVT LTD',
      gender: 'Male',
      dob: '1995-05-15',
      age: '28 years, 4 months, 15 days',
      aadhaar: '435353453433',
      pan: 'ABCDE1234F',
      fatherName: 'Robert Smith',
      motherName: 'Mary Smith',
      emergencyContactName: 'Jane Smith',
      emergencyContactNo: '9876543211',
      bloodGroup: 'O+',
      maritalStatus: 'Single',
      village: 'Springfield',
      taluk: 'Central District',
      district: 'Metro District',
      state: 'Maharashtra',
      pincode: '400001',
      education: 'Degree',
      specialization: 'Computer Science',
      year: '2018',
      accountNo: '1234567890123456',
      ifsc: 'SBIN0001234',
      bankName: 'State Bank of India',
      branchName: 'Main Branch',
      lmsExperience: 'No',
      employeeId: ''
    },
    {
      id: 2,
      applicationNumber: '23876957640',
      firstName: 'Sarah',
      middleName: '',
      lastName: 'Johnson',
      fullName: 'Sarah Johnson',
      email: 'sarah.john.com@email.com',
      contact: '9876543212',
      status: 'Approved',
      submissionDate: '22/09/2023',
      lastUpdated: new Date().toISOString(),
      comments: 'Documents verified successfully',
      onboardingStatus: 'Done',
      vendorName: 'LMS Corporate Services PVT LTD',
      gender: 'Female',
      dob: '1992-08-20',
      age: '31 years, 2 months, 10 days',
      aadhaar: '435353453434',
      pan: 'FGHIJ5678K',
      fatherName: 'Michael Johnson',
      motherName: 'Linda Johnson',
      emergencyContactName: 'David Johnson',
      emergencyContactNo: '9876543213',
      bloodGroup: 'A+',
      maritalStatus: 'Married',
      marriageDate: '2020-02-15',
      spouseName: 'Mark Wilson',
      village: 'Riverside',
      taluk: 'North District',
      district: 'River District',
      state: 'Karnataka',
      pincode: '560001',
      education: 'Master\'s',
      specialization: 'Business Administration',
      year: '2015',
      accountNo: '2345678901234567',
      ifsc: 'HDFC0001234',
      bankName: 'HDFC Bank',
      branchName: 'Corporate Branch',
      lmsExperience: 'Yes',
      employeeId: 'LMS2019001'
    }
  ];

  const applyDateFilter = () => {
    let filtered = [...applications];
    
    if (dateFilter === 'Today') {
      const today = DATE_UTILS.getTodayString();
      console.log("Today's date:", today);
      filtered = applications.filter(app => {
        const submissionDate = new Date(app.submissionDate).toISOString().split('T')[0];
        console.log("submission date:", submissionDate);
        return submissionDate === today;
      });
    } else if (dateFilter === 'Custom' && customDateRange.fromDate && customDateRange.toDate) {
      const fromDate = new Date(customDateRange.fromDate);
      const toDate = new Date(customDateRange.toDate);
      
      filtered = applications.filter(app => {
        const submissionDate = new Date(app.submissionDate);
        return submissionDate >= fromDate && submissionDate <= toDate;
      });
    }
    
    setFilteredApplications(filtered);
    
    // Calculate stats for filtered data
    const newStats = {
      total: filtered.length,
      submitted: filtered.filter(app => app.status?.toLowerCase() === 'submitted').length,
      reviewing: filtered.filter(app => app.status?.toLowerCase() === 'reviewing').length,
      approved: filtered.filter(app => app.status?.toLowerCase() === 'approved').length,
      rejected: filtered.filter(app => app.status?.toLowerCase() === 'rejected').length,
      onboardDone: filtered.filter(app => app.onboardingStatus === 'Done').length,
      onboardPending: filtered.filter(app => app.onboardingStatus !== 'Done').length
    };
    setStats(newStats);
  };

  const handleDateFilterChange = (filter: string) => {
    setDateFilter(filter);
    if (filter === 'Custom') {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      setCustomDateRange({ fromDate: '', toDate: '' });
    }
  };

  const handleExportExcel = async () => {
    try {
      if (!API_CONFIG.shouldUseAPI()) {
        // Demo mode - export filtered local data
        EXCEL_UTILS.downloadAsExcel(filteredApplications, `LMS_Applications_${new Date().toISOString().split('T')[0]}`);
        return;
      }

      // Production mode - make API call
      const exportData = {
        dateFilter,
        customDateRange: dateFilter === 'Custom' ? customDateRange : null
      };
        console.log("mode:",process.env.NODE_ENV)
      const response = await fetch(API_CONFIG.getEndpoint('resumeBuilderEXPORT_EXCEL'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lms_admin_token')}`,
        },
        body: JSON.stringify(exportData),
      });

      if (response.ok) {
        const data = await response.json();
        EXCEL_UTILS.downloadAsExcel(data.applications || filteredApplications, `LMS_Applications_${new Date().toISOString().split('T')[0]}`);
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      // Fallback to local data export
      EXCEL_UTILS.downloadAsExcel(filteredApplications, `LMS_Applications_${new Date().toISOString().split('T')[0]}`);
    }
  };

  const updateApplicationStatus = (applicationId: number, newStatus: string, comments?: string) => {
    const updatedApps = applications.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: newStatus, 
            comments: comments || app.comments,
            lastUpdated: new Date().toISOString()
          }
        : app
    );
    
    setApplications(updatedApps);

    if (selectedApp && selectedApp.id === applicationId) {
      setSelectedApp((prev:any) => ({ 
        ...prev, 
        status: newStatus, 
        comments: comments || prev.comments,
        lastUpdated: new Date().toISOString()
      }));
    }

    const updatedApp = updatedApps.find(app => app.id === applicationId);
    if (updatedApp) {
      localStorage.setItem(`lms_app_${updatedApp.applicationNumber}`, JSON.stringify({
        applicationNumber: updatedApp.applicationNumber,
        candidateName: updatedApp.fullName,
        status: newStatus,
        submissionDate: updatedApp.submissionDate,
        lastUpdated: updatedApp.lastUpdated,
        comments: comments || updatedApp.comments
      }));

      const localApps = JSON.parse(localStorage.getItem('lms_all_applications') || '[]');
      const updatedLocalApps = localApps.map((app: any) => 
        app.applicationNumber === updatedApp.applicationNumber 
          ? { ...app, status: newStatus, comments: comments || app.comments, lastUpdated: updatedApp.lastUpdated }
          : app
      );
      localStorage.setItem('lms_all_applications', JSON.stringify(updatedLocalApps));
    }
  };

  const updateOnboardingStatus = (applicationId: number, onboardingStatus: string) => {
    const updatedApps = applications.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            onboardingStatus,
            lastUpdated: new Date().toISOString()
          }
        : app
    );
    
    setApplications(updatedApps);

    if (selectedApp && selectedApp.id === applicationId) {
      setSelectedApp((prev:any) => ({ 
        ...prev, 
        onboardingStatus,
        lastUpdated: new Date().toISOString()
      }));
    }

    const updatedApp = updatedApps.find(app => app.id === applicationId);
    if (updatedApp) {
      const localApps = JSON.parse(localStorage.getItem('lms_all_applications') || '[]');
      const updatedLocalApps = localApps.map((app: any) => 
        app.applicationNumber === updatedApp.applicationNumber 
          ? { ...app, onboardingStatus, lastUpdated: updatedApp.lastUpdated }
          : app
      );
      localStorage.setItem('lms_all_applications', JSON.stringify(updatedLocalApps));
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

  const handleLogout = () => {
    localStorage.removeItem('lms_admin_token');
    window.location.reload();
  };

  const handleRefresh = () => {
    fetchApplications();
  };

  if (selectedApp) {
    return (
      <ApplicationDetails 
        application={selectedApp} 
        onBack={() => setSelectedApp(null)}
        onUpdate={updateApplicationStatus}
        onUpdateOnboarding={updateOnboardingStatus}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <i className="ri-admin-line text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold text-gray-900">LMS Admin Panel</span>
              {API_CONFIG.shouldShowSampleData() && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                  DEMO MODE
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
              >
                <i className={`ri-refresh-line ${loading ? 'animate-spin' : ''}`}></i>
                <span>Refresh</span>
              </button>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                <i className="ri-home-line mr-1"></i>
                Home
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Management</h1>
              <p className="text-gray-600">Manage and review job applications</p>
            </div>
            
            {/* Date Filter Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Filter by Date:</label>
                <select
                  value={dateFilter}
                  onChange={(e) => handleDateFilterChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                >
                  <option value="All">All</option>
                  <option value="Today">Today</option>
                  <option value="Custom">Custom Range</option>
                </select>
              </div>
              
              {/* <button
                onClick={handleExportExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center space-x-2"
              >
                <i className="ri-file-excel-line"></i>
                <span>Export Excel</span>
              </button> */}
            </div>
          </div>
          
          {/* Custom Date Range */}
          {showCustomRange && (
            <div className="mt-4 flex items-center space-x-4 bg-blue-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  value={customDateRange.fromDate}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, fromDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  value={customDateRange.toDate}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, toDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-2 text-yellow-600 text-sm bg-yellow-50 p-2 rounded border border-yellow-200">
              <i className="ri-warning-line mr-1"></i>
              {error}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <i className="ri-file-list-line text-gray-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Submitted</p>
                <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-inbox-line text-blue-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reviewing</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.reviewing}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-time-line text-yellow-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-check-line text-green-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="ri-close-line text-red-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Onboard Done</p>
                <p className="text-2xl font-bold text-purple-600">{stats.onboardDone}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-check-line text-purple-600 text-xl"></i>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Onboard Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.onboardPending}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-unfollow-line text-orange-600 text-xl"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Applications {dateFilter !== 'All' && `(${dateFilter})`}
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <i className="ri-loader-line animate-spin text-2xl text-gray-400 mr-3"></i>
              <span className="text-gray-600">Loading applications...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submission Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Onboarding
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((app) => (
                    <tr key={app.applicationNumber} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {app.applicationNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{app.fullName}</div>
                          <div className="text-sm text-gray-500">{app.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.contact}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.submissionDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          app.onboardingStatus === 'Done' 
                            ? 'text-purple-600 bg-purple-100' 
                            : 'text-orange-600 bg-orange-100'
                        }`}>
                          {app.onboardingStatus || 'Not Done'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="text-blue-600 hover:text-blue-900 whitespace-nowrap"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredApplications.length === 0 && !loading && (
                <div className="text-center py-12">
                  <i className="ri-inbox-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">No applications found for the selected filter</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
