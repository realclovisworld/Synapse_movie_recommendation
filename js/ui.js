
    // ================= UI RENDERERS =================
    function card(movie) {
      const genres = (movie.genre_names || movie.genres || []).slice(0,3).join(' • ');
      return `
        <article class="card" data-id="${movie.id}">
          <div class="poster">
            <img src="${img(movie.poster_path)}" alt="${movie.title}" loading="lazy"/>
            ${movie.vote_average ? `<span class="badge">★ ${movie.vote_average.toFixed(1)}</span>` : ''}
          </div>
          <div class="card-body">
            <div class="title">${movie.title || movie.name}</div>
            <div class="meta">
              <span>${yearOf(movie.release_date || movie.first_air_date)}</span>
              ${genres ? `<span>•</span><span>${genres}</span>` : ''}
            </div>
            <div class="actions">
              <button class="tiny brand" data-action="details">Details</button>
              <button class="tiny" data-action="watch">+ Watchlist</button>
            </div>
          </div>
        </article>`
    }

    function renderRow(id, items) {
      const row = document.getElementById(id);
      row.innerHTML = items.map(card).join('');
    }

    function skeletonRow(id, n = 8) {
      const row = document.getElementById(id);
      row.innerHTML = Array.from({length:n}).map(() => (
        `<div class="card">
          <div class="poster skeleton"></div>
          <div class="card-body">
            <div class="skeleton" style="height:16px; width:70%; border-radius:6px;"></div>
            <div class="skeleton" style="height:12px; width:50%; border-radius:6px;"></div>
            <div style="display:flex; gap:8px;">
              <div class="skeleton" style="height:34px; flex:1; border-radius:10px;"></div>
              <div class="skeleton" style="height:34px; flex:1; border-radius:10px;"></div>
            </div>
          </div>
        </div>`
      )).join('');
    }

   
