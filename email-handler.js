/*
========================================
EMAIL HANDLER FOR DU PLESSIS INNOVATIONS
========================================

This file handles all email-related functionality:
- EmailJS initialization
- Email validation
- Quote request processing
- Email sending with fallback

========================================
*/

// Initialize EmailJS
(function() {
  emailjs.init("Z1CX2Vm3kLaiirPE1"); // Your EmailJS public key
})();

// Email validation function
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Real-time email validation setup
function setupEmailValidation() {
  const emailInput = document.getElementById('quoteEmail');
  const emailError = document.getElementById('emailError');
  
  if (emailInput) {
    emailInput.addEventListener('input', function() {
      const email = this.value.trim();
      if (email && !validateEmail(email)) {
        emailError.textContent = 'Please enter a valid email address.';
        emailError.classList.remove('hidden');
        this.classList.add('error');
      } else {
        emailError.classList.add('hidden');
        this.classList.remove('error');
      }
    });
    
    emailInput.addEventListener('blur', function() {
      const email = this.value.trim();
      if (email && !validateEmail(email)) {
        emailError.textContent = 'Please enter a valid email address.';
        emailError.classList.remove('hidden');
        this.classList.add('error');
      }
    });
  }
}

// Request quote function
async function requestQuote() {
  const emailInput = document.getElementById('quoteEmail');
  const emailError = document.getElementById('emailError');
  const requestBtn = document.getElementById('requestQuoteBtn');
  const requestBtnText = document.getElementById('requestBtnText');
  const requestBtnSpinner = document.getElementById('requestBtnSpinner');
  
  const email = emailInput.value.trim();
  
  // Validate email
  if (!email) {
    emailError.textContent = 'Please enter your email address.';
    emailError.classList.remove('hidden');
    emailInput.classList.add('error');
    emailInput.focus();
    return;
  }
  
  if (!validateEmail(email)) {
    emailError.textContent = 'Please enter a valid email address.';
    emailError.classList.remove('hidden');
    emailInput.classList.add('error');
    emailInput.focus();
    return;
  }
  
  // Hide error message and remove error styling
  emailError.classList.add('hidden');
  emailInput.classList.remove('error');
  
  // Show loading state
  requestBtnText.textContent = 'Sending...';
  requestBtnSpinner.classList.remove('hidden');
  requestBtn.disabled = true;
  
  try {
    // Get all the quote details
    const description = document.getElementById('description').value;
    const modelLink = document.getElementById('modelLink').value;
    const material = document.getElementById('material').value;
    const quantity = document.getElementById('quantity').value;
    
         // Get the analysis results (only the actual analysis, not the UI elements)
     const analysisContent = document.getElementById('analysisContent');
     
     // Extract only the analysis data, excluding the disclaimer and quote request form
     let analysisText = '';
     
     // Find the first div with class "space-y-4" which contains only the analysis results
     const analysisDiv = analysisContent.querySelector('div.space-y-4');
     if (analysisDiv) {
       // Clean up the text by removing extra whitespace and formatting
       analysisText = analysisDiv.textContent
         .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
         .replace(/\n/g, ' ')   // Replace newlines with spaces
         .trim();
     }
    
    // Prepare email template parameters
    const templateParams = {
      to_email: 'jmridesbikes@gmail.com',
      from_email: email,
      customer_email: email,
      project_description: description,
      model_link: modelLink,
      material: material,
      quantity: quantity,
      analysis_results: analysisText,
             total_estimate: document.querySelector('.text-xl.font-semibold.text-blue-600 span:last-child')?.textContent?.trim() || 'N/A'
    };
    
    // Send email using EmailJS
    // Replace these IDs with your actual EmailJS service and template IDs
    try {
      const response = await emailjs.send(
        'service_1889w4y', // Your EmailJS service ID
        'template_345sljq', // Your EmailJS template ID
        templateParams
      );
      
      console.log('Email sent successfully:', response);
      
                   // Show success message
             const successMessage = document.getElementById('successMessage');
             successMessage.classList.remove('hidden');
             requestBtn.classList.add('hidden');
             
             // Clear the email input immediately
             emailInput.value = '';
             
             // Keep success message visible for longer and don't auto-reset
             // User can manually refresh the page or submit a new quote if needed
      
    } catch (emailError) {
      console.error('EmailJS failed, falling back to mailto:', emailError);
      
      // Fallback to mailto link if EmailJS fails
      const mailtoLink = `mailto:jmridesbikes@gmail.com?subject=${encodeURIComponent('New 3D Printing Quote Request')}&body=${encodeURIComponent(`
New 3D Printing Quote Request

Customer Email: ${email}

Project Details:
- Description: ${description}
- Model Link: ${modelLink}
- Material: ${material}
- Quantity: ${quantity}

AI Analysis Results:
${analysisText}

This quote request was submitted through the Du Plessis Innovations website.
      `)}`;
      
      // Open default email client as fallback
      window.open(mailtoLink);
      
                   // Show success message for fallback
             const successMessage = document.getElementById('successMessage');
             successMessage.classList.remove('hidden');
             requestBtn.classList.add('hidden');
             
             // Update success message for fallback
             successMessage.innerHTML = `
               <i class="fas fa-info-circle text-blue-600 text-3xl mb-3"></i>
               <h5 class="text-lg font-semibold text-blue-800 mb-2">Email Client Opened</h5>
               <p class="text-blue-700 mb-4">Your email client has been opened with a pre-filled message. Please review and send the email manually.</p>
               <div class="space-y-3">
                 <p class="text-blue-600 text-sm">📧 Check your email client</p>
                 <p class="text-blue-600 text-sm">✉️ Send the email manually</p>
               </div>
               <div class="mt-4 pt-4 border-t border-blue-200">
                 <button 
                   onclick="location.reload()" 
                   class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                 >
                   Submit Another Quote
                 </button>
               </div>
             `;
             
             // Clear the email input immediately
             emailInput.value = '';
             
             // Keep success message visible - user can refresh page for new quote
    }
    
  } catch (error) {
    console.error('Error sending quote request:', error);
    requestBtnText.textContent = 'Error - Try Again';
    requestBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
    requestBtn.classList.add('bg-red-600');
    
    // Reset button after error
    setTimeout(() => {
      requestBtnText.textContent = 'Request Quote';
      requestBtn.classList.remove('bg-red-600');
      requestBtn.classList.add('bg-green-600', 'hover:bg-green-700');
      requestBtn.disabled = false;
      requestBtnSpinner.classList.add('hidden');
    }, 3000);
  }
}

// Export functions for use in other files (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateEmail,
    setupEmailValidation,
    requestQuote
  };
}
