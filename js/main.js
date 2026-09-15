/**
 * Manoa — Luxury Brand Website Interactions
 * Replicates NAGHEDI NYC high-end e-commerce interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // State
  // =========================================================================
  const state = {
    isMobileMenuOpen: false,
    isCartOpen: false,
    ticking: false,
  };

  // =========================================================================
  // DOM References
  // =========================================================================
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const header = $('#header');
  const heroImage = $('#hero-image');
  const backToTopBtn = $('#back-to-top');
  const menuToggle = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');
  const mobileMenuOverlay = $('#mobile-menu-overlay');
  const mobileMenuClose = $('#mobile-menu-close');
  const cartBtn = $('#cart-btn');
  const cartSidebar = $('#cart-sidebar');
  const cartOverlay = $('#cart-overlay');
  const cartClose = $('#cart-close');
  const cartShopLink = $('#cart-shop-link');
  const newsletterForm = $('#newsletter-form');
  const newsletterSuccess = $('#newsletter-success');
  const revealElements = $$('.reveal');
  const anchorLinks = $$('a[href^="#"]');

  // =========================================================================
  // 1. Sticky Header — transparent → solid on scroll
  // =========================================================================
  const handleScroll = () => {
    if (state.ticking) return;

    state.ticking = true;
    window.requestAnimationFrame(() => {
      const scrollY = window.scrollY;

      // Header transparency toggle
      if (header) {
        header.classList.toggle('scrolled', scrollY > 80);
      }

      // Hero parallax (subtle)
      if (heroImage && scrollY < window.innerHeight) {
        heroImage.style.transform = `scale(${1 + scrollY * 0.0001}) translateY(${scrollY * 0.2}px)`;
      }

      // Back to top visibility
      if (backToTopBtn) {
        backToTopBtn.classList.toggle('visible', scrollY > 500);
      }

      state.ticking = false;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // =========================================================================
  // 2. Scroll Reveal Animations (IntersectionObserver)
  // =========================================================================
  if (revealElements.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1,
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // =========================================================================
  // 3. Announcement Bar Marquee — handled via CSS animation
  //    (The CSS @keyframes marquee handles the infinite scroll)
  // =========================================================================

  // =========================================================================
  // 4. Mobile Menu
  // =========================================================================
  const openMobileMenu = () => {
    state.isMobileMenuOpen = true;
    mobileMenu?.classList.add('open');
    menuToggle?.classList.add('active');
    document.body.classList.add('menu-open');
  };

  const closeMobileMenu = () => {
    state.isMobileMenuOpen = false;
    mobileMenu?.classList.remove('open');
    menuToggle?.classList.remove('active');
    document.body.classList.remove('menu-open');
  };

  menuToggle?.addEventListener('click', () => {
    state.isMobileMenuOpen ? closeMobileMenu() : openMobileMenu();
  });

  mobileMenuOverlay?.addEventListener('click', closeMobileMenu);
  mobileMenuClose?.addEventListener('click', closeMobileMenu);

  // Close mobile menu on link click
  $$('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // =========================================================================
  // 5. Cart Sidebar
  // =========================================================================
  const openCart = () => {
    state.isCartOpen = true;
    cartSidebar?.classList.add('open');
    document.body.classList.add('cart-open');
  };

  const closeCart = () => {
    state.isCartOpen = false;
    cartSidebar?.classList.remove('open');
    document.body.classList.remove('cart-open');
  };

  cartBtn?.addEventListener('click', () => {
    state.isCartOpen ? closeCart() : openCart();
  });

  cartOverlay?.addEventListener('click', closeCart);
  cartClose?.addEventListener('click', closeCart);
  cartShopLink?.addEventListener('click', closeCart);

  // =========================================================================
  // 6. Smooth Scroll with Header Offset
  // =========================================================================
  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const targetId = href.substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // =========================================================================
  // 7. Newsletter Form
  // =========================================================================
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const submitBtn = newsletterForm.querySelector('button[type="submit"]');

      if (!emailInput) return;

      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        emailInput.style.borderBottomColor = 'var(--color-danger)';
        setTimeout(() => {
          emailInput.style.borderBottomColor = '';
        }, 2000);
        return;
      }

      // Simulate submission
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        emailInput.value = '';
        if (submitBtn) {
          submitBtn.textContent = 'Subscribe';
          submitBtn.disabled = false;
        }

        if (newsletterSuccess) {
          newsletterSuccess.classList.add('visible');
          setTimeout(() => {
            newsletterSuccess.classList.remove('visible');
          }, 4000);
        }
      }, 1200);
    });
  }

  // Footer newsletter form (same behavior)
  const footerForm = $('#footer-newsletter-form');
  if (footerForm) {
    footerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = footerForm.querySelector('input');
      if (input) {
        input.value = '';
        input.placeholder = 'Thank you! ✦';
        setTimeout(() => {
          input.placeholder = 'Email address';
        }, 3000);
      }
    });
  }

  // =========================================================================
  // 8. Back to Top
  // =========================================================================
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =========================================================================
  // 9. Keyboard Accessibility — Escape to close overlays
  // =========================================================================
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.isMobileMenuOpen) closeMobileMenu();
      if (state.isCartOpen) closeCart();
    }
  });

  // =========================================================================
  // 10. Auto-resize mobile menu on window resize
  // =========================================================================
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 750 && state.isMobileMenuOpen) {
        closeMobileMenu();
      }
    }, 250);
  }, { passive: true });

  // =========================================================================
  // 11. Image loading enhancement — add loaded class
  // =========================================================================
  $$('img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
    }
  });

});
