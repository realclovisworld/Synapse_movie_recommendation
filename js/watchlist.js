// ================= WATCHLIST =================
    function addToWatchlist(id) {
      if (!state.watchlist.includes(id)) {
        state.watchlist.push(id);
        localStorage.setItem('cs_watchlist', JSON.stringify(state.watchlist));
        toast('Added to watchlist ✓');
      } else {
        toast('Already in watchlist');
      }
    }

    function openWatchlist() {
      if (state.watchlist.length === 0) return toast('Your watchlist is empty');
      // fetch minimal movie data for each id (your API should support batch)
      Promise.all(state.watchlist.map(id => api(`/movies/${id}`)))
        .then(items => {
          $('#modal-title').textContent = 'Your Watchlist';
          $('#modal-year').textContent = '';
          const list = items.map(card).join('');
          $('#modal-poster').src = '';
          $('#modal-genres').textContent = '';
          $('#modal-overview').innerHTML = `<div class="row">${list}</div>`;
          $('#modal-stars').style.display = 'none';
          $('#modal-rating-text').textContent = '';
          $('#modal-add').style.display = 'none';
          $('#modal-open').style.display = 'none';
          modal.showModal();
        })
        .catch(() => toast('Failed to load watchlist', 'error'));
    }

    