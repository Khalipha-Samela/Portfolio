// certificates.js - Certificates page functionality
document.addEventListener('DOMContentLoaded', function() {
    initCertificateCards();
    initProgressBars();
});

function initCertificateCards() {
    const certificateCards = document.querySelectorAll('.certificate-card');
    
    certificateCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.closest('.btn')) {
                const title = this.querySelector('.certificate-title').textContent;
                const issuer = this.querySelector('.certificate-issuer').textContent;
                
                // Create a simple modal for certificate view
                const modal = document.createElement('div');
                modal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 2000;
                `;
                
                modal.innerHTML = `
                    <div style="background: var(--surface); padding: 30px; border-radius: var(--border-radius); max-width: 500px; text-align: center;">
                        <h3 style="color: var(--text-primary); margin-bottom: 15px;">${title}</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 20px;">Issued by: ${issuer}</p>
                        <p style="color: var(--text-light); margin-bottom: 20px; font-size: 0.9rem;">This is a preview. For the complete certificate, please contact me directly or check the verification links provided.</p>
                        <button onclick="this.parentElement.parentElement.remove()" class="btn btn-primary">Close</button>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                // Close modal when clicking outside
                modal.addEventListener('click', function(e) {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });
            }
        });
    });
}

function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
    });
}