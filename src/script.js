// Contact form submission via Cloudflare Worker
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      const isArabic = document.documentElement.dir === 'rtl';

      // Show sending state
      btn.textContent = isArabic ? "جاري الإرسال..." : "Sending...";
      btn.disabled = true;
      btn.style.opacity = "0.7";

      try {
        const formData = new FormData(contactForm);

        const response = await fetch("https://khibra-contact-form.hhegri.workers.dev", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          btn.textContent = isArabic ? "تم الإرسال بنجاح!" : "Sent Successfully!";
          btn.style.backgroundColor = "#13B497";
          contactForm.reset();
        } else {
          console.error("Worker error:", result.message);
          btn.textContent = isArabic ? "فشل الإرسال، حاول مرة أخرى" : "Failed, please try again";
          btn.style.backgroundColor = "#e74c3c";
        }
      } catch (error) {
        console.error("Network error:", error);
        btn.textContent = isArabic ? "خطأ في الشبكة، حاول مرة أخرى" : "Network error, please try again";
        btn.style.backgroundColor = "#e74c3c";
      }

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.backgroundColor = "";
      }, 4000);
    });
  }
});
