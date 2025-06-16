// ===== VARIABLES GLOBALES =====
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
let isScrolling = false;

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    createParticles();
    initializeAnimations();
    initializeSlider();
    initializeNavigation();
    initializeScrollEffects();
});

// ===== FUNCIONES PRINCIPALES =====

function initializeWebsite() {
    // Configurar smooth scroll para todos los enlaces internos
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // Configurar el indicador de scroll
    const scrollIndicator = document.querySelector('.scroll-arrow');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.querySelector('#servicios').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    // Agregar clase scrolled al navbar en scroll
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Optimizar el scroll con throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScrollAnimations();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        // Cerrar menú móvil si está abierto
        const navMenu = document.getElementById('nav-menu');
        const hamburger = document.getElementById('hamburger');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
}

// ===== NAVEGACIÓN =====
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Cerrar menú con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.getElementById('hamburger');
    
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// ===== PARTÍCULAS ANIMADAS =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = window.innerWidth < 768 ? 15 : 30;

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer, i);
    }
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Posición inicial aleatoria
    particle.style.left = Math.random() * 100 + '%';
    
    // Delay aleatorio para la animación
    particle.style.animationDelay = Math.random() * 8 + 's';
    
    // Tamaño aleatorio
    const size = Math.random() * 3 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Opacidad aleatoria
    particle.style.opacity = Math.random() * 0.5 + 0.3;
    
    container.appendChild(particle);
    
    // Recrear partícula cuando termine la animación
    particle.addEventListener('animationend', () => {
        particle.remove();
        setTimeout(() => createParticle(container, index), Math.random() * 3000);
    });
}

// ===== ANIMACIONES DE SCROLL =====
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                
                // Animar contadores
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observar elementos con animaciones
    const animatedElements = document.querySelectorAll('[data-aos], .stat-number, .service-card');
    animatedElements.forEach(el => observer.observe(el));
}

function handleScrollAnimations() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    // Efecto parallax en el hero
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${rate}px)`;
    }

    // Efecto en las partículas
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.1;
        particle.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/\D/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current >= target) {
            element.textContent = element.textContent.replace(/\d+/, target);
        } else {
            element.textContent = element.textContent.replace(/\d+/, Math.floor(current));
            requestAnimationFrame(updateCounter);
        }
    };

    updateCounter();
}

// ===== SLIDER DE TESTIMONIOS =====
function initializeSlider() {
    if (slides.length === 0) return;

    // Mostrar primer slide
    showSlide(0);

    // Auto-play slider
    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);

    // Pausar auto-play en hover
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        let autoPlayInterval;
        
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoPlayInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }, 5000);
        });
    }

    // Touch/swipe support para móviles
    initializeTouchControls();
}

function showSlide(n) {
    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;
    
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentSlide) {
            slide.classList.add('active');
        }
    });
    
    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentSlide) {
            dot.classList.add('active');
        }
    });
}

// Función global para los dots
window.currentSlide = function(n) {
    currentSlide = n - 1;
    showSlide(currentSlide);
};

function initializeTouchControls() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    let startX, startY, endX, endY;

    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    slider.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        handleSwipe();
    });

    function handleSwipe() {
        const diffX = startX - endX;
        const diffY = startY - endY;

        // Verificar que es un swipe horizontal
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe izquierda - siguiente slide
                currentSlide = (currentSlide + 1) % slides.length;
            } else {
                // Swipe derecha - slide anterior
                currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
            }
            showSlide(currentSlide);
        }
    }
}

// ===== EFECTOS DE SCROLL =====
function initializeScrollEffects() {
    // Smooth reveal de secciones
    const sections = document.querySelectorAll('section');
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        threshold: 0.15
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });

    // Efecto de typing en el hero title
    initializeTypingEffect();
}

function initializeTypingEffect() {
    const heroTitle = document.querySelector('.hero-title .gradient-text');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--primary-color)';

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Remover cursor después de completar
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 1000);
        }
    };

    // Iniciar después de un delay
    setTimeout(typeWriter, 500);
}

// ===== OPTIMIZACIONES DE PERFORMANCE =====
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== LAZY LOADING DE IMÁGENES =====
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', (e) => {
    console.warn('Error capturado:', e.error);
});

// ===== RESPONSIVE UPDATES =====
window.addEventListener('resize', debounce(() => {
    // Recrear partículas si cambia el tamaño de pantalla
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        particlesContainer.innerHTML = '';
        createParticles();
    }
}, 250));

// ===== PRELOADER (OPCIONAL) =====
function hidePreloader() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
}

// Ocultar preloader cuando todo esté cargado
window.addEventListener('load', hidePreloader);

// ===== CONFIGURACIÓN DE PERFORMANCE =====
// Reducir animaciones si el usuario lo prefiere
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-normal', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');
}

// ===== ANALYTICS Y TRACKING (OPCIONAL) =====
function trackUserInteraction(action, element) {
    // Aquí puedes agregar código de analytics
    console.log(`Interacción: ${action} en ${element}`);
}

// Trackear clics en botones importantes
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-primary')) {
        trackUserInteraction('click', 'primary-button');
    }
    if (e.target.closest('.whatsapp-float')) {
        trackUserInteraction('click', 'whatsapp-float');
    }
});

// ===== NOTIFICACIONES (OPCIONAL) =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        color: var(--light-color);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        border: 1px solid var(--glass-border);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== MODO OSCURO/CLARO (OPCIONAL) =====
function initializeThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ===== EXPORTAR FUNCIONES GLOBALES =====
window.TaxiMobile = {
    showSlide: showSlide,
    showNotification: showNotification,
    currentSlide: (n) => {
        currentSlide = n - 1;
        showSlide(currentSlide);
    }
};

// ===== LOG DE INICIALIZACIÓN =====
console.log('🚖 Taxi Móvil - Sitio web cargado correctamente');
console.log('✨ Todas las funcionalidades están activas');
