/*
========================================
EMAIL HANDLER FOR DUPLESSIS INNOVATIONS
========================================

This file handles all email-related functionality:
- EmailJS initialization
- Email validation
- Contact message processing
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

// Export functions for use in other files (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateEmail
  };
}
