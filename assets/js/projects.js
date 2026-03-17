// Load projects from JSON and handle project UI

document.addEventListener("DOMContentLoaded", () => {
    generateProjectCards();
    initProjectFilter();
    initProjectModals();
});

// State management
let allProjects = [];
let displayedProjects = 0;
const INITIAL_DISPLAY_COUNT = 4;
const LOAD_MORE_COUNT = 2; // Load 2 more at a time

/* ------------------------------------------
   1. FETCH PROJECT DATA FROM JSON
------------------------------------------- */

async function loadProjects() {
    try {
        // Check if we already loaded projects
        if (allProjects.length > 0) {
            return allProjects;
        }
        
        const response = await fetch("data/projects.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProjects = await response.json();
        return allProjects;
    } catch (error) {
        console.error("Error loading projects:", error);
        showNotification("Failed to load projects. Please refresh the page.", "error");
        return [];
    }
}

/* ------------------------------------------
   2. GENERATE PROJECT CARDS (ENHANCED)
------------------------------------------- */

async function generateProjectCards(loadMore = false) {
    const projectContainer = document.getElementById("featured-projects");
    if (!projectContainer) return;

    const projects = await loadProjects();
    
    if (projects.length === 0) {
        projectContainer.innerHTML = `
            <div class="projects-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>No projects found.</p>
                <button onclick="generateProjectCards()" class="btn btn-outline">Try Again</button>
            </div>
        `;
        return;
    }

    // Determine how many projects to show
    if (!loadMore) {
        // Initial load - show first 4
        displayedProjects = Math.min(INITIAL_DISPLAY_COUNT, projects.length);
    } else {
        // Load more - add LOAD_MORE_COUNT to displayed count
        displayedProjects = Math.min(
            displayedProjects + LOAD_MORE_COUNT, 
            projects.length
        );
    }

    const projectsToShow = projects.slice(0, displayedProjects);
    
    // Check if this is a "load more" action
    const isLoadMore = loadMore && projectContainer.children.length > 0;
    
    if (!isLoadMore) {
        // First time loading - render all cards
        projectContainer.innerHTML = renderProjectCards(projectsToShow);
    } else {
        // Append new cards
        const newProjects = projects.slice(displayedProjects - LOAD_MORE_COUNT, displayedProjects);
        const newCardsHTML = renderProjectCards(newProjects);
        
        // Create temporary container to parse HTML
        const temp = document.createElement('div');
        temp.innerHTML = newCardsHTML;
        
        // Add new cards with animation class
        Array.from(temp.children).forEach(card => {
            card.classList.add('new-card');
            projectContainer.appendChild(card);
        });
        
        // Smooth scroll to first new card
        setTimeout(() => {
            const firstNewCard = projectContainer.children[projectContainer.children.length - newProjects.length];
            if (firstNewCard) {
                firstNewCard.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest',
                    inline: 'nearest'
                });
            }
        }, 100);
    }

    // Add keyboard accessibility to all cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProjectModal(card.dataset.project);
            }
        });
    });

    // Update the load more button
    updateLoadMoreButton(projects.length);
}

/* ------------------------------------------
   3. RENDER PROJECT CARDS (HELPER)
------------------------------------------- */

function renderProjectCards(projects) {
    return projects.map(project => `
        <div class="project-card" 
             data-project="${project.title}"
             data-category="${project.category.toLowerCase()}"
             role="listitem"
             tabindex="0"
             aria-label="${project.title} project">
            
            <div class="project-image">
                <div class="image-placeholder" style="background:${project.gradient || 'linear-gradient(135deg, var(--teal), var(--ocean-dark))'}">
                    ${project.thumbnail ? 
                        `<img src="${project.thumbnail}" 
                              alt="${project.title} screenshot"
                              loading="lazy">` : 
                        `<span class="project-icon">${getProjectIcon(project.category)}</span>`
                    }
                </div>

                <div class="project-overlay">
                    <div class="project-links">
                        ${project.githubUrl ? 
                            `<a href="${project.githubUrl}" 
                                class="project-link" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="View code for ${project.title}">
                                <i class="fab fa-github"></i> Code
                            </a>` : ''
                        }
                        ${project.liveUrl ? 
                            `<a href="${project.liveUrl}" 
                                class="project-link" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                aria-label="View live demo of ${project.title}">
                                <i class="fas fa-external-link-alt"></i> Live
                            </a>` : ''
                        }
                    </div>
                </div>
            </div>

            <div class="project-info">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.shortDescription || project.description.substring(0, 100) + '...'}</p>
                
                <div class="project-tech">
                    ${project.tech.slice(0, 4).map(t => `
                        <span class="tech-tag">${t}</span>
                    `).join("")}
                    ${project.tech.length > 4 ? `<span class="tech-tag">+${project.tech.length - 4}</span>` : ''}
                </div>

                ${project.featured ? `<span class="featured-badge"><i class="fas fa-star"></i> Featured</span>` : ''}
            </div>
        </div>
    `).join("");
}

