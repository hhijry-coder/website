// Add simple client-side form behavior
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      
      // Basic "sending" animation state
      btn.textContent = "Sending...";
      btn.disabled = true;
      btn.style.opacity = "0.7";
      
      setTimeout(() => {
        // Find if page is arabic
        const isArabic = document.documentElement.dir === 'rtl';
        btn.textContent = isArabic ? "تم الإرسال بنجاح!" : "Sent Successfully!";
        btn.style.backgroundColor = "#13B497"; // Success color
        
        contactForm.reset();
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.opacity = "1";
          btn.style.backgroundColor = ""; // Reset
        }, 3000);
      }, 1000);
    });
  }
});
