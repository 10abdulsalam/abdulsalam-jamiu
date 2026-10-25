document.documentElement.classList.add("js-ready");

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      siteNav.classList.remove("is-open");
    });
  });
}

const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    projectCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

document.querySelector(".print-button")?.addEventListener("click", () => window.print());

const year = document.querySelector("#current-year");
if (year) year.textContent = String(new Date().getFullYear());

const flashMessageKey = "portfolio.flashMessage";
const flashMessageExpiryKey = "portfolio.flashMessageExpiry";

function showFlashMessage(message, state = "success") {
  if (!contactFeedback) return;
  contactFeedback.textContent = message;
  contactFeedback.dataset.state = state;
  contactFeedback.setAttribute("role", state === "error" ? "alert" : "status");
  contactFeedback.hidden = false;
}

function consumeFlashMessage() {
  try {
    const message = sessionStorage.getItem(flashMessageKey);
    const expiresAt = Number(sessionStorage.getItem(flashMessageExpiryKey));
    sessionStorage.removeItem(flashMessageKey);
    sessionStorage.removeItem(flashMessageExpiryKey);
    if (message && expiresAt > Date.now()) showFlashMessage(message);
  } catch {
    showFlashMessage("Your browser could not restore the message feedback.", "error");
  }
}

const sessionVisit = document.querySelector("#session-visit");
if (sessionVisit) {
  try {
    const previousCount = Number(sessionStorage.getItem("portfolio.visitCount"));
    const visitCount = Number.isSafeInteger(previousCount) && previousCount > 0
      ? previousCount + 1
      : 1;
    sessionStorage.setItem("portfolio.visitCount", String(visitCount));
    sessionVisit.textContent = `Session visit: ${visitCount}`;
  } catch {
      sessionVisit.textContent = "Session tracking unavailable";
  }
}

const contactForm = document.querySelector("#contact-form");
const contactFeedback = document.querySelector("#contact-feedback");

if (contactForm && contactFeedback) {
  consumeFlashMessage();

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name")).trim();
    const email = String(formData.get("email")).trim();
    const message = String(formData.get("message")).trim();
    const flashMessage = "An email draft is ready. Send it from your email app to deliver your message.";

    if (!name || !email || !message) {
      showFlashMessage("Please complete all fields before preparing your email.", "error");
      return;
    }

    const subject = `Portfolio message from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    const mailtoUrl = `mailto:akandejamiu1@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      sessionStorage.setItem(flashMessageKey, flashMessage);
      sessionStorage.setItem(flashMessageExpiryKey, String(Date.now() + 5 * 60 * 1000));
      consumeFlashMessage();
    } catch {
      showFlashMessage("Your browser could not save message feedback. You can still send the email draft.");
    }

    const emailLink = document.createElement("a");
    emailLink.href = mailtoUrl;
    emailLink.target = "_blank";
    emailLink.rel = "noopener";
    emailLink.click();
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".section-heading, .about-copy, .project-card, .skill-group, .journey-list li, .contact-content").forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
}
