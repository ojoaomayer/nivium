/**
 * Central Park Residence - Upgraded Interactions & Cinematic Experience
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SMOOTH SCROLL WITH LENIS (Optimized for Trackpads) ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis = null;

    if (!prefersReducedMotion) {
        // Initialize Lenis smooth scroll
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // organic exponential curve
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 1.5,
            infinite: false,
        });

        // Anchor links scroll integration with Lenis
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                const target = document.querySelector(targetId);
                if (target && lenis) {
                    lenis.scrollTo(target, {
                        offset: 0,
                        duration: 1.2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                }
            });
        });

        // Frame loop for Lenis
        function raf(time) {
            if (lenis) lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // --- 2. GLOBAL SCROLL PROGRESS & PARALLAX EFFECTS ---
    const progressBar = document.getElementById('progress-bar');
    const heroBg = document.getElementById('hero-bg-img');
    const lazerBg = document.getElementById('lazer-bg-img');
    const navbar = document.getElementById('main-navbar');

    const handleScrollEffects = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // 2a. Scroll Progress Bar
        if (progressBar && docHeight > 0) {
            const progress = (scrollTop / docHeight) * 100;
            progressBar.style.height = `${progress}%`;
        }

        // 2b. Navbar Scrolled State
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // 2c. Hero Parallax Scale
        if (heroBg && scrollTop < window.innerHeight) {
            const scale = 1 + (scrollTop / window.innerHeight) * 0.15; // Zoom from 1 to 1.15
            const translate = (scrollTop * 0.2); // Moves building slightly downwards
            heroBg.style.transform = `scale(${scale}) translateY(${translate}px)`;
        }

        // 2d. Lazer Parallax Scale
        if (lazerBg) {
            const lazerSection = document.getElementById('lazer');
            if (lazerSection) {
                const rect = lazerSection.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const visibleProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                    const scale = 1.05 + (visibleProgress * 0.1); // subtle zoom
                    const translate = (rect.top * -0.1);
                    lazerBg.style.transform = `scale(${scale}) translateY(${translate}px)`;
                }
            }
        }
    };

    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // Initial call

    // --- 3. STICKY NARRATIVE CONTROL ---
    const narrativeSection = document.getElementById('conceito');
    const slides = document.querySelectorAll('.narrative-slide');

    const handleStickyNarrative = () => {
        if (!narrativeSection || slides.length === 0) return;
        const rect = narrativeSection.getBoundingClientRect();
        const sectionHeight = rect.height;
        const viewHeight = window.innerHeight;
        
        // Calculate progress (0 when top touches viewport top, 1 when bottom touches viewport top)
        const progress = -rect.top / (sectionHeight - viewHeight);

        if (progress >= 0 && progress <= 1) {
            let activeIndex = 0;
            if (progress < 0.33) {
                activeIndex = 0;
            } else if (progress < 0.66) {
                activeIndex = 1;
            } else {
                activeIndex = 2;
            }

            slides.forEach((slide, idx) => {
                if (idx === activeIndex) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });

            // Slow narrative background zoom
            const narrativeBg = narrativeSection.querySelector('.narrative-bg');
            if (narrativeBg) {
                const bgScale = 1 + progress * 0.12; // slow zoom up to 1.12
                const bgTranslate = progress * 40;
                narrativeBg.style.transform = `scale(${bgScale}) translateY(${bgTranslate}px)`;
            }
        }
    };

    window.addEventListener('scroll', handleStickyNarrative);
    handleStickyNarrative(); // Initial call

    // --- 4. MOBILE SIDEBAR MENU ---
    const menuOpenBtn = document.getElementById('menu-open-btn');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const openMenu = () => {
        mobileMenu.classList.add('open');
        mobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (lenis) lenis.stop();
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
        if (lenis) lenis.start();
    };

    if (menuOpenBtn) menuOpenBtn.addEventListener('click', openMenu);
    if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- 5. DYNAMIC STAGGER & SCROLL REVEAL (Intersection Observer) ---
    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        // Add js-reveal class to body to activate animations via CSS
        document.body.classList.add('js-reveal');

        // Immediately reveal hero elements to prevent blank states
        document.querySelectorAll('#home .reveal-text, #home .reveal-image').forEach(el => {
            el.classList.add('is-visible');
        });

        // Apply stagger delay to children of .reveal-stagger containers
        document.querySelectorAll('.reveal-stagger').forEach(container => {
            const children = container.querySelectorAll(
                ':scope > .reveal-item, :scope > .reveal-text, :scope > .reveal-image, :scope > .spec-card, :scope > .blueprint-spec-item, :scope > .lifestyle-img-wrapper'
            );
            children.forEach((child, index) => {
                if (!child.style.transitionDelay) {
                    child.style.transitionDelay = `${index * 0.15}s`;
                }
            });
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.01 // triggered as soon as 1% is visible
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-item, .reveal-slide-left, .reveal-slide-right, .reveal-text, .reveal-image').forEach(el => {
            revealObserver.observe(el);
        });

        // Scroll fallback in case IntersectionObserver fails to trigger in some environments (e.g. headless testing or layout caching)
        const checkRevealOnScroll = () => {
            const viewportHeight = window.innerHeight;
            document.querySelectorAll('.reveal-item, .reveal-slide-left, .reveal-slide-right, .reveal-text, .reveal-image').forEach(el => {
                if (!el.classList.contains('is-visible')) {
                    const rect = el.getBoundingClientRect();
                    // If the top of the element enters the viewport with a 30px buffer
                    if (rect.top < viewportHeight - 30 && rect.bottom > 30) {
                        el.classList.add('is-visible');
                    }
                }
            });
        };
        window.addEventListener('scroll', checkRevealOnScroll);
        // Run check once on load
        setTimeout(checkRevealOnScroll, 300);
        // Also run when Lenis finishes scrolling
        if (lenis) {
            lenis.on('scroll', checkRevealOnScroll);
        }
    } else {
        // Fallback for prefers-reduced-motion or missing IntersectionObserver support
        document.querySelectorAll('.reveal-item, .reveal-slide-left, .reveal-slide-right, .reveal-text, .reveal-image').forEach(el => {
            el.classList.add('is-visible');
        });
    }

    // --- 6. PLANT FLOOR PLAN LIGHTBOX MODAL ---
    const floorPlanImg = document.getElementById('floor-plan-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (floorPlanImg && lightbox && lightboxImg) {
        floorPlanImg.addEventListener('click', () => {
            lightboxImg.src = floorPlanImg.src;
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
        });

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            // Wait for transition before clearing src
            setTimeout(() => {
                lightboxImg.src = '';
            }, 300);
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        // Escape key support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('open')) {
                closeLightbox();
            }
        });
    }

    // --- 7. CONTACT FORM SUBMISSION ---
    const contactForm = document.getElementById('cadastro-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const submitBtn = contactForm.querySelector('.cta-button');
            const originalBtnText = submitBtn.innerHTML;
            
            emailInput.disabled = true;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span>Aguardando...</span>
                <span class="material-symbols-outlined animate-spin" style="animation: spin 1s linear infinite;">sync</span>
            `;
            
            // Simulate API request
            setTimeout(() => {
                submitBtn.style.backgroundColor = '#2e7d32'; // Success green
                submitBtn.style.color = '#ffffff';
                submitBtn.innerHTML = `
                    <span>Reserva Solicitada!</span>
                    <span class="material-symbols-outlined">check_circle</span>
                `;
                
                setTimeout(() => {
                    emailInput.disabled = false;
                    emailInput.value = '';
                    submitBtn.disabled = false;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                    submitBtn.innerHTML = originalBtnText;
                }, 4000);
                
            }, 1500);
        });
    }
});

