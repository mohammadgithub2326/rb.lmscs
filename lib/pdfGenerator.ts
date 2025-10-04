
export const generatePDF = (data: any, template?: any) => {
  try {
    // Create PDF content as HTML
    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>LMS Corporate Services - Application Receipt</title>
    <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 0; 
          padding: 20px; 
          background: white;
        }
        .header { 
          display: flex; 
          align-items: center; 
          justify-content: flex-start; 
          border-bottom: 2px solid #333; 
          padding-bottom: 15px; 
          margin-bottom: 20px; 
        }
        .logo { 
          width: 60px; 
          height: 60px; 
          background: #1e40af; 
          border-radius: 8px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          color: white; 
          font-weight: bold; 
          font-size: 24px; 
          margin-right: 15px;
          font-family: 'Pacifico', serif;
        }
        .company-info h1 { 
          margin: 0; 
          font-size: 24px; 
          color: #1e40af; 
          font-weight: bold; 
        }
        .company-info h2 { 
          margin: 5px 0 0 0; 
          font-size: 18px; 
          color: #374151; 
          font-weight: normal; 
        }
        .receipt-header {
          text-align: center;
          margin: 15px 0;
          padding: 10px;
          background: #f8fafc;
          border-radius: 8px;
        }
        .receipt-header h3 {
          margin: 0 0 10px 0;
          font-size: 20px;
          color: #1e40af;
          font-weight: bold;
        }
        .receipt-info { 
          background: #f8f9fa; 
          padding: 15px; 
          border-radius: 8px; 
          margin-bottom: 20px; 
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .section { 
          margin-bottom: 20px; 
        }
        .section h3 { 
          background: #f5f5f5; 
          padding: 8px; 
          margin: 0 0 10px 0; 
          border-left: 4px solid #1e40af;
        }
        .field { 
          display: inline-block; 
          width: 48%; 
          margin-bottom: 8px; 
        }
        .field strong { 
          display: inline-block; 
          width: 140px; 
        }
        .full-width { 
          width: 100%; 
        }
        .signature { 
          margin-top: 40px; 
          display: flex; 
          justify-content: space-between; 
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          padding-top: 20px; 
          border-top: 1px solid #ccc; 
        }
        @media print {
          body { margin: 0; }
          .header { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
          <img src="/LMS-LOGO.png" alt="LMS Corporate Services" style="width: 100%; height: 100%; object-fit: contain;">
        </div>
        <div class="company-info">
            <h1>LMS Corporate Services Private Limited</h1>
            <h2>Employee Application Management System</h2>
        </div>
    </div>

    <div class="receipt-header">
        <h3>LMS Resume Builder</h3>
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div><strong>Application Number:</strong> ${data.applicationNumber}</div>
            <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
        </div>
    </div>

    <div class="receipt-info">
        <div><strong>Submission Date:</strong> ${new Date().toLocaleDateString('en-GB')}</div>
        <div><strong>Status:</strong> Submitted</div>
        <div><strong>Processing Time:</strong> ${new Date().toLocaleTimeString('en-GB')}</div>
        <div><strong>Candidate Name:</strong> ${data.fullName || ''}</div>
    </div>

    <div class="section">
        <h3>Personal Information</h3>
        <div class="field"><strong>Full Name:</strong> ${data.fullName || ''}</div>
        <div class="field"><strong>Gender:</strong> ${data.gender || ''}</div>
        <div class="field"><strong>Date of Birth:</strong> ${data.dob || ''}</div>
        <div class="field"><strong>Age:</strong> ${data.age || ''}</div>
        <div class="field"><strong>Aadhaar Number:</strong> ${data.aadhaar || ''}</div>
        <div class="field"><strong>PAN Number:</strong> ${data.pan || ''}</div>
    </div>

    <div class="section">
        <h3>Contact Information</h3>
        <div class="field"><strong>Contact Number:</strong> ${data.contact || ''}</div>
        <div class="field"><strong>Email:</strong> ${data.email || ''}</div>
        <div class="field"><strong>Father's Name:</strong> ${data.fatherName || ''}</div>
        <div class="field"><strong>Mother's Name:</strong> ${data.motherName || ''}</div>
        <div class="field"><strong>Emergency Contact:</strong> ${data.emergencyContactName || ''}</div>
        <div class="field"><strong>Emergency Number:</strong> ${data.emergencyContactNo || ''}</div>
        <div class="field"><strong>Blood Group:</strong> ${data.bloodGroup || ''}</div>
        <div class="field"><strong>Marital Status:</strong> ${data.maritalStatus || ''}</div>
        ${data.maritalStatus === 'Married' ? `
        <div class="field"><strong>Marriage Date:</strong> ${data.marriageDate || ''}</div>
        <div class="field"><strong>Spouse Name:</strong> ${data.spouseName || ''}</div>
        ` : ''}
    </div>

    <div class="section">
        <h3>Address Information</h3>
        <div class="field"><strong>Village/City:</strong> ${data.village || ''}</div>
        <div class="field"><strong>Taluk:</strong> ${data.taluk || ''}</div>
        <div class="field"><strong>District:</strong> ${data.district || ''}</div>
        <div class="field"><strong>State:</strong> ${data.state || ''}</div>
        <div class="field"><strong>Pincode:</strong> ${data.pincode || ''}</div>
    </div>

    <div class="section">
        <h3>Education & Banking Details</h3>
        <div class="field"><strong>Education:</strong> ${data.education || ''}</div>
        <div class="field"><strong>Specialization:</strong> ${data.specialization || ''}</div>
        <div class="field"><strong>Year:</strong> ${data.year || ''}</div>
        <div class="field"><strong>Account Number:</strong> ${data.accountNo || ''}</div>
        <div class="field"><strong>IFSC Code:</strong> ${data.ifsc || ''}</div>
        <div class="field"><strong>Bank Name:</strong> ${data.bankName || ''}</div>
        <div class="field"><strong>Branch Name:</strong> ${data.branchName || ''}</div>
        <div class="field"><strong>LMS Experience:</strong> ${data.lmsExperience || ''}</div>
    </div>

    <div class="footer">
        <p><strong>Important:</strong> Please keep this receipt for your records and bring it during document verification.</p>
        <p>For any queries, contact LMS Corporate Services Private Limited</p>
    </div>

    
</body>
</html>`;

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      
      // Wait for content to load then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
          
          // Close the window after printing
          setTimeout(() => {
            printWindow.close();
          }, 1000);
        }, 500);
      };
    } else {
      // Fallback: create downloadable HTML file
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LMS_Application_Receipt_${data.applicationNumber}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('Receipt file downloaded. Please open it in your browser and print as PDF.');
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    alert('Receipt generation failed. Please take a screenshot of your application details.');
  }
};

// <div class="signature">
    //     <div>
    //         <p>Applicant Signature: ________________</p>
    //         <p>Date: ________________</p>
    //     </div>
    //     <div>
    //         <p>Authorized Signature: ________________</p>
    //         <p>Date: ________________</p>
    //     </div>
    // </div>
    //         <p><em>This is a computer-generated receipt and does not require a signature.</em></p>
