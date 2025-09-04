// ================= MODAL / DETAILS =================
    async function openDetails(id) {
      try {
        const m = await api(`/movies/${id}`);
        $('#modal-title').textContent = m.title;
        $('#modal-year').textContent = yearOf(m.release_date);
        $('#modal-poster').src = img(m.poster_path);
        $('#modal-genres').textContent = (m.genre_names || []).join(' • ');
        $('#modal-overview').textContent = m.overview || '—';
        $('#modal-stars').style.display = '';
        $('#modal-rating-text').textContent = '';
        $('#modal-add').style.display = '';
        $('#modal-open').style.display = '';
        $('#modal-open').onclick = () => window.open(`https://www.themoviedb.org/movie/${m.id}`, '_blank');
        $('#modal-add').onclick = () => addToWatchlist(m.id);
        setupStars($('#modal-stars'), async (val) => {
          try {
            await api(`/rate`, { method:'POST', body: JSON.stringify({ movieId: m.id, rating: val, userId: state.userId }) });
            $('#modal-rating-text').textContent = `You rated ${val}/5`;
            toast('Rating saved ✓');
            loadRecs();
          } catch(e) { toast('Failed to rate', 'error'); }
        });
        modal.showModal();
      } catch (e) {
        toast('Failed to load details', 'error');
      }
    }