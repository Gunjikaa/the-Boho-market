// ============================================
// NEWSLETTER POPUP
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const popup = document.getElementById('newsletter-popup');
  const closeBtn = document.getElementById('closePopup');
  
  // Check if user has already seen popup (optional — uses localStorage)
  const hasSeenPopup = localStorage.getItem('bohoPopupSeen');
  
  if (!hasSeenPopup) {
    // Show popup after 3 seconds
    setTimeout(function() {
      popup.classList.add('active');
    }, 3000);
  }
  
  // Close popup function
  function closePopup() {
    popup.classList.remove('active');
    // Store that user has seen popup (for 7 days)
    localStorage.setItem('bohoPopupSeen', 'true');
    
    // Optional: Set expiry (7 days)
    setTimeout(function() {
      localStorage.removeItem('bohoPopupSeen');
    }, 7 * 24 * 60 * 60 * 1000);
  }
  
  // Close when clicking X
  if (closeBtn) {
    closeBtn.addEventListener('click', closePopup);
  }
  
  // Close when clicking outside the popup
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      closePopup();
    }
  });
  
  // Handle form submission
  const popupForm = document.getElementById('popup-form');
  if (popupForm) {
    popupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const name = this.querySelector('input[type="text"]').value;
      const email = this.querySelector('input[type="email"]').value;
      
      // Here you would send to your email service (Mailchimp, ConvertKit, etc.)
      console.log('Newsletter signup:', { name, email });
      
      // Show success message
      alert('Welcome to the Boho Circle! Check your email for 15% off.');
      closePopup();
    });
  }
});