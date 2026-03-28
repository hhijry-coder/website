// Contact form submission via Web3Forms API
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

        // Include Web3Forms access key
        formData.append("access_key", "00d3c277-cdf5-4acb-921d-91a79018221f");

        // Set a clear subject line
        const name = formData.get("name") || "Visitor";
        const org  = formData.get("organization") || "";
        formData.append(
          "subject",
          org
            ? `New Consultation Request from ${name} (${org})`
            : `New Consultation Request from ${name}`
        );

        // Optional: redirect-less response
        formData.append("botcheck", "");

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          btn.textContent = isArabic ? "تم الإرسال بنجاح!" : "Sent Successfully!";
          btn.style.backgroundColor = "#13B497";
          contactForm.reset();
        } else {
          console.error("Web3Forms error:", result);
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
