// Main JavaScript File
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initThemeToggle();
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initProjectModals();
    initSmoothScrolling();
    
    // Performance Optimization: Only run heavy particle canvas on large screens (desktop)
    if (window.innerWidth >= 768) {
        initParticleCanvas(); 
    }
});

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme or prefer color scheme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// Navigation
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-content');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('.form-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        if (!name || !email || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 2000);
    });
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: var(--border-radius);
            color: white;
            font-weight: 500;
            z-index: 1001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${type === 'success' ? 'var(--primary-color)' : '#ef4444'};
            box-shadow: var(--shadow);
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Project Modals
function initProjectModals() {
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectTitle = card.querySelector('.project-title').textContent;
            openProjectModal(projectTitle);
        });
    });
    
    modalClose.addEventListener('click', () => {
        closeModal();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    function openProjectModal(title) {
        // In a real implementation, you would fetch project data
        const projectData = getProjectData(title);
        
        const modalBody = document.querySelector('.modal-body');
        modalBody.innerHTML = `
            <h2>${projectData.title}</h2>
            <div class="project-meta">
                <span class="project-date">${projectData.date}</span>
                <div class="project-tech-modal">
                    ${projectData.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
            </div>
            <div class="project-description">
                <p>${projectData.description}</p>
                <h3>Features</h3>
                <ul>
                    ${projectData.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
            </div>
            <div class="project-links">
                <a href="${projectData.liveUrl}" class="btn btn-primary" target="_blank">View Live</a>
                <a href="${projectData.githubUrl}" class="btn btn-secondary" target="_blank">GitHub</a>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    function getProjectData(title) {
        // Mock data - replace with actual project data
        const projects = {
            'E-Commerce Platform': {
                title: 'E-Commerce Platform',
                date: '2023',
                tech: ['React', 'Node.js', 'MongoDB'],
                description: 'A modern online shopping experience with intuitive navigation and seamless checkout process.',
                features: [
                    'Product catalog with advanced filtering',
                    'Shopping cart and wishlist functionality',
                    'Secure payment processing',
                    'Order tracking and management'
                ],
                liveUrl: '#',
                githubUrl: '#'
            },
            'Task Management App': {
                title: 'Task Management App',
                date: '2023',
                tech: ['Vue.js', 'Express', 'PostgreSQL'],
                description: 'A collaborative tool for teams to organize projects and track progress in real-time.',
                features: [
                    'Real-time collaboration',
                    'Project timeline visualization',
                    'Team member assignment',
                    'Progress tracking and reporting'
                ],
                liveUrl: '#',
                githubUrl: '#'
            },
            'Weather Dashboard': {
                title: 'Weather Dashboard',
                date: '2022',
                tech: ['JavaScript', 'API Integration', 'Chart.js'],
                description: 'A beautiful interface for checking weather forecasts with interactive maps and detailed analytics.',
                features: [
                    'Location-based weather data',
                    '7-day forecast visualization',
                    'Interactive weather maps',
                    'Weather alert notifications'
                ],
                liveUrl: '#',
                githubUrl: '#'
            }
        };
        
        return projects[title] || projects['E-Commerce Platform'];
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 70;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Magnetic Cursor Effect
function initMagneticEffect() {
    const magneticItems = document.querySelectorAll('.btn, .skill-card, .project-card, .social-link');

    magneticItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            item.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translate(0, 0) scale(1)';
        });
    });
}

// Initialize magnetic effect
initMagneticEffect();

// Glowing Cursor Effect
function initGlowingCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('glow-cursor');
    document.body.appendChild(cursor);

    let cursorVisible = false;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
    });

    const hoverTargets = document.querySelectorAll('.btn, .skill-card, .project-card, .social-link');

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursorVisible = true;
            cursor.style.opacity = '0.8';
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });

        target.addEventListener('mouseleave', () => {
            cursorVisible = false;
            cursor.style.opacity = '0';
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// Initialize glow cursor
initGlowingCursor();

// Particle Background
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const numParticles = 70; // adjust for more or fewer
    const connectionDistance = 120;

    // Resize canvas dynamically
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Create particles
    for (let i = 0; i < numParticles; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary-color');

        // Draw particles
        for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < connectionDistance) {
                    ctx.strokeStyle = `rgba(99,102,241,${1 - dist / connectionDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        update();
        requestAnimationFrame(draw);
    }

    function update() {
        for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            // bounce at edges
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
    }

    draw();
}

initParticles();

}