// import dotenv from 'dotenv';
// dotenv.config();
// Centralized API configuration management
export const API_CONFIG = {
  // Environment modes
  MODE:"production",

  
  // Demo mode flag - set to false for production/development, true for demo
  DEMO_MODE: false, // Changed to false - only show sample data when explicitly set to demo
  
  // Base URLs for different environments
  BASE_URLS: {
    // development: 'http://localhost:4000/api',
    development: 'https://api.lmscs.in/api',
    demo: '' // No API calls in demo mode
  },
  
  // API endpoints
  ENDPOINTS: {
    resumeBuilderAPPLICATIONS: '/resumebuilder/applications',
    resumeBuilderSUBMIT: '/resumebuilder/applications/submit',
     resumeBuilderADMIN_CHANGES: '/resumebuilder/applications/admin_changes',
     resumeBuilderEXPORT_EXCEL: '/resumebuilder/applications/export',
     resumeBuilderAPPLICATIONS_BY_DATE: '/resumebuilder/applications/filter',
     resumeBuilderAPPLICATION_STATUS: '/resumebuilder/application/status',
     resumeBuilderAPPLICATION_UPDATE: '/resumebuilder/application/update/application',
     resumeBuilderAPPLICATION_UPDATE_STATUS: '/resumebuilder/application/update/status',
     resumeBuilderAPPLICATION_UPDATE_COMMENT: '/resumebuilder/application/update/comment',
     resumeBuilderAPPLICATION_UPDATE_ONBOARDING_STATUS: '/resumebuilder/application/update/onBoarding_Status',
      },
  
  // Get current base URL
  getBaseUrl(): string {
    if (this.DEMO_MODE) return '';
    return this.BASE_URLS[this.MODE as keyof typeof this.BASE_URLS];
  },
  
  // Get full endpoint URL
  getEndpoint(endpoint: keyof typeof this.ENDPOINTS): string {
    if (this.DEMO_MODE) return '';
    console.log("NODE_ENV:", process.env.NODE_ENV);
    return this.getBaseUrl() + this.ENDPOINTS[endpoint];
  },
  
  // Check if should use API or local data
  shouldUseAPI(): boolean {
    return !this.DEMO_MODE;
  },
  
  // Check if should show sample data
  shouldShowSampleData(): boolean {
    return this.DEMO_MODE;
  },
  
  // Set demo mode programmatically
  setDemoMode(isDemo: boolean): void {
    (this as any).DEMO_MODE = isDemo;
  }
};

// Date formatting utilities
export const DATE_UTILS = {
  // Convert date from YYYY-MM-DD to DD/MM/YYYY
  formatToDisplay(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  },
  
  // Convert date from DD/MM/YYYY to YYYY-MM-DD
 formatToInput(dateString: string): string {
  if (!dateString) return '';
  
  // Optional: Validate the format is DD/MM/YYYY
  const parts = dateString.split('/');
  if (parts.length === 3) {
    // Just return the original string unchanged
    return dateString;
  }
  
  // If not in expected format, return original or handle error
  return dateString;
},
  
  // Calculate detailed age (years, months, days)
  calculateDetailedAge(birthDate: string): string {
    if (!birthDate) return '';
    
    const birth = new Date(birthDate);
    const today = new Date();
    
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    
    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    return `${years} years, ${months} months, ${days} days`;
  },
  
  // Get today's date in YYYY-MM-DD format
  getTodayString(): string {
    const today = new Date();
        console.log("Today's date:", today.toISOString().split('T')[0]);    
    return today.toISOString().split('T')[0];
  },
  
  // Format date for API (YYYY-MM-DD)
  formatForAPI(date: Date): string {
    return date.toISOString().split('T')[0];
  }
};

// Excel export utilities
export const EXCEL_UTILS = {
  // Convert JSON data to CSV format
  jsonToCSV(data: any[]): string {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header] || '';
          // Escape commas and quotes in CSV
          return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
            ? `"${value.replace(/"/g, '""')}"` 
            : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  },
  
  // Download data as Excel file
  downloadAsExcel(data: any[], filename: string): void {
    const csvContent = this.jsonToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

// Location API utilities with multiple fallbacks
export const LOCATION_UTILS = {
  // Multiple API endpoints for pincode lookup
  PINCODE_APIS: [
    'https://api.postalpincode.in/pincode/',
    'https://api.zippopotam.us/in/',
  ],
  
  // Local bank code mapping for common banks
  BANK_CODES: {
    'SBIN': 'State Bank of India',
    'HDFC': 'HDFC Bank',
    'ICIC': 'ICICI Bank',
    'AXIS': 'Axis Bank',
    'PUNB': 'Punjab National Bank',
    'CANR': 'Canara Bank',
    'UBIN': 'Union Bank of India',
    'BARB': 'Bank of Baroda',
    'IOBA': 'Indian Overseas Bank',
    'CBIN': 'Central Bank of India'
  },
  
  // Fetch location data with multiple API fallbacks
  async fetchLocationData(pincode: string): Promise<any> {
    if (pincode.length !== 6) return null;
    
    // Try first API
    try {
      const response = await fetch(`${this.PINCODE_APIS[0]}${pincode}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(8000)
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];
          return {
            district: postOffice.District || '',
            state: postOffice.State || '',
            taluk: postOffice.Block || postOffice.Division || ''
          };
        }
      }
    } catch (error) {
      console.log('First API failed, trying fallback...');
    }
    
    // Try second API
    try {
      const response = await fetch(`${this.PINCODE_APIS[1]}${pincode}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(8000)
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.places && data.places.length > 0) {
          const place = data.places[0];
          return {
            district: place['place name'] || '',
            state: place.state || '',
            taluk: place['place name'] || ''
          };
        }
      }
    } catch (error) {
      console.log('Second API also failed');
    }
    
    return null;
  },
  
  // Fetch bank details from IFSC code using Razorpay API
  async getBankNameFromIFSC(ifsc: string) {
    if (!ifsc || ifsc.length < 4) return null;
    
    const response = await fetch(`https://ifsc.razorpay.com/${ifsc}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(8000)
    });
    
    if (response.ok) {
      const data = await response.json();      
          // console.log(data.BANK, data.BRANCH)

      if (data) {
        return {
          bankName: data.BANK || '',
          branchName: data.BRANCH || '',
        };
      }
    }
    
    return null;
  }
};
