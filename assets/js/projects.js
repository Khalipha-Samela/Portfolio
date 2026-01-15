// projects.js - Projects page functionality
document.addEventListener('DOMContentLoaded', function () {
    generateProjectCards(); // 🔥 Auto-generate featured projects
    initProjectFilter();
    initProjectModals();
});

/* ------------------------------------------
   ✅ 1. AUTO-GENERATE PROJECT CARDS
------------------------------------------- */
function generateProjectCards() {
    const projectContainer = document.getElementById("featured-projects");
    if (!projectContainer) return;

    let projects = Object.values(getAllProjects());

    const isHomePage = window.location.pathname.includes("index.html") || 
                       window.location.pathname === "/" ||
                       window.location.pathname === "/index";

    if (isHomePage) {
        projects = projects.slice(0, 3);
    }

    projectContainer.innerHTML = projects
        .map(project => `
            <div class="project-card" data-category="${project.category.toLowerCase()}">
                <div class="project-image">
                    <div class="image-placeholder" style="background: ${project.gradient}">
                        ${project.thumbnail ? `<img src="${project.thumbnail}" alt="${project.title} Screenshot">` : ''}
                    </div>
                    <div class="project-overlay">
                        <div class="project-links">
                            <a href="${project.githubUrl}" class="project-link" target="_blank">View Details</a>
                            <a href="${project.liveUrl}" class="project-link" target="_blank">Live Demo</a>
                        </div>
                    </div>
                </div>

                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.shortDescription}</p>
                    <div class="project-tech">
                        ${project.tech.slice(0, 3).map(t => `<span class="tech-tag">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `)
        .join('');
}

/* ------------------------------------------
   📌 Return ALL projects for card generation
------------------------------------------- */
function getAllProjects() {
    return {
        'Deadline Master': {
            title: 'Deadline Master',
            category: 'Web Development',
            date: '2025',
            gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
            thumbnail: 'assets/images/deadline-master-thumbnail.png', 
            shortDescription: 'A modern React-based productivity app for tracking assignments with live countdowns.',
            description: 'Deadline Master is a modern, React-based productivity application designed to help students and early-career professionals track assignments, manage priorities, and meet deadlines using real-time countdowns and a clean, responsive UI.',
            features: [
                'Live countdown timer with days, hours, minutes, seconds',
                'Priority levels (High, Medium, Low)',
                'Mark assignments as complete',
                'Edit and delete assignments',
                'Persistent storage using localStorage',
                'Visual deadline alerts (urgent, warning, overdue)',
                'Glassmorphism UI with smooth animations'
            ],
            tech: ['React', 'JavaScript (ES6+)', 'Tailwind CSS', 'Lucide React Icons', 'LocalStorage API'],
            liveUrl: 'https://deadline-master.netlify.app/', 
            githubUrl: 'https://github.com/Khalipha-Samela/Deadline-Master.git'
        },

        'MindGuard Journal': {
            title: 'MindGuard Journal',
            category: 'Full Stack',
            date: '2025',
            gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
            thumbnail: 'assets/images/mindguard-thumbnail.png',
            shortDescription: 'AI-powered trauma insight journal with secure authentication and emotional pattern analysis.',
            description: 'MindGuard Journal is a privacy-focused, AI-assisted journaling web application designed to help users reflect on their thoughts, understand emotional patterns, identify potential trauma triggers, and receive grounding techniques and coping strategies. Features secure Supabase authentication, user-specific data handling with Row Level Security, and a custom JavaScript analysis engine.',
            features: [
                'Secure user authentication with Supabase Auth',
                'AI-powered emotional pattern analysis (5 dimensions)',
                'Trauma trigger detection with intensity levels',
                'Personalized grounding techniques & coping strategies',
                'Dashboard with visual risk indicators',
                'Journal history with expandable entries',
                'Privacy-first design with user-scoped data',
                'Fully responsive modern UI/UX'
            ],
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Supabase', 'PostgreSQL', 'REST API'],
            liveUrl: 'https://mindguard-journal.netlify.app/login.html',
            githubUrl: 'https://github.com/Khalipha-Samela/MindGuard-Journal.git'
        },

        'Kings Escape': {
            title: 'Kings Escape',
            category: 'Full Stack',
            date: '2025',
            gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
            thumbnail: 'assets/images/Kings-Escape.png" width="100%"',
            shortDescription: 'A chess survival puzzle where you guide the king past enemy pieces.',
            description: 'The King\'s Escape is an interactive chess puzzle where players must navigate the king from (0,0) to (7,7) while enemies spawn after each move.',
            features: [
                'Interactive 8×8 chessboard',
                'Valid move highlighting',
                'Random enemy generation',
                'Win/lose detection',
                'Responsive layout',
                'AJAX PHP communication'
            ],
            tech: ['PHP', 'JavaScript', 'MySQL', 'HTML/CSS'],
            liveUrl: 'http://kingsescape.atwebpages.com/',
            githubUrl: 'https://github.com/Khalipha-Samela/Kings-Escape'
        },

        'Travelo': {
            title: 'Travelo',
            category: 'Web Development',
            date: '2025',
            gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
            thumbnail: 'assets/images/Travelo.png',
            shortDescription: 'Modern travel booking website with destinations, reviews, and gallery.',
            description: 'Travelo is a beautifully designed travel landing website featuring destinations, testimonials, galleries, and a full booking system.',
            features: [
                'Responsive travel landing page',
                'Beautiful hero section',
                'Destination showcase',
                'Testimonials + gallery',
                'Full vacation booking system',
                'Dark mode',
                'Mobile menu animation'
            ],
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
            liveUrl: 'https://travelo-omega.vercel.app/',
            githubUrl: 'https://github.com/Khalipha-Samela/PRODIGY_WD_01'
        },

        'Digital Stopwatch': {
            title: 'Digital Stopwatch',
            category: 'Web Development',
            date: '2025',
            gradient: 'linear-gradient(135deg, #ff9966, #ff5e62)',
            thumbnail: 'assets/images/stopwatch-thumbnail.png', 
            shortDescription: 'A modern digital stopwatch with lap tracking and millisecond precision.',
            description: 'A clean, responsive digital stopwatch built with HTML, CSS, and JavaScript. It supports lap tracking, millisecond timing, pause/resume, and a smooth UI.',
            features: [
                'Start, pause, reset controls',
                'Lap recording system',
                'Millisecond precision timing',
                'Responsive UI',
                'Clear lap history',
                'Smooth animations'
            ],
            tech: ['HTML', 'CSS', 'JavaScript'],
            liveUrl: 'https://stowatch-webapp.netlify.app/',     
            githubUrl: 'https://github.com/Khalipha-Samela/PRODIGY_WD_02.git'
        },

        'TicTacToe': {
            title: 'Tic-Tac-Toe',
            category: 'Web Development',
            date: '2025',
            gradient: 'linear-gradient(135deg, #6a11cb, #2575fc)',
            thumbnail: 'assets/images/TicTacToe.png', 
            shortDescription: 'A modern Tic-Tac-Toe game with PvP, PvC, score tracking, and symbol selection.',
            description: 'A fully interactive Tic-Tac-Toe game featuring Player vs Player (PvP) and Player vs Computer (PvC) modes. Includes smart AI opponent, score tracking, round resets, symbol selection, and a responsive layout.',
            features: [
                'Player vs Player mode',
                'Player vs Computer mode (simple AI)',
                'Symbol selection (X or O)',
                'Score tracking for X, O, and Draws',
                'Round reset and full game reset',
                'Responsive clean UI'
            ],
            tech: ['HTML', 'CSS', 'JavaScript'],
            liveUrl: 'https://modern-tic-tac-toe.netlify.app/',
            githubUrl: 'https://github.com/Khalipha-Samela/PRODIGY_WD_03.git'
        },

        'SA Weather App': {
            title: 'SA Weather App',
            category: 'Web Development',
            date: '2025',
            gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)',
            thumbnail: 'assets/images/sa-weather-thumbnail.png', 
            shortDescription: 'Live South African weather forecast with quick city buttons and 5-day forecast.',
            description: 'A real-time weather application built using HTML, CSS, and JavaScript. It fetches live South African weather conditions using the OpenWeatherMap API, provides quick-access city buttons, and displays a detailed multi-day forecast with icons and animations.',
            features: [
                'Live weather data using OpenWeatherMap API',
                'Quick city selection buttons',
                '5-day weather forecast',
                'Loading animation',
                'Responsive and mobile-friendly UI',
                'Detailed temperature, humidity, wind, and sky conditions'
            ],
            tech: ['HTML', 'CSS', 'JavaScript', 'OpenWeatherMap API'],
            liveUrl: 'https://sa-live-forecast.netlify.app/',
            githubUrl: 'https://github.com/Khalipha-Samela/PRODIGY_WD_05.git'
        },

        'Marathon Tracker': {
            title: 'Marathon Runner Progress Tracker',
            category: 'Full Stack',
            date: '2025',
            gradient: 'linear-gradient(135deg, #00c6ff, #0072ff)',
            thumbnail: 'assets/images/marathon-thumbnail.png', 
            shortDescription: 'A PHP-powered tool that calculates required speed, tracks marathon progress, and stores running history.',
            description: 'A complete PHP + JSON-based web application that helps marathon runners track their progress, calculate required speed, and view historical performance data. The app supports full calculations, stores race history, and features a live progress bar.',
            features: [
                'Distance + time progress tracking',
                'Required speed calculator',
                'JSON-based historical data storage',
                'Progress bar visualization',
                'Clear-history functionality',
                'Fully responsive UI'
            ],
            tech: ['PHP', 'HTML', 'CSS', 'JavaScript', 'JSON Storage'],
            liveUrl: 'http://maratonmaster.atwebpages.com/',
            githubUrl: 'https://github.com/Khalipha-Samela/Marathon-Tracker.git'
        },

        'Quiz Quest': {
            title: 'Quiz Quest: The Ultimate Trivia Challenge',
            category: 'Full Stack',
            date: '2025',
            gradient: 'linear-gradient(135deg, #3a7bd5, #00d2ff)',
            thumbnail: 'assets/images/quizquest-thumbnail.png',
            shortDescription: 'A full online trivia platform with quizzes, rounds, players, leaderboard, and scoring system.',
            description: 'Quiz Quest is a full-featured PHP & MySQL trivia game system. It includes quiz creation, rounds management, question assignment, player scoring, leaderboards, and real-time quiz play with UI transitions, timer, and animations.',
            features: [
                'Admin quiz creation panel',
                'Add rounds and questions dynamically',
                'Player quiz mode with timer',
                'Real-time scoring system',
                'Leaderboard with ranking',
                'Score search and update system',
                'Mobile-responsive UI',
                'Confetti celebration animations'
            ],
            tech: ['PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS'],
            liveUrl: 'http://quizquest.atwebpages.com/',   
            githubUrl: 'https://github.com/Khalipha-Samela/Quiz-Quest.git'
        }
    };
}

/* ------------------------------------------
   🔍 2. PROJECT FILTERS
------------------------------------------- */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category').includes(filter)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ------------------------------------------
   🪟 3. MODAL HANDLING
------------------------------------------- */
function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');

    document.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card');
        if (card && !e.target.closest('.project-link')) {
            const title = card.querySelector('.project-title').textContent.trim();
            openProjectModal(title);
        }
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function openProjectModal(title) {
    const projects = getAllProjects();
    const projectData = projects[title];
    const modalBody = document.querySelector('.modal-body');

    modalBody.innerHTML = `
        <div class="modal-project">
            <div class="modal-header">
                <h2>${projectData.title}</h2>
                <div class="modal-meta">
                    <span class="project-category">${projectData.category}</span>
                    <span class="project-date">${projectData.date}</span>
                </div>
            </div>

            <div class="modal-image">
                <div class="image-placeholder" style="background: ${projectData.gradient}">
                    ${projectData.thumbnail ? `<img src="${projectData.thumbnail}">` : ''}
                </div>
            </div>

            <div class="modal-content">
                <div class="project-description">
                    <h3>About the Project</h3>
                    <p>${projectData.description}</p>
                </div>

                <div class="project-details">
                    <div class="project-features">
                        <h3>Key Features</h3>
                        <ul>
                            ${projectData.features.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>

                    <div class="project-tech">
                        <h3>Technologies Used</h3>
                        <div class="tech-tags">
                            ${projectData.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="project-links">
                    <a href="${projectData.liveUrl}" class="btn btn-primary" target="_blank">View Live Project</a>
                    <a href="${projectData.githubUrl}" class="btn btn-secondary" target="_blank">View on GitHub</a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('project-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('project-modal').classList.remove('active');
    document.body.style.overflow = 'auto';
}