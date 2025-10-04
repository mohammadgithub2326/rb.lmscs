
'use client';

import { useState } from 'react';
import { generatePDF } from '@/lib/pdfGenerator';
import { API_CONFIG, DATE_UTILS } from '@/lib/config';

interface ReviewSubmitStepProps {
  formData: any;
  onPrevious: () => void;
  onSave: (data: any) => void;
}

export default function ReviewSubmitStep({ 
  formData, 
  onPrevious, 
  onSave 
}: ReviewSubmitStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [backendApplicationNumber, setBackendApplicationNumber] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError('');
    
    try {
      const submissionData = {
        ...formData,
        submissionDate: DATE_UTILS.formatToDisplay(DATE_UTILS.getTodayString()),
        status: 'Submitted',
        comments: '',
        onboardingStatus: 'Not Done',
        lastUpdated: new Date().toISOString()
      };

      if (API_CONFIG.shouldUseAPI()) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch(API_CONFIG.getEndpoint('resumeBuilderSUBMIT'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(submissionData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          
          let result;
          try {
            result = await response.json();
          } catch (jsonError) {
            console.warn('Response is not JSON, proceeding with submission data');
            result = { success: true };
          }
          
          // Get application number from backend response
          const applicationNumber = result.data.applicationNumber || result.employeeData?.applicationNumber;
          if (applicationNumber) {
            setBackendApplicationNumber(applicationNumber);
            submissionData.applicationNumber = applicationNumber;
          }
          
          // Generate and download receipt automatically
          try {
            generatePDF(result.data || submissionData, result.template);
          } catch (pdfError) {
            console.error('PDF generation error:', pdfError);
            generatePDF(submissionData);
          }
        } else {
          const errorText = await response.text().catch(() => 'Unknown server error');
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
      } else {
        // Demo mode - generate temporary application number and PDF
        const tempAppNumber = 'DEMO' + Math.floor(Math.random() * 90000000000) + 10000000000;
        setBackendApplicationNumber(tempAppNumber);
        submissionData.applicationNumber = tempAppNumber;
        generatePDF(submissionData);
      }

      // Clear form data from localStorage
      localStorage.removeItem('lms_resume_data');
      
      // Store application status with complete data for tracking
      const finalApplicationNumber = backendApplicationNumber || submissionData.applicationNumber;
      localStorage.setItem(`lms_app_${finalApplicationNumber}`, JSON.stringify({
        applicationNumber: finalApplicationNumber,
        candidateName: formData.fullName,
        status: 'Submitted',
        submissionDate: submissionData.submissionDate,
        lastUpdated: submissionData.lastUpdated,
        comments: '',
        onboardingStatus: 'Not Done'
      }));

      // Also store in a general applications list for admin access
      const existingApps = JSON.parse(localStorage.getItem('lms_all_applications') || '[]');
      const newApp = {
        id: Date.now(),
        ...submissionData,
        applicationNumber: finalApplicationNumber
      };
      existingApps.push(newApp);
      localStorage.setItem('lms_all_applications', JSON.stringify(existingApps));

      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Submission error:', error);
      
      if (error.name === 'AbortError') {
        setSubmissionError('Request timeout. Please check your connection and try again.');
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        setSubmissionError('Network connection error. Please check your internet connection and try again.');
      } else {
        setSubmissionError('Failed to submit application. Please try again or contact support if the problem persists.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const displayApplicationNumber = backendApplicationNumber || formData.applicationNumber;
    
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-check-line text-green-600 text-3xl"></i>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Congratulations!</h2>
        
        <div className="bg-green-50 rounded-lg p-6 border border-green-200 mb-8 max-w-2xl mx-auto">
          <p className="text-green-800 text-lg mb-2">
            You have been successfully registered with LMS Corporate Services PRIVATE LIMITED.
          </p>
          <p className="text-green-700">
            <strong>Application Number:</strong> {displayApplicationNumber}
          </p>
          <p className="text-green-700">
            <strong>Full Name:</strong> {formData.fullName}
          </p>
          <p className="text-green-700">
            <strong>Date:</strong> {DATE_UTILS.formatToDisplay(DATE_UTILS.getTodayString())}
          </p>
          <p className="text-green-700">
            <strong>Status:</strong> Submitted
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 max-w-2xl mx-auto mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Application Receipt Downloaded</h3>
          <div className="text-left space-y-2 text-blue-800">
            <div className="flex items-center space-x-2">
              <i className="ri-download-line text-blue-600"></i>
              <span>Your application receipt has been automatically downloaded</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-file-text-line text-blue-600"></i>
              <span>Please save and print the receipt for your records</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 max-w-2xl mx-auto mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Next Steps - Required Documents</h3>
          <div className="text-left space-y-2 text-blue-800">
            <div className="flex items-center space-x-2">
              <i className="ri-checkbox-line text-blue-600"></i>
              <span>Carry printout of your application receipt</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-checkbox-line text-blue-600"></i>
              <span>Take a screenshot of this confirmation</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-checkbox-line text-blue-600"></i>
              <span>Aadhaar card copy</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-checkbox-line text-blue-600"></i>
              <span>Educational certificates/proof</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-checkbox-line text-blue-600"></i>
              <span>Vaccination certificates/proof</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-checkbox-line text-blue-600"></i>
              <span>Bank passbook/statement copy</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-checkbox-line text-blue-600"></i>
              <span>2 passport size photographs</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Please review your information before submitting</p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><strong>First Name:</strong> {formData.firstName}</div>
            <div><strong>Middle Name:</strong> {formData.middleName || 'N/A'}</div>
            <div><strong>Last Name:</strong> {formData.lastName}</div>
            <div><strong>Full Name:</strong> {formData.fullName}</div>
            <div><strong>Gender:</strong> {formData.gender}</div>
            <div><strong>Date of Birth:</strong> {formData.dob}</div>
            <div><strong>Age:</strong> {formData.age}</div>
            <div><strong>Aadhaar:</strong> {formData.aadhaar}</div>
            <div><strong>PAN:</strong> {formData.pan}</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><strong>Contact:</strong> {formData.contact}</div>
            <div><strong>Email:</strong> {formData.email}</div>
            <div><strong>Father's Name:</strong> {formData.fatherName}</div>
            <div><strong>Mother's Name:</strong> {formData.motherName}</div>
            <div><strong>Emergency Contact:</strong> {formData.emergencyContactName}</div>
            <div><strong>Emergency Number:</strong> {formData.emergencyContactNo}</div>
            <div><strong>Blood Group:</strong> {formData.bloodGroup}</div>
            <div><strong>Marital Status:</strong> {formData.maritalStatus}</div>
            {formData.maritalStatus === 'Married' && (
              <>
                <div><strong>Marriage Date:</strong> {formData.marriageDate}</div>
                <div><strong>Spouse Name:</strong> {formData.spouseName}</div>
              </>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><strong>Village/City:</strong> {formData.village}</div>
            <div><strong>Taluk:</strong> {formData.taluk}</div>
            <div><strong>District:</strong> {formData.district}</div>
            <div><strong>State:</strong> {formData.state}</div>
            <div><strong>Pincode:</strong> {formData.pincode}</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Education & Banking</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div><strong>Education:</strong> {formData.education}</div>
            <div><strong>Specialization:</strong> {formData.specialization}</div>
            <div><strong>Year:</strong> {formData.year}</div>
            <div><strong>Account Number:</strong> {formData.accountNo}</div>
            <div><strong>IFSC:</strong> {formData.ifsc}</div>
            <div><strong>Bank Name:</strong> {formData.bankName}</div>
            <div><strong>Branch Name:</strong> {formData.branchName}</div>
            <div><strong>LMS Experience:</strong> {formData.lmsExperience}</div>
            {formData.lmsExperience === 'Yes' && formData.employeeId && (
              <div><strong>Employee ID:</strong> {formData.employeeId}</div>
            )}
          </div>
        </div>
      </div>

      {submissionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <i className="ri-error-warning-line text-red-600"></i>
            <div>
              <p className="text-red-800 font-medium">Submission Failed</p>
              <p className="text-red-700 text-sm mt-1">{submissionError}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <i className="ri-information-line text-yellow-600 mt-1"></i>
          <div>
            <p className="text-yellow-800 font-medium mb-1">Important Notice</p>
            <p className="text-yellow-700 text-sm">
              Please ensure all information is correct before submitting. 
              Your application receipt will be automatically downloaded after successful submission.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          disabled={isSubmitting}
          className="px-6 py-3 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <i className="ri-loader-line animate-spin mr-2"></i>
              Submitting...
            </span>
          ) : (
            'Submit Application'
          )}
        </button>
      </div>
    </div>
  );
}