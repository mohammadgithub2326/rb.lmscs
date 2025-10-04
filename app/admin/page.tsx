
'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { API_CONFIG } from '@/lib/config';

// Lazy load AdminDashboard for better performance
const AdminDashboard = dynamic(() => import('@/components/AdminDashboard'), {
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
    </div>
  ),
  ssr: false
});

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [environmentMode, setEnvironmentMode] = useState('production');

  // Check if already authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const adminToken = localStorage.getItem('lms_admin_token');
        if (adminToken === 'authenticated') {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    // Use requestAnimationFrame for smooth loading
    requestAnimationFrame(checkAuth);
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  }, [error]);

  const handleEnvironmentChange = useCallback((mode: string) => {
    setEnvironmentMode(mode);
    // Update API_CONFIG based on selected mode
    API_CONFIG.setDemoMode(mode === 'demo');
  }, []);

  const handleLogin = useCallback(async () => {
    if (!credentials.username || !credentials.password) return;

    setLoading(true);
    setError('');

    try {
      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch('https://lmscs.in/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 200) {
        setIsLoggedIn(true);
        localStorage.setItem('lms_admin_token', 'authenticated');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      // Fallback credentials on API error
      if (credentials.username === 'admin' && credentials.password === 'adminaccess') {
        setIsLoggedIn(true);
        localStorage.setItem('lms_admin_token', 'authenticated');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [credentials]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && credentials.username && credentials.password) {
      handleLogin();
    }
  }, [handleLogin, loading, credentials]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-blue-200 rounded-lg mx-auto mb-4"></div>
          <div className="h-4 bg-blue-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (isLoggedIn) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-admin-line text-blue-600 text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">LMS Corporate Services</p>
        </div>

        <div className="space-y-4">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Environment Mode
            </label>
            <select
              value={environmentMode}
              onChange={(e) => handleEnvironmentChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
            >
              <option value="production">Production</option>
              <option value="development">Development</option>
              <option value="demo">Demo (with sample data)</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {environmentMode === 'demo' 
                ? 'Sample data will be displayed for demonstration' 
                : 'Only real application data will be shown'}
            </p>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !credentials.username || !credentials.password}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors duration-200 whitespace-nowrap"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="ri-loader-line animate-spin mr-2"></i>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>

          <div className="text-center pt-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm transition-colors duration-200" prefetch={true}>
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          {/* <div className="text-xs text-gray-500 text-center">
            <p className="mb-1">Demo Credentials:</p>
            <p>Username: admin</p>
            <p>Password: adminaccess</p>
          </div> */}
        </div>
      </div>
    </div>
  );
}