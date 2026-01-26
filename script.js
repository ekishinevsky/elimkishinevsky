// ===== 3D Interactive Elements =====
const interactiveElements = document.querySelectorAll('.btn, .stat-card, .project-card, .experience-card, .skill-tag, .contact-link, a.stat-card, a.project-card');

interactiveElements.forEach(el => {
    const isButton = el.classList.contains('btn');
    const isSmall = el.classList.contains('skill-tag');

    // Different rotation amounts based on element type
    const maxRotation = isButton ? 15 : isSmall ? 10 : 8;
    const translateAmount = isButton ? 10 : 5;

    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation based on mouse position relative to center
        const rotateX = ((y - centerY) / centerY) * -maxRotation;
        const rotateY = ((x - centerX) / centerX) * maxRotation;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateAmount}px)`;
    });

    el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        el.classList.remove('pressed');
    });

    if (isButton) {
        el.addEventListener('mousedown', () => {
            el.classList.add('pressed');
        });

        el.addEventListener('mouseup', () => {
            el.classList.remove('pressed');
        });
    }
});

// ===== Modal Functionality =====
const modalTriggers = document.querySelectorAll('[data-modal]');
const modalOverlays = document.querySelectorAll('.modal-overlay');
const modalCloseButtons = document.querySelectorAll('.modal-close');

// Open modal
modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal with close button
modalCloseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close modal when clicking overlay background
modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modalOverlays.forEach(overlay => {
            overlay.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

// ===== Navbar Scroll Effect =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Smooth Scroll for Navigation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// ===== Mouse Rocket Effect =====
const mouseRocket = document.querySelector('.mouse-rocket');
let mouseX = 0;
let mouseY = 0;
let rocketX = 0;
let rocketY = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let mouseTimeout;

document.addEventListener('mousemove', (e) => {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Show rocket when mouse moves
    mouseRocket.classList.add('active');

    // Hide rocket after mouse stops
    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => {
        mouseRocket.classList.remove('active');
    }, 1500);
});

// Smooth rocket following with rotation
function animateRocket() {
    // Smooth interpolation
    rocketX += (mouseX - rocketX) * 0.15;
    rocketY += (mouseY - rocketY) * 0.15;

    // Calculate angle based on movement direction
    const dx = mouseX - prevMouseX;
    const dy = mouseY - prevMouseY;

    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        mouseRocket.style.transform = `rotate(${angle}deg)`;
    }

    mouseRocket.style.left = rocketX + 'px';
    mouseRocket.style.top = rocketY + 'px';

    requestAnimationFrame(animateRocket);
}
animateRocket();

// Hide rocket when mouse leaves window
document.addEventListener('mouseleave', () => {
    mouseRocket.classList.remove('active');
});

// ===== Scroll-Connected Constellation =====
const constLines = document.querySelectorAll('.const-line');
const constStars = document.querySelectorAll('.const-star');

function updateConstellation() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = Math.min(scrollY / docHeight, 1);

    // Draw lines based on scroll progress
    constLines.forEach((line, index) => {
        const lineStart = index / constLines.length;
        const lineEnd = (index + 1) / constLines.length;

        if (scrollProgress >= lineEnd) {
            // Fully drawn
            line.style.strokeDashoffset = 0;
        } else if (scrollProgress > lineStart) {
            // Partially drawn
            const lineProgress = (scrollProgress - lineStart) / (lineEnd - lineStart);
            const dashOffset = 1000 * (1 - lineProgress);
            line.style.strokeDashoffset = dashOffset;
        } else {
            // Not yet drawn
            line.style.strokeDashoffset = 1000;
        }
    });

    // Make stars glow more as they become connected
    constStars.forEach((star, index) => {
        const starPosition = index / constStars.length;
        if (scrollProgress > starPosition) {
            star.style.filter = 'drop-shadow(0 0 8px rgba(74, 138, 255, 1)) drop-shadow(0 0 20px rgba(30, 90, 255, 0.8)) drop-shadow(0 0 4px rgba(255,255,255,0.9))';
            star.style.fill = 'rgba(74, 138, 255, 1)';
        } else {
            star.style.filter = 'drop-shadow(0 0 3px rgba(255,255,255,0.5))';
            star.style.fill = 'rgba(255, 255, 255, 0.9)';
        }
    });
}

window.addEventListener('scroll', updateConstellation);
updateConstellation(); // Initial call

// ===== Scroll Reveal Animation =====
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const revealElements = document.querySelectorAll('.stat-card, .project-card, .about-text, .about-skills, .contact-link, .experience-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ===== Stats Counter Animation =====
const statNumbers = document.querySelectorAll('.stat-number');
let hasAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animateStats();
        }
    });
}, { threshold: 0.2 });

document.querySelector('.stats-grid')?.parentElement &&
    statsObserver.observe(document.querySelector('.stats-grid').parentElement);

function animateStats() {
    statNumbers.forEach((stat, index) => {
        const text = stat.textContent;
        const hasK = text.includes('K');
        const hasM = text.includes('M');
        const hasPlus = text.includes('+');
        const numericValue = parseInt(text.replace(/[^0-9]/g, ''));

        // Start from 0
        stat.textContent = '0' + (hasK ? 'K' : '') + (hasM ? 'M' : '') + (hasPlus ? '+' : '');

        // Delay each stat slightly for staggered effect
        setTimeout(() => {
            let current = 0;
            const duration = 1800;
            const steps = 60;
            const increment = numericValue / steps;
            const stepTime = duration / steps;

            const counter = setInterval(() => {
                current += increment;
                if (current >= numericValue) {
                    current = numericValue;
                    clearInterval(counter);
                }

                let display = Math.floor(current).toLocaleString();
                if (hasK) display += 'K';
                if (hasM) display += 'M';
                if (hasPlus) display += '+';

                stat.textContent = display;
            }, stepTime);
        }, index * 150);
    });
}

// ===== Parallax for Galaxies =====
const galaxies = document.querySelectorAll('.galaxy');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    galaxies.forEach((galaxy, index) => {
        const speed = 0.02 + (index * 0.015);
        const baseRotation = [-30, 20, -15, 45][index] || 0;
        galaxy.style.transform = `rotate(${baseRotation}deg) translateY(${scrollY * speed}px)`;
    });
});

// ===== Parallax Stars on Scroll =====
const starsLayers = document.querySelectorAll('.stars');

function updateStarsParallax() {
    const scrollY = window.scrollY;

    starsLayers.forEach((layer, index) => {
        // Different speeds for each layer for depth effect
        const speed = 0.15 + (index * 0.08);
        layer.style.transform = `translateY(${scrollY * speed}px)`;
    });
}

window.addEventListener('scroll', updateStarsParallax);
updateStarsParallax();
