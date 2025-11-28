/**
 * Suhail Landing Page - JavaScript
 * Modern, Bilingual (Arabic/English) Interactive Features
 */

document.addEventListener('DOMContentLoaded', () => {
    initLanguageToggle();
    initNavigation();
    initScrollEffects();
    initFormHandling();
    initAnimations();
});

/**
 * Language Toggle System
 */
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    const html = document.documentElement;
    
    // Check for saved language preference
    const savedLang = localStorage.getItem('suhail-lang') || 'en';
    setLanguage(savedLang);
    
    langToggle.addEventListener('click', () => {
        const currentLang = html.getAttribute('lang');
        const newLang = currentLang === 'en' ? 'ar' : 'en';
        setLanguage(newLang);
        localStorage.setItem('suhail-lang', newLang);
    });
}

function setLanguage(lang) {
    const html = document.documentElement;
    const langEnSpan = document.querySelector('.lang-en');
    const langArSpan = document.querySelector('.lang-ar');
    
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update toggle button text
    if (lang === 'ar') {
        langEnSpan.style.display = 'none';
        langArSpan.style.display = 'inline';
    } else {
        langEnSpan.style.display = 'inline';
        langArSpan.style.display = 'none';
    }
    
    // Update all translatable elements
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) {
            if (el.tagName === 'INPUT') {
                // Don't change input values
            } else {
                el.textContent = text;
            }
        }
    });
    
    // Update placeholders for inputs
    document.querySelectorAll('input[data-placeholder-en][data-placeholder-ar]').forEach(input => {
        input.placeholder = input.getAttribute(`data-placeholder-${lang}`);
    });
    
    // Update title element content (handled specially due to nested HTML)
    document.querySelectorAll('.title-en, .title-ar').forEach(el => {
        if (el.classList.contains(`title-${lang}`)) {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    });
    
    // Update description paragraphs
    document.querySelectorAll('.desc-en, .desc-ar').forEach(el => {
        if (el.classList.contains(`desc-${lang}`)) {
            el.style.display = 'block';
        } else {
            el.style.display = 'none';
        }
    });
    
    // Update quotes
    document.querySelectorAll('.quote-en, .quote-ar').forEach(el => {
        if (el.classList.contains(`quote-${lang}`)) {
            el.style.display = 'inline';
        } else {
            el.style.display = 'none';
        }
    });
    
    // Update page title
    document.title = lang === 'ar' 
        ? 'سهيل | منصة التعلم التكيفي' 
        : 'Suhail | Adaptive Learning Platform';
}

/**
 * Navigation System
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navLinksItems = navLinks.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close mobile menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            mobileMenuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Scroll Effects
 */
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class for navbar styling
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

/**
 * Form Handling
 */
function initFormHandling() {
    const form = document.getElementById('signupForm');
    const formSuccess = document.getElementById('formSuccess');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.btn-submit');
        const originalContent = submitBtn.innerHTML;
        const currentLang = document.documentElement.getAttribute('lang');
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="spinner" viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="30 70" stroke-linecap="round">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                </circle>
            </svg>
            <span>${currentLang === 'ar' ? 'جارٍ الإرسال...' : 'Sending...'}</span>
        `;
        
        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email')
        };
        
        try {
            // Simulate API call - Replace this with actual backend integration
            await submitToBackend(data);
            
            // Show success message
            form.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Reset form
            form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // Show error state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            
            // Show error message (you can customize this)
            alert(currentLang === 'ar' 
                ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' 
                : 'An error occurred. Please try again.');
        }
    });
}

/**
 * Google Apps Script Integration
 * 
 * IMPORTANT: Replace the URL below with your deployed Google Apps Script URL
 */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzQMmotgVKvCzBftOszBty0d0bAzkUsvOnfIHYotMZlTyk585QayuUhx_EHlHOC-k8/exec';

async function submitToBackend(data) {
    // Add current language to the data
    data.language = document.documentElement.getAttribute('lang') || 'en';
    
    // Log data for development
    console.log('Submitting data:', data);
    
    // Check if Google Script URL is configured
    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_SCRIPT_URL_HERE') {
        console.warn('Google Apps Script URL not configured. Running in demo mode.');
        await new Promise(resolve => setTimeout(resolve, 1500));
        return { success: true, message: 'Demo mode - configure GOOGLE_SCRIPT_URL for real storage' };
    }
    
    return new Promise((resolve, reject) => {
        try {
            // Create URL with parameters (works better with Google Apps Script)
            const url = new URL(GOOGLE_SCRIPT_URL);
            url.searchParams.append('name', data.name || '');
            url.searchParams.append('email', data.email || '');
            url.searchParams.append('language', data.language || 'en');
            
            // Use fetch with redirect follow
            fetch(url.toString(), {
                method: 'GET',
                mode: 'no-cors'
            })
            .then(() => {
                // With no-cors we can't read response, but request was sent
                console.log('Request sent successfully');
                resolve({ success: true, message: 'Subscription successful!' });
            })
            .catch(error => {
                console.error('Fetch error:', error);
                reject(new Error('Failed to submit. Please try again.'));
            });
            
        } catch (error) {
            console.error('Submission error:', error);
            reject(new Error('Failed to submit. Please try again.'));
        }
    });
}

/**
 * Scroll Animations (Intersection Observer)
 */
function initAnimations() {
    // Create intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with animation
    document.querySelectorAll('.feature-card, .about-feature, .contact-card').forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .feature-card,
        .about-feature,
        .contact-card {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .feature-card.animate-in,
        .about-feature.animate-in,
        .contact-card.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-card:nth-child(1) { transition-delay: 0s; }
        .feature-card:nth-child(2) { transition-delay: 0.1s; }
        .feature-card:nth-child(3) { transition-delay: 0.2s; }
        .feature-card:nth-child(4) { transition-delay: 0.3s; }
        
        .about-feature:nth-child(1) { transition-delay: 0s; }
        .about-feature:nth-child(2) { transition-delay: 0.1s; }
        .about-feature:nth-child(3) { transition-delay: 0.2s; }
        
        .contact-card:nth-child(1) { transition-delay: 0s; }
        .contact-card:nth-child(2) { transition-delay: 0.1s; }
    `;
    document.head.appendChild(style);
    
    // Typing effect for hero (optional enhancement)
    // initTypingEffect();
}

/**
 * Optional: Typing Effect for Hero Title
 * Uncomment the call in initAnimations() to enable
 */
function initTypingEffect() {
    const gradientText = document.querySelector('.hero-title .gradient-text');
    if (!gradientText) return;
    
    const words = ['Adapts', 'Evolves', 'Grows', 'Personalizes'];
    const wordsAr = ['يتكيّف', 'يتطور', 'ينمو', 'يُخصص'];
    let wordIndex = 0;
    let isDeleting = false;
    let currentText = '';
    let charIndex = 0;
    
    function type() {
        const currentLang = document.documentElement.getAttribute('lang');
        const currentWords = currentLang === 'ar' ? wordsAr : words;
        const fullWord = currentWords[wordIndex];
        
        if (isDeleting) {
            currentText = fullWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            currentText = fullWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        gradientText.textContent = currentText;
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && charIndex === fullWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % currentWords.length;
            typeSpeed = 500;
        }
        
        setTimeout(type, typeSpeed);
    }
    
    // Start after initial animation
    setTimeout(type, 2000);
}

/**
 * Utility: Debounce function for performance
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

