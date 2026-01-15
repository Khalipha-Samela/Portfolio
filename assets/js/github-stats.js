// GitHub API integration
document.addEventListener('DOMContentLoaded', function() {
    // Replace with your GitHub username
    const GITHUB_USERNAME = 'Khalipha-Samela';
    const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
    
    // Update the stat number for projects
    function updateProjectCount(count) {
        const projectStat = document.querySelector('.about-stats .stat:first-child .stat-number');
        if (projectStat) {
            projectStat.textContent = count;
        }
    }
    
    // Function to fetch all repositories (including paginated results)
    async function fetchAllRepos() {
        let allRepos = [];
        let page = 1;
        const perPage = 100; // Max per page
        
        try {
            while (true) {
                const response = await fetch(`${GITHUB_API_URL}?per_page=${perPage}&page=${page}&sort=updated`);
                
                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`);
                }
                
                const repos = await response.json();
                
                if (repos.length === 0) {
                    break;
                }
                
                allRepos = allRepos.concat(repos);
                page++;
                
                // If we got fewer than perPage, we've reached the end
                if (repos.length < perPage) {
                    break;
                }
            }
            
            // Filter out forked repositories if you only want your own projects
            const ownRepos = allRepos.filter(repo => !repo.fork);
            
            // Update the count
            updateProjectCount(ownRepos.length);
            
            // Optional: Log the repositories (for debugging)
            console.log(`Total repositories found: ${allRepos.length}`);
            console.log(`Own repositories: ${ownRepos.length}`);
            
        } catch (error) {
            console.error('Error fetching GitHub data:', error);
            
            // Fallback to a default value or show an error
            updateProjectCount('50+');
            
            // Optional: Show a message in the console
            const projectStat = document.querySelector('.about-stats .stat:first-child');
            if (projectStat) {
                projectStat.innerHTML = `
                    <span class="stat-number">50+</span>
                    <span class="stat-label">Projects on GitHub</span>
                `;
            }
        }
    }
    
    // Fetch GitHub data
    fetchAllRepos();
});