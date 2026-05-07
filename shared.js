/**
 * ESEMI Shared JavaScript
 * Handles: Active Page Highlighting, Scroll Shrink, Scroll Reveal, and Dark Mode.
 */

(function () {
  // 1. Highlight active nav link
  const page = window.location.pathname.split('/').pop().toLowerCase() || 'home.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    const href = link.getAttribute('href').toLowerCase();
    if (href === page || (page === '' && href === 'home.html')) {
      link.classList.add('active-page');
    }
  });

  // 2. Navbar shrink on scroll
  const navbar = document.querySelector('.navbar');
  const logo = document.querySelector('.navbar-logo');
  if (navbar && logo) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.style.padding = '2px 0';
        logo.style.height = '60px';
      } else {
        navbar.style.padding = '5px 0';
        logo.style.height = '80px';
      }
    });
  }

  // 3. Scroll Reveal (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. Dark Mode Logic
  const themeToggle = document.querySelector('.theme-toggle');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark' && themeToggle) {
      themeToggle.innerHTML = '🌙'; // Or a sun icon depending on state
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'dark') {
        theme = 'light';
        themeToggle.innerHTML = '☀️';
      } else {
        theme = 'dark';
        themeToggle.innerHTML = '🌙';
      }
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    });
  }
})();
