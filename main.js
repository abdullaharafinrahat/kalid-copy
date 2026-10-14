// Nextechzen Website Interactive Scripts

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hero Rotating Accent Words
  const heroAccents = ["Growth", "Search", "Ads", "AI Visibility", "Revenue"];
  let currentAccentIdx = 0;
  const accentEl = document.querySelector('.hero-accent-text');

  if (accentEl) {
    setInterval(() => {
      accentEl.style.opacity = '0';
      setTimeout(() => {
        currentAccentIdx = (currentAccentIdx + 1) % heroAccents.length;
        accentEl.textContent = heroAccents[currentAccentIdx];
        accentEl.style.opacity = '1';
      }, 200);
    }, 2200);
  }

  // 2. Metrics Counter with IntersectionObserver and exact cubic bezier easing
  const metrics = [
    { id: 'metric-clients', target: 120, prefix: '', suffix: '+' },
    { id: 'metric-countries', target: 7, prefix: '', suffix: '' },
    { id: 'metric-revenue', target: 40, prefix: '€', suffix: 'M+' },
    { id: 'metric-experience', target: 8, prefix: '', suffix: '+' }
  ];

  const observerOptions = { threshold: 0.3 };
  const metricsSection = document.querySelector('.agency-pitch-grid');

  if (metricsSection) {
    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          const startTime = performance.now();
          const duration = 1200;

          function animate(currentTime) {
            const elapsed = Math.min((currentTime - startTime) / duration, 1);
            // Easing formula from source: n < 0.5 ? 2*n*n : 1 - Math.pow(-2*n + 2, 2) / 2
            const eased = elapsed < 0.5 ? 2 * elapsed * elapsed : 1 - Math.pow(-2 * elapsed + 2, 2) / 2;

            metrics.forEach(m => {
              const el = document.getElementById(m.id);
              if (el) {
                const val = Math.round(eased * m.target);
                el.textContent = `${m.prefix}${val}${m.suffix}`;
              }
            });

            if (elapsed < 1) {
              requestAnimationFrame(animate);
            } else {
              metrics.forEach(m => {
                const el = document.getElementById(m.id);
                if (el) el.textContent = `${m.prefix}${m.target}${m.suffix}`;
              });
            }
          }

          requestAnimationFrame(animate);
        }
      });
    }, observerOptions);

    observer.observe(metricsSection);
  }

  // 3. Desktop Navigation Dropdown Menus
  const navButtons = document.querySelectorAll('.nav-dropdown-btn');
  const dropdownContainer = document.getElementById('navbar-dropdown-container');
  const dropdownPanels = document.querySelectorAll('.dropdown-panel');
  let activeDropdown = null;
  let closeTimeout = null;

  function openDropdown(id) {
    if (closeTimeout) clearTimeout(closeTimeout);
    activeDropdown = id;

    navButtons.forEach(btn => {
      const btnId = btn.getAttribute('data-dropdown');
      const chevron = btn.querySelector('.nav-chevron');
      if (btnId === id) {
        btn.setAttribute('aria-expanded', 'true');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      } else {
        btn.setAttribute('aria-expanded', 'false');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      }
    });

    dropdownPanels.forEach(panel => {
      if (panel.id === `dropdown-${id}`) {
        panel.style.display = 'block';
      } else {
        panel.style.display = 'none';
      }
    });

    if (dropdownContainer) {
      dropdownContainer.style.display = 'block';
    }

    const header = document.querySelector('header');
    if (header) {
      header.style.background = 'var(--kf-white)';
      header.style.borderBottom = '1px solid var(--kf-ink-200)';
    }
  }

  function closeDropdown() {
    closeTimeout = setTimeout(() => {
      activeDropdown = null;
      navButtons.forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
        const chevron = btn.querySelector('.nav-chevron');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      });
      if (dropdownContainer) {
        dropdownContainer.style.display = 'none';
      }
      dropdownPanels.forEach(panel => {
        panel.style.display = 'none';
      });

      const header = document.querySelector('header');
      if (header && window.scrollY <= 80) {
        header.style.background = 'rgba(255, 255, 255, 0.85)';
        header.style.borderBottom = '1px solid rgba(226, 231, 240, 0.6)';
      }
    }, 150);
  }

  navButtons.forEach(btn => {
    const id = btn.getAttribute('data-dropdown');
    btn.addEventListener('mouseenter', () => openDropdown(id));
    btn.addEventListener('mouseleave', () => closeDropdown());
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (activeDropdown === id) {
        activeDropdown = null;
        if (dropdownContainer) dropdownContainer.style.display = 'none';
        const chevron = btn.querySelector('.nav-chevron');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      } else {
        openDropdown(id);
      }
    });
  });

  if (dropdownContainer) {
    dropdownContainer.addEventListener('mouseenter', () => {
      if (closeTimeout) clearTimeout(closeTimeout);
    });
    dropdownContainer.addEventListener('mouseleave', () => {
      closeDropdown();
    });
  }

  document.addEventListener('click', (e) => {
    if (!e.target.closest('header')) {
      if (closeTimeout) clearTimeout(closeTimeout);
      closeDropdown();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (closeTimeout) clearTimeout(closeTimeout);
      closeDropdown();
      closeMobileMenu();
    }
  });

  // Header background on scroll
  window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (!header) return;
    if (window.scrollY > 80 || activeDropdown) {
      header.style.background = 'var(--kf-white)';
      header.style.borderBottom = '1px solid var(--kf-ink-200)';
    } else {
      header.style.background = 'rgba(255, 255, 255, 0.85)';
      header.style.borderBottom = '1px solid rgba(226, 231, 240, 0.6)';
    }
  }, { passive: true });

  // 4. Mobile Menu Drawer
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
  const mobileMenuIcon = document.getElementById('mobile-menu-icon');
  let isMobileMenuOpen = false;

  function openMobileMenu() {
    isMobileMenuOpen = true;
    if (mobileMenuDrawer) mobileMenuDrawer.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    if (mobileMenuIcon) {
      mobileMenuIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
    }
  }

  function closeMobileMenu() {
    isMobileMenuOpen = false;
    if (mobileMenuDrawer) mobileMenuDrawer.style.display = 'none';
    document.body.style.overflow = '';
    if (mobileMenuIcon) {
      mobileMenuIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>`;
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      if (isMobileMenuOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  // Mobile Accordion Items
  const mobileAccordionTriggers = document.querySelectorAll('.mobile-acc-trigger');
  mobileAccordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.parentElement;
      const content = parent.querySelector('.mobile-acc-content');
      const icon = trigger.querySelector('.mobile-acc-chevron');
      const isOpen = content.style.display === 'block';

      // Close all other accordions
      document.querySelectorAll('.mobile-acc-content').forEach(c => c.style.display = 'none');
      document.querySelectorAll('.mobile-acc-trigger').forEach(t => {
        t.style.color = 'rgba(255,255,255,0.7)';
        t.style.background = 'none';
        t.style.borderLeft = '3px solid transparent';
        const ic = t.querySelector('.mobile-acc-chevron');
        if (ic) ic.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.style.display = 'block';
        trigger.style.color = 'var(--kf-white)';
        trigger.style.background = 'rgba(255,255,255,0.06)';
        trigger.style.borderLeft = '3px solid var(--kf-white)';
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // Mobile link clicks close drawer
  document.querySelectorAll('#mobile-menu-drawer a').forEach(a => {
    a.addEventListener('click', () => closeMobileMenu());
  });
});
