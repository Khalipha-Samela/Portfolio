document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFormSelects();
});

function initContactForm() {
    const contactForm = document.getElementById('contact-page-form');
    const submitBtn = contactForm.querySelector('.form-submit');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const projectType = document.getElementById('project-type').value;
        const message = document.getElementById('message').value;
        
        if (!firstName || !lastName || !email || !subject || !projectType || !message) {
            showNotification('Please fill in all required fields', 'error');
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
            showNotification('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
            contactForm.reset();
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 2000);
    });
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

function initFormSelects() {
    const selects = document.querySelectorAll('select');
    
    selects.forEach(select => {
        const formGroup = select.closest('.form-group');
        
        select.addEventListener('focus', () => {
            formGroup.classList.add('focused');
        });
        
        select.addEventListener('blur', () => {
            if (select.value === '') {
                formGroup.classList.remove('focused');
            }
        });
        
        // Check initial state
        if (select.value !== '') {
            formGroup.classList.add('focused');
        }
        
        // Update on change
        select.addEventListener('change', () => {
            if (select.value !== '') {
                formGroup.classList.add('focused');
            } else {
                formGroup.classList.remove('focused');
            }
        });
    });
}

function showNotification(message, type) {
    // Reuse the notification function from main script
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        // Fallback notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: var(--border-radius);
            color: white;
            font-weight: 500;
            z-index: 1001;
            background: ${type === 'success' ? 'var(--primary-color)' : '#ef4444'};
            box-shadow: var(--shadow);
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}