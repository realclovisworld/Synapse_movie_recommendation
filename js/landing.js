(async function() {
  const hero = document.getElementById("landing-hero");
  if (!hero) return;

  try {
    const res = await fetch(`${CONFIG.API_BASE}/trending`);
    const data = await res.json();
    const movies = data.results.slice(0, 5); // pick top 5 trending

    movies.forEach((movie, i) => {
      const slide = document.createElement("div");
      slide.className = "landing-slide" + (i === 0 ? " active" : "");
      slide.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

      const overlay = document.createElement("div");
      overlay.className = "landing-overlay";

      const content = document.createElement("div");
      content.className = "landing-content";
      content.innerHTML = `
        <h1>${movie.title}</h1>
        <p>${movie.overview.slice(0, 160)}...</p>
        <div class="landing-actions">
          <button class="btn brand" data-id="${movie.id}">Watch Trailer ▶</button>
          <button class="btn secondary" data-id="${movie.id}">Details ℹ</button>
        </div>
      `;

      slide.appendChild(overlay);
      slide.appendChild(content);
      hero.appendChild(slide);
    });

    // Auto-rotate slides
    let current = 0;
    setInterval(() => {
      const slides = document.querySelectorAll(".landing-slide");
      slides[current].classList.remove("active");
      current = (current + 1) % slides.length;
      slides[current].classList.add("active");
    }, 5000);

    // Hook buttons to modal
    hero.addEventListener("click", (e) => {
      if (e.target.matches(".btn.secondary")) {
        openModal(e.target.dataset.id); // your existing modal
      }
      if (e.target.matches(".btn.brand")) {
        window.open(`https://www.themoviedb.org/movie/${e.target.dataset.id}`, "_blank");
      }
    });

  } catch (err) {
    console.error("Landing hero error:", err);
  }
})();