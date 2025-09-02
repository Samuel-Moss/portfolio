// main.js

(() => {
  // Ensure DOM is ready even if defer isn't used
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // === Mobile Menu Toggle ===
    const toggleBtn = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    if (toggleBtn && nav) {
      toggleBtn.addEventListener('click', () => {
        nav.classList.toggle('show');
      });
    }

    // === Project Slider ===
    const track = document.getElementById('projectTrack');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    const updateDots = (index) => {
      if (!dots || dots.length === 0) return;
      dots.forEach(dot => dot.classList.remove('active'));
      if (dots[index]) dots[index].classList.add('active');
    };

    const moveToSlide = (index) => {
      if (!track) return;
      const maxIndex = Math.max(dots.length - 1, 0);
      const clamped = Math.max(0, Math.min(index, maxIndex));
      track.style.transform = `translateX(-${clamped * 100}vw)`;
      currentSlide = clamped;
      updateDots(clamped);
    };

    const nextSlide = () => {
      moveToSlide(currentSlide + 1);
    };

    const prevSlide = () => {
      moveToSlide(currentSlide - 1);
    };

    // Expose for inline onclick handlers if used in HTML
    window.nextSlide = nextSlide;
    window.prevSlide = prevSlide;

    // Initialize dot state if any
    updateDots(0);

    // === Circle Progress Animation ===
    const animateCircle = (el, targetPercent) => {
      let current = 0;
      const duration = 950;
      const start = performance.now();

      const step = now => {
        const progress = Math.min((now - start) / duration, 1);
        current = Math.floor(progress * targetPercent);

        const degrees = (current / 100) * 360;
        el.style.background = `conic-gradient(var(--fg) ${degrees}deg, var(--bg) 0deg)`;

        const span = el.querySelector('span');
        const customLabel = el.getAttribute('data-label');

        if (span) {
          span.textContent = customLabel ? customLabel : `${current}%`;
        }

        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const circles = document.querySelectorAll('.circle');
    if (circles.length > 0 && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const targetAttr = el.getAttribute('data-value');
            const target = Number.parseInt(targetAttr || '0', 10);
            animateCircle(el, Number.isFinite(target) ? target : 0);
            observer.unobserve(el);
          }
        });
      }, { threshold: 0.5 });

      circles.forEach(circle => observer.observe(circle));
    } else if (circles.length > 0) {
      // Fallback: animate immediately if IntersectionObserver not supported
      circles.forEach(el => {
        const target = Number.parseInt(el.getAttribute('data-value') || '0', 10);
        animateCircle(el, Number.isFinite(target) ? target : 0);
      });
    }

    // === Scroll Reveal (optional if library present) ===
    if (typeof ScrollReveal !== 'undefined' && ScrollReveal) {
      ScrollReveal().reveal('.section-heading, .circle-container, .badge-container, .about-wrapper, .btn', {
        distance: '50px',
        duration: 1000,
        easing: 'ease-out',
        origin: 'bottom',
        interval: 150
      });
    }

    // === Hero Image Rotation ===
    const heroImages = document.querySelectorAll('.hero-bg img');
    let currentHero = 0;

    if (heroImages.length > 0) {
      // Ensure one image is active initially
      heroImages.forEach(img => img.classList.remove('active'));
      heroImages[0].classList.add('active');

      setInterval(() => {
        heroImages[currentHero].classList.remove('active');
        currentHero = (currentHero + 1) % heroImages.length;
        heroImages[currentHero].classList.add('active');
      }, 5000); // 5 seconds
    }
  }
})();
