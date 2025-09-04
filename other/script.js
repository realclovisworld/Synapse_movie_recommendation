// script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('recommend-form');
    const movieGrid = document.getElementById('movie-grid');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Collect selected genres
        const genresSelect = document.getElementById('genres');
        const selectedGenres = Array.from(genresSelect.selectedOptions).map(option => option.value);

        // Collect favorite movies
        const favoritesInput = document.getElementById('favorites');
        const favorites = favoritesInput.value.split(',').map(title => title.trim()).filter(title => title);

        // Prepare data for API
        const data = {
            genres: selectedGenres,
            favorites: favorites
        };

        try {
            // Assuming your Node.js server is running on localhost:3000
            // The backend should handle API calls to an AI/ML service (e.g., a recommendation engine)
            // and perhaps integrate with TMDB for movie details.
            const response = await fetch('http://localhost:3000/recommend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }

            const recommendations = await response.json();

            // Clear previous results
            movieGrid.innerHTML = '';

            // Display recommendations
            recommendations.forEach(movie => {
                const card = document.createElement('div');
                card.classList.add('movie-card');

                const img = document.createElement('img');
                // Assuming movie.poster_path from TMDB or similar
                img.src = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'placeholder.jpg';
                img.alt = movie.title;

                const title = document.createElement('h3');
                title.textContent = movie.title;

                const overview = document.createElement('p');
                overview.textContent = movie.overview ? movie.overview.substring(0, 100) + '...' : 'No description available.';

                card.appendChild(img);
                card.appendChild(title);
                card.appendChild(overview);

                movieGrid.appendChild(card);
            });
        } catch (error) {
            console.error('Error:', error);
            movieGrid.innerHTML = '<p>Sorry, something went wrong. Please try again.</p>';
        }
    });
});