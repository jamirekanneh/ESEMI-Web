/**
 * ESEMI Shared JavaScript
 */
(function () {
  "use strict";

  function initHeroCarousel() {
    const el = document.getElementById("carouselExampleDark");
    if (!el) return;

    const items = el.querySelectorAll(".carousel-item");
    const indicators = el.querySelectorAll(".carousel-indicators [data-bs-target], .carousel-indicators button");
    let index = 0;
    let timer = null;

    function goTo(i) {
      if (!items.length) return;
      index = ((i % items.length) + items.length) % items.length;
      items.forEach((item, n) => item.classList.toggle("active", n === index));
      indicators.forEach((dot, n) => {
        dot.classList.toggle("active", n === index);
        if (n === index) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
    }

    function startFallback() {
      stopFallback();
      timer = setInterval(() => goTo(index + 1), 4500);
    }

    function stopFallback() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    if (window.bootstrap?.Carousel) {
      const existing = bootstrap.Carousel.getInstance(el);
      if (existing) existing.dispose();
      const carousel = new bootstrap.Carousel(el, {
        interval: 4500,
        ride: false,
        pause: "hover",
        wrap: true,
        touch: true,
      });
      carousel.cycle();
      el.addEventListener("mouseenter", () => carousel.pause());
      el.addEventListener("mouseleave", () => carousel.cycle());
    } else {
      startFallback();
      el.addEventListener("mouseenter", stopFallback);
      el.addEventListener("mouseleave", startFallback);
    }
  }

  const page = window.location.pathname.split("/").pop().toLowerCase() || "home.html";
  document.querySelectorAll(".navbar-nav .nav-link").forEach((link) => {
    const href = (link.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href === page || (page === "" && href === "home.html")) {
      link.classList.add("active-page");
    }
  });

  const navbar = document.querySelector(".navbar");
  const logo = document.querySelector(".navbar-logo");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
      if (logo) logo.style.height = window.scrollY > 40 ? "48px" : "64px";
    }, { passive: true });
  }

  const revealElements = document.querySelectorAll(".reveal, .reveal-stagger");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("active");
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -30px 0px" });
  revealElements.forEach((el) => revealObserver.observe(el));

  const themeToggle = document.querySelector(".theme-toggle");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    if (savedTheme === "dark" && themeToggle) themeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const next = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      themeToggle.innerHTML = next === "dark"
        ? '<i class="bi bi-moon-fill"></i>'
        : '<i class="bi bi-sun-fill"></i>';
    });
  }

  window.initHeroCarousel = initHeroCarousel;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroCarousel);
  } else {
    initHeroCarousel();
  }
})();