/* ------------------------------------------
   4. UPDATE LOAD MORE BUTTON
------------------------------------------- */

function updateLoadMoreButton(totalProjects) {
    const footer = document.getElementById('projects-footer');
    if (!footer) return;

    const hasMoreToLoad = displayedProjects < totalProjects;

    if (hasMoreToLoad) {
        footer.innerHTML = `
            <div class="load-more-container">
                <button class="btn btn-outline btn-large load-more-btn" id="loadMoreBtn">
                    Load More Projects <i class="fas fa-arrow-down"></i>
                    <span class="projects-count" style="display: block; margin-top: 0.5rem; font-size: 0.8rem;">
                        Showing ${displayedProjects} of ${totalProjects} projects
                    </span>
                </button>
            </div>
        `;

        const loadMoreBtn = document.getElementById('loadMoreBtn');
        loadMoreBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Add loading state
            loadMoreBtn.classList.add('loading');
            const originalHtml = loadMoreBtn.innerHTML;
            loadMoreBtn.innerHTML = 'Loading... <i class="fas fa-spinner"></i>';
            
            // Load more projects
            await generateProjectCards(true);
            
            // Remove loading state
            loadMoreBtn.classList.remove('loading');
            
            // Update button or remove if no more projects
            if (displayedProjects >= totalProjects) {
                footer.innerHTML = `
                    <div class="no-more-projects">
                        <i class="fas fa-check-circle"></i> All ${totalProjects} projects loaded
                    </div>
                `;
            } else {
                loadMoreBtn.innerHTML = originalHtml;
            }
        });
    } else {
        footer.innerHTML = `
            <div class="no-more-projects">
                <i class="fas fa-check-circle"></i> All ${totalProjects} projects loaded
            </div>
        `;
    }
}

/* ------------------------------------------
   5. PROJECT FILTERS
------------------------------------------- */

function initProjectFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const projectContainer = document.getElementById("featured-projects");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            // Update active button
            filterBtns.forEach(b => {
                b.classList.remove("active");
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add("active");
            btn.setAttribute('aria-selected', 'true');

            const filter = btn.getAttribute("data-filter");
            
            // Reset displayed count when filtering
            displayedProjects = INITIAL_DISPLAY_COUNT;
            
            // Reload projects with filter
            await filterProjects(filter);
        });
    });
}

async function filterProjects(filter) {
    const projects = await loadProjects();
    const projectContainer = document.getElementById("featured-projects");
    const footer = document.getElementById('projects-footer');
    
    let filteredProjects = projects;
    if (filter !== "all") {
        filteredProjects = projects.filter(p => 
            p.category.toLowerCase().includes(filter)
        );
    }
    
    // Show only first 4 of filtered results
    const projectsToShow = filteredProjects.slice(0, INITIAL_DISPLAY_COUNT);
    displayedProjects = Math.min(INITIAL_DISPLAY_COUNT, filteredProjects.length);
    
    projectContainer.innerHTML = renderProjectCards(projectsToShow);
    
    // Update footer based on filtered results
    if (filteredProjects.length > INITIAL_DISPLAY_COUNT) {
        footer.innerHTML = `
            <div class="load-more-container">
                <button class="btn btn-outline btn-large load-more-btn" id="loadMoreFilteredBtn">
                    Load More in "${filter}" <i class="fas fa-arrow-down"></i>
                    <span class="projects-count" style="display: block; margin-top: 0.5rem;">
                        Showing ${INITIAL_DISPLAY_COUNT} of ${filteredProjects.length} projects
                    </span>
                </button>
            </div>
        `;
        
        document.getElementById('loadMoreFilteredBtn').addEventListener('click', () => {
            loadMoreFiltered(filter, filteredProjects);
        });
    } else {
        footer.innerHTML = `
            <div class="no-more-projects">
                <i class="fas fa-check-circle"></i> Showing all ${filteredProjects.length} projects in "${filter}"
            </div>
        `;
    }
}

function loadMoreFiltered(filter, filteredProjects) {
    const projectContainer = document.getElementById("featured-projects");
    const footer = document.getElementById('projects-footer');
    
    const nextBatch = filteredProjects.slice(
        displayedProjects, 
        displayedProjects + LOAD_MORE_COUNT
    );
    
    displayedProjects = Math.min(
        displayedProjects + LOAD_MORE_COUNT, 
        filteredProjects.length
    );
    
    // Append new cards
    const temp = document.createElement('div');
    temp.innerHTML = renderProjectCards(nextBatch);
    
    Array.from(temp.children).forEach(card => {
        card.classList.add('new-card');
        projectContainer.appendChild(card);
    });
    
    // Update footer
    if (displayedProjects >= filteredProjects.length) {
        footer.innerHTML = `
            <div class="no-more-projects">
                <i class="fas fa-check-circle"></i> All ${filteredProjects.length} projects in "${filter}" loaded
            </div>
        `;
    }
}

function getProjectIcon(category) {
    const icons = {
        'react': '⚛️',
        'full stack': '🖥️',
        'web development': '🌐',
        'mobile': '📱'
    };
    return icons[category.toLowerCase()] || '💻';
}

/* ------------------------------------------
   6. PROJECT MODALS
------------------------------------------- */

function initProjectModals() {
    const modal = document.getElementById("project-modal");
    const modalClose = document.querySelector(".modal-close");

    if (!modal || !modalClose) return;

    // Open modal on card click
    document.addEventListener("click", async (e) => {
        const card = e.target.closest(".project-card");
        if (card && !e.target.closest(".project-link")) {
            const projectTitle = card.dataset.project;
            await openProjectModal(projectTitle);
        }
    });

    // Close modal handlers
    modalClose.addEventListener("click", closeModal);
    
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

async function openProjectModal(title) {
    const projects = await loadProjects();
    const project = projects.find(p => p.title === title);
    
    if (!project) return;

    const modal = document.getElementById("project-modal");
    const modalBody = document.querySelector(".modal-body");

    modalBody.innerHTML = `
        <div class="modal-project">
            <div class="modal-header">
                <h2 id="modal-title">${project.title}</h2>
                <div class="modal-meta">
                    <span class="project-category">${project.category}</span>
                    <span class="project-date">${project.date}</span>
                    ${project.featured ? '<span class="featured-badge"><i class="fas fa-star"></i> Featured</span>' : ''}
                </div>
            </div>

            <div class="modal-image">
                <div class="image-placeholder" style="background:${project.gradient || 'linear-gradient(135deg, var(--teal), var(--ocean-dark))'}">
                    ${project.thumbnail ? 
                        `<img src="${project.thumbnail}" alt="${project.title}">` : 
                        `<span style="font-size: 4rem;">${getProjectIcon(project.category)}</span>`
                    }
                </div>
            </div>

            <div class="modal-content">
                <div class="project-description">
                    <h3>About the Project</h3>
                    <p>${project.description}</p>
                </div>

                <div class="project-details">
                    <div class="project-features">
                        <h3>Key Features</h3>
                        <ul>
                            ${project.features ? project.features.map(f => `
                                <li>${f}</li>
                            `).join("") : '<li>Feature list coming soon</li>'}
                        </ul>
                    </div>

                    <div class="project-tech-details">
                        <h3>Technologies Used</h3>
                        <div class="tech-tags">
                            ${project.tech.map(t => `
                                <span class="tech-tag">${t}</span>
                            `).join("")}
                        </div>
                    </div>
                </div>

                ${project.challenges ? `
                    <div class="project-challenges">
                        <h3>Challenges & Solutions</h3>
                        <p>${project.challenges}</p>
                    </div>
                ` : ''}

                <div class="project-links" style="display: flex; gap: var(--space-sm); margin-top: var(--space-xl);">
                    ${project.liveUrl ? `
                        <a href="${project.liveUrl}" 
                           class="btn btn-primary" 
                           target="_blank" 
                           rel="noopener noreferrer">
                           <i class="fas fa-external-link-alt"></i> View Live Project
                        </a>
                    ` : ''}

                    ${project.githubUrl ? `
                        <a href="${project.githubUrl}" 
                           class="btn btn-secondary" 
                           target="_blank" 
                           rel="noopener noreferrer">
                           <i class="fab fa-github"></i> View on GitHub
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    modal.classList.add("active");
    document.body.style.overflow = "hidden";
    modal.setAttribute('aria-hidden', 'false');
    
    // Set focus to modal for accessibility
    modal.focus();
}

function closeModal() {
    const modal = document.getElementById("project-modal");
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    modal.setAttribute('aria-hidden', 'true');
}