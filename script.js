// Smooth nav highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => observer.observe(s));

// Fade-in on scroll
const fadeEls = document.querySelectorAll('.project-card, .mini-card, .cta-box, .about-text');

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});

// Nav background on scroll
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 20
    ? 'rgba(10,10,15,0.97)'
    : 'rgba(10,10,15,0.85)';
});
