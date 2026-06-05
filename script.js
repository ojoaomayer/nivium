/**
 * Central Park Residence - Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById('main-navbar');
    
    const handleNavbarScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Run once at start in case page was loaded scrolled down

    // --- 2. MOBILE SIDEBAR MENU ---
    const menuOpenBtn = document.getElementById('menu-open-btn');
    const menuCloseBtn = document.getElementById('menu-close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const openMenu = () => {
        mobileMenu.classList.add('open');
        mobileOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeMenu = () => {
        mobileMenu.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
    };

    menuOpenBtn.addEventListener('click', openMenu);
    menuCloseBtn.addEventListener('click', closeMenu);
    mobileOverlay.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- 3. SCROLL REVEAL ANIMATION (Intersection Observer) ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-item').forEach(el => {
            revealObserver.observe(el);
        });

        // --- 4. SMOOTH PARALLAX SCROLL ---
        const parallaxSections = document.querySelectorAll('[data-parallax-speed]');
        
        window.addEventListener('scroll', () => {
            requestAnimationFrame(() => {
                const scrollTop = window.pageYOffset;
                
                parallaxSections.forEach(section => {
                    const speed = parseFloat(section.getAttribute('data-parallax-speed')) || 0.5;
                    const rect = section.getBoundingClientRect();
                    const sectionTop = rect.top + scrollTop;
                    
                    // Only calculate parallax if the section is in viewport area
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        const relativeOffset = (scrollTop - sectionTop) * speed;
                        // Center is default, shift Y position slightly
                        section.style.backgroundPosition = `center ${relativeOffset}px`;
                    }
                });
            });
        });
    }

    // --- 5. CONTACT FORM SUBMISSION ---
    const contactForm = document.getElementById('cadastro-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const submitBtn = contactForm.querySelector('.cta-button');
            const originalBtnText = submitBtn.innerHTML;
            
            // Disable input and button during "sending" state
            emailInput.disabled = true;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span>Aguardando...</span>
                <span class="material-symbols-outlined animate-spin">sync</span>
            `;
            
            // Simulate API request
            setTimeout(() => {
                submitBtn.style.backgroundColor = '#2e7d32'; // Green confirmation color
                submitBtn.style.color = '#ffffff';
                submitBtn.innerHTML = `
                    <span>Reserva Solicitada!</span>
                    <span class="material-symbols-outlined">check_circle</span>
                `;
                
                // Keep the success state, reset after 4 seconds
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
