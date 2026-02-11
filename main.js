
(function () {
  // Footer year
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Active nav link
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav a").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.setAttribute("aria-current", "page");
  });

  // Mobile nav toggle
  const nav = document.querySelector(".nav");
  const btn = document.querySelector("[data-nav-toggle]");
  if (nav && btn) {
    const close = () => {
      nav.dataset.open = "false";
      btn.setAttribute("aria-expanded", "false");
    };
    const open = () => {
      nav.dataset.open = "true";
      btn.setAttribute("aria-expanded", "true");
    };

    btn.addEventListener("click", () => {
      const isOpen = nav.dataset.open === "true";
      isOpen ? close() : open();
    });

    // Close on link click (mobile)
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", close));

    // Close if clicking outside
    document.addEventListener("click", (e) => {
      if (nav.dataset.open !== "true") return;
      const target = e.target;
      if (!nav.contains(target) && target !== btn) close();
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  // Contact form enhancement (client-side only)
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");
  if (form && status) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("#name")?.value.trim();
      const email = form.querySelector("#email")?.value.trim();
      const date = form.querySelector("#date")?.value;
      const message = form.querySelector("#message")?.value.trim();

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");

      let errors = [];
      if (!name) errors.push("Please enter your name.");
      if (!email || !emailOk) errors.push("Please enter a valid email address.");
      if (!date) errors.push("Please choose a date for your event.");
      if (!message || message.length < 20) errors.push("Please add a few more details (at least 20 characters).");

      if (errors.length) {
        status.className = "notice warn";
        status.textContent = errors[0];
        status.focus?.();
        return;
      }

      status.className = "notice";
      status.textContent = "Thanks — your request is ready! Since this is a static site, please click “Email Us” below to send it, or copy the details.";
      status.focus?.();

      // Build a convenient mailto link
      const bandEmail = "bookings@silverliningband.com";
      const subject = encodeURIComponent(`Booking request: ${name} (${date})`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nEvent date: ${date}\n\nDetails:\n${message}\n\n— Sent from silverliningband.com contact form`
      );

      const mailto = `mailto:${bandEmail}?subject=${subject}&body=${body}`;
      const mailBtn = document.querySelector("[data-mailto]");
      if (mailBtn) mailBtn.setAttribute("href", mailto);

      // Copy details helper
      const copyBtn = document.querySelector("[data-copy]");
      if (copyBtn) {
        copyBtn.disabled = false;
        copyBtn.onclick = async () => {
          try {
            await navigator.clipboard.writeText(
              `Name: ${name}\nEmail: ${email}\nEvent date: ${date}\n\nDetails:\n${message}`
            );
            copyBtn.textContent = "Copied!";
            setTimeout(() => (copyBtn.textContent = "Copy details"), 1400);
          } catch {
            copyBtn.textContent = "Copy failed";
            setTimeout(() => (copyBtn.textContent = "Copy details"), 1400);
          }
        };
      }
    });
  }
})();
