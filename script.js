/* ========================================
   DAR EL-ARKAN - JavaScript
   3D Building Model & Animations
   ======================================== */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initHeader();
    initImageSlider();
    initScrollAnimations();
    initCounterAnimation();
    initTiltEffect();
    initMobileMenu();
    initSmoothScroll();
});

/* ========================================
   LOADING SCREEN
   ======================================== */
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 2000);
    });
}

/* ========================================
   HEADER SCROLL EFFECT
   ======================================== */
function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

/* ========================================
   IMAGE SLIDER / CAROUSEL
   ======================================== */
function initImageSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;
    
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.nav-dot');
    const prevBtn = slider.querySelector('.slider-arrow.prev');
    const nextBtn = slider.querySelector('.slider-arrow.next');
    
    let currentSlide = 0;
    let autoPlayInterval;
    const slideCount = slides.length;
    const autoPlayDelay = 4000; // 4 seconds between slides
    
    // Update slide classes
    function updateSlides() {
        slides.forEach(function(slide, index) {
            slide.classList.remove('active', 'prev', 'next');
            
            if (index === currentSlide) {
                slide.classList.add('active');
            } else if (index === getPrevIndex()) {
                slide.classList.add('prev');
            } else if (index === getNextIndex()) {
                slide.classList.add('next');
            }
        });
        
        // Update dots
        dots.forEach(function(dot, index) {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function getPrevIndex() {
        return (currentSlide - 1 + slideCount) % slideCount;
    }
    
    function getNextIndex() {
        return (currentSlide + 1) % slideCount;
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSlides();
    }
    
    function nextSlide() {
        currentSlide = getNextIndex();
        updateSlides();
    }
    
    function prevSlide() {
        currentSlide = getPrevIndex();
        updateSlides();
    }
    
    // Auto play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }
    
    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetAutoPlay();
        });
    }
    
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            goToSlide(index);
            resetAutoPlay();
        });
    });
    
    // Pause on hover
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });
    
    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoPlay();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            nextSlide(); // RTL layout
            resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
            prevSlide(); // RTL layout
            resetAutoPlay();
        }
    });
    
    // Initialize
    updateSlides();
    startAutoPlay();
}

/* ========================================
   SCROLL REVEAL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(function(el) {
        observer.observe(el);
    });
    
    // GSAP ScrollTrigger for parallax effects (if available)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Parallax shapes in hero
        gsap.to('.shape-1', {
            y: -100,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
        
        gsap.to('.shape-2', {
            y: -150,
            x: 50,
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
        
        // Section header animations
        gsap.utils.toArray('.section-header').forEach(function(header) {
            gsap.from(header, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                }
            });
        });
    }
}

/* ========================================
   COUNTER ANIMATION
   ======================================== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(function(counter) {
        observer.observe(counter);
    });
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        function updateCounter() {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }
}

/* ========================================
   TILT EFFECT FOR CARDS
   ======================================== */
function initTiltEffect() {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });
}

/* ========================================
   MOBILE MENU
   ======================================== */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.main-nav');
    
    if (!menuBtn || !nav) return;
    
    menuBtn.addEventListener('click', function() {
        menuBtn.classList.toggle('active');
        nav.classList.toggle('active');
    });
}

/* ========================================
   SMOOTH SCROLL
   ======================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   FORM HANDLING
   ======================================== */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            
            // Simple validation feedback
            const btn = form.querySelector('.btn');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<span>جاري الإرسال...</span>';
            btn.disabled = true;
            
            // Simulate submission
            setTimeout(function() {
                btn.innerHTML = '<span>تم الإرسال بنجاح ✓</span>';
                btn.style.background = '#28a745';
                
                form.reset();
                
                setTimeout(function() {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
});
