// skills.js - Minimal safe version
document.addEventListener('DOMContentLoaded', function() {
    initSkillAnimations();
});

function initSkillAnimations() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const targetWidth = skillBar.style.width;
                skillBar.style.setProperty('--target-width', targetWidth);
                skillBar.classList.add('animate');
            }
        });
    }, {
        threshold: 0.3
    });
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}