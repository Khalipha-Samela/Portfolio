// Main functionality for portfolio

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initThemeToggle();
    initSmoothScroll();
    initAnimations();
    initFormHandling();
    initCertificateLinks();
    initProgressBar();
    initTypingAnimation();
    initStatCounters();
    initLazyLoading();
    initSkillProficiency();
});

/* ===============================
   CONSTANTS
================================ */
const CONFIG = {
    typingSpeed: 50,
    statDuration: 2000,
    notificationDuration: 4000,
    formEndpoint: 'https://formspree.io/f/xpqwvryl' // Keep as backup
};

/* ===============================
   NAVIGATION
================================ */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navbar) return;

    // Scroll handling
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveLink();
    });

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            hamburger.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.classList.remove('menu-open');
            hamburger?.setAttribute('aria-expanded', 'false');
        });
    });

    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    link.removeAttribute('aria-current');
                    
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    }
                });
            }
        });
    }

    // Initial update
    updateActiveLink();
}

/* ===============================
   THEME TOGGLE
================================ */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const icon = toggle.querySelector('i');

    // Check system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || (systemPrefersDark ? 'dark' : 'light');

    // Apply theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);
    toggle.setAttribute('aria-pressed', savedTheme === 'dark');

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateIcon(newTheme);
            toggle.setAttribute('aria-pressed', newTheme === 'dark');
        }
    });

    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
        toggle.setAttribute('aria-pressed', newTheme === 'dark');

        // Announce theme change for screen readers
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.classList.add('sr-only');
        announcement.textContent = `${newTheme} mode activated`;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    });

    function updateIcon(theme) {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

/* ===============================
   SMOOTH SCROLL
================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const offset = target.getBoundingClientRect().top + window.pageYOffset - 80;

            window.scrollTo({
                top: offset,
                behavior: 'smooth'
            });

            // Update URL without jumping
            history.pushState(null, null, targetId);
        });
    });
}

/* ===============================
   SCROLL ANIMATIONS
================================ */
function initAnimations() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    document.querySelectorAll(
        '.skill-card-modern, .project-card, .contact-card-modern, .about-card, .testimonial-card, .blog-card'
    ).forEach(el => observer.observe(el));
}

/* ===============================
   READING PROGRESS BAR
================================ */
function initProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    if (!progressBar) {
        // Create progress bar if it doesn't exist
        const bar = document.createElement('div');
        bar.id = 'progress-bar';
        bar.className = 'progress-bar';
        document.body.appendChild(bar);
    }

    window.addEventListener('scroll', () => {
        const progressBar = document.getElementById('progress-bar');
        if (!progressBar) return;
        
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/* ===============================
   TYPING ANIMATION
================================ */
function initTypingAnimation() {
    const codeElement = document.querySelector('.window-content');
    if (!codeElement) return;

    const lines = Array.from(codeElement.querySelectorAll('.code-line'));
    if (lines.length === 0) return;
    
    let currentLine = 0;
    let currentChar = 0;
    
    // Store original text
    const originalTexts = lines.map(line => line.textContent);
    lines.forEach(line => (line.textContent = ''));

    function typeLine() {
        if (currentLine >= lines.length) return;

        const line = lines[currentLine];
        const text = originalTexts[currentLine];

        if (currentChar < text.length) {
            line.textContent += text.charAt(currentChar);
            currentChar++;
            setTimeout(typeLine, 50);
        } else {
            currentLine++;
            currentChar = 0;
            setTimeout(typeLine, 200);
        }
    }

    // Start typing when hero section is visible
    const heroObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(typeLine, 500);
                heroObserver.unobserve(entry.target);
            }
        });
    });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
}

/* ===============================
   STAT COUNTERS
================================ */
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const targetText = stat.getAttribute('data-target');
                if (!targetText) return;
                
                // Handle targets with + sign (like "2+")
                const hasPlus = stat.textContent.includes('+');
                const target = parseInt(targetText);
                
                if (!isNaN(target)) {
                    animateCounter(stat, target, hasPlus);
                }
                observer.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target, hasPlus = false) {
    let current = 0;
    const increment = target / 50; // Divide into 50 steps
    const stepTime = 2000 / 50; // 2 seconds divided by 50 steps

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (hasPlus ? '+' : '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
        }
    }, stepTime);
}

/* ===============================
   LAZY LOADING IMAGES
================================ */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    if (images.length === 0) return;
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

/* ===============================
   SKILL PROFICIENCY ANIMATION
================================ */
function initSkillProficiency() {
    const proficiencyBars = document.querySelectorAll('.proficiency-fill');
    if (proficiencyBars.length === 0) return;
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0%';
                
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
                
                observer.unobserve(bar);
            }
        });
    });

    proficiencyBars.forEach(bar => observer.observe(bar));
}

/* ===============================
   CONTACT FORM WITH EMAILJS (USING CONFIG)
================================ */

// Initialize EmailJS with config
(function initEmailJS() {
    // Check if config exists
    if (typeof EMAILJS_CONFIG !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY) {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('EmailJS initialized with config');
    } else {
        console.error('EmailJS config not found. Please check config.js');
    }
})();

function initFormHandling() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const charCount = document.getElementById('char-count');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');
    const errorMsg = document.getElementById('form-error');
    const contactNumber = document.getElementById('contact_number');
    const formDate = document.getElementById('form_date');

    // Set contact number and formatted time for the template
    if (contactNumber) {
        contactNumber.value = Math.random().toString(36).substring(2, 10);
    }
    
    if (formDate) {
        const now = new Date();
        // Format: "Mar 17, 2026, 2:30 PM" - matches your template's expected format
        formDate.value = now.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    // Character counter
    if (messageInput && charCount) {
        messageInput.addEventListener('input', () => {
            const count = messageInput.value.length;
            charCount.textContent = count;
            
            // Visual feedback when approaching limit
            if (count > 900) {
                charCount.style.color = 'var(--sunset)';
            } else if (count > 950) {
                charCount.style.color = 'var(--error)';
            } else {
                charCount.style.color = 'var(--text-tertiary)';
            }
            
            // Enforce max length
            if (count > 1000) {
                messageInput.value = messageInput.value.substring(0, 1000);
                charCount.textContent = '1000';
            }
        });
    }

    // Real-time validation with debounce
    let validationTimeout;
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            clearTimeout(validationTimeout);
            validationTimeout = setTimeout(() => validateField(nameInput, 'name'), 500);
        });
    }
    
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            clearTimeout(validationTimeout);
            validationTimeout = setTimeout(() => validateField(emailInput, 'email'), 500);
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('input', () => {
            clearTimeout(validationTimeout);
            validationTimeout = setTimeout(() => validateField(messageInput, 'message'), 500);
        });
    }

    // Blur validation (immediate)
    if (nameInput) nameInput.addEventListener('blur', () => validateField(nameInput, 'name'));
    if (emailInput) emailInput.addEventListener('blur', () => validateField(emailInput, 'email'));
    if (messageInput) messageInput.addEventListener('blur', () => validateField(messageInput, 'message'));

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check if EmailJS config exists
        if (typeof EMAILJS_CONFIG === 'undefined') {
            showNotification('Email service configuration error. Please try again later.', 'error');
            console.error('EMAILJS_CONFIG is not defined. Make sure config.js is loaded.');
            return;
        }

        // Hide previous messages
        if (successMsg) successMsg.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';

        // Validate all fields
        const isNameValid = validateField(nameInput, 'name');
        const isEmailValid = validateField(emailInput, 'email');
        const isMessageValid = validateField(messageInput, 'message');

        if (!isNameValid || !isEmailValid || !isMessageValid) {
            showNotification('Please fix the errors in the form', 'error');
            return;
        }

        // Disable form and show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Update time before sending - matches your template's {{time}} variable
            if (formDate) {
                const now = new Date();
                formDate.value = now.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
            }

            const now = new Date();

            // Match your template variables exactly
            const templateParams = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                subject: subjectInput ? subjectInput.value.trim() || 'New Message from Portfolio' : 'New Message from Portfolio',
                message: messageInput.value.trim(),

                date: now.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),

                time: now.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }),

                contact_number: contactNumber ? contactNumber.value : Date.now()
            };

            // Send email using EmailJS with config values
            const response = await emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.TEMPLATE_ID,
                templateParams
            );

            if (response.status === 200) {
                // Success
                if (successMsg) {
                    successMsg.style.display = 'flex';
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 5000);
                }

                form.reset();

                //Reset character count
                if (charCount) charCount.textContent = '0';
                
                // Generate new contact number for next message
                if (contactNumber) {
                    contactNumber.value = Math.random().toString(36).substring(2, 10);
                }
                
                // Update time for next submission
                if (formDate) {
                    const now = new Date();
                    formDate.value = now.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });
                }
                
                // Optional: Send auto-reply to user using their email
                if (EMAILJS_CONFIG.AUTO_REPLY_TEMPLATE_ID) {
                    await sendAutoReply(templateParams);
                }
            } else {
                throw new Error('Failed to send');
            }

        } catch (error) {
            console.error('EmailJS Error:', error);
            
            // Show error message
            if (errorMsg) {
                errorMsg.style.display = 'flex';
                setTimeout(() => {
                    errorMsg.style.display = 'none';
                }, 5000);
            }
            
            showNotification("Failed to send message. Please try again or email me directly.", "error");
        } finally {
            // Re-enable form
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

// Optional: Send auto-reply to user
async function sendAutoReply(userData) {
    try {
        // Only send if auto-reply template ID is configured
        if (!EMAILJS_CONFIG.AUTO_REPLY_TEMPLATE_ID) return;
        
        const autoReplyParams = {
            to_email: userData.email,           // User's email
            to_name: userData.name,              // User's name
            message: userData.message,           // Their message
            time: userData.time                   // Timestamp
        };
        
        await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.AUTO_REPLY_TEMPLATE_ID,
            autoReplyParams
        );
        
        console.log('Auto-reply sent to:', userData.email);
    } catch (error) {
        console.log('Auto-reply not sent (optional feature)');
    }
}

// Enhanced validation function
function validateField(input, fieldName) {
    if (!input) return true;
    
    const value = input.value.trim();
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    if (!errorElement) return true;

    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
        case 'name':
            if (value.length === 0) {
                isValid = false;
                errorMessage = 'Name is required';
            } else if (value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters';
            } else if (value.length > 50) {
                isValid = false;
                errorMessage = 'Name must be less than 50 characters';
            } else if (!/^[a-zA-Z\s\-']+$/.test(value)) {
                isValid = false;
                errorMessage = 'Name can only contain letters, spaces, hyphens and apostrophes';
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value.length === 0) {
                isValid = false;
                errorMessage = 'Email is required';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            } else if (value.length > 100) {
                isValid = false;
                errorMessage = 'Email is too long';
            }
            break;
            
        case 'message':
            if (value.length === 0) {
                isValid = false;
                errorMessage = 'Message is required';
            } else if (value.length < 10) {
                isValid = false;
                errorMessage = 'Message must be at least 10 characters';
            } else if (value.length > 1000) {
                isValid = false;
                errorMessage = 'Message must be less than 1000 characters';
            }
            break;
    }

    // Update UI
    if (!isValid) {
        input.classList.add('error');
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
        
        // Add shake animation for better UX
        input.style.animation = 'shake 0.3s ease';
        setTimeout(() => {
            input.style.animation = '';
        }, 300);
    } else {
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    return isValid;
}

/* ===============================
   CERTIFICATE LINKS
================================ */
function initCertificateLinks() {
    const links = document.querySelectorAll('.cert-link');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log("Certificate viewed:", link.textContent.trim());
            
            // You could also track this with analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'view_certificate', {
                    'certificate_name': link.textContent.trim()
                });
            }
        });

        // Add target blank for external links
        if (link.href.startsWith('http') && !link.href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

/* ===============================
   NOTIFICATIONS
================================ */
function showNotification(message, type = "success") {
    const container = document.getElementById('notification-container') || createNotificationContainer();
    
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'alert');
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}" aria-hidden="true"></i>
        <span>${message}</span>
    `;

    container.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove after duration
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, CONFIG.notificationDuration);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
    return container;
}

/* ===============================
   UTILITY: Add screen reader only class and animations
================================ */
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .btn.loading {
        pointer-events: none;
        opacity: 0.7;
    }
    
    .btn i.fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    .progress-bar {
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--teal), var(--sunset));
        z-index: 1000;
        transition: width 0.1s ease;
    }
`;
document.head.appendChild(style);