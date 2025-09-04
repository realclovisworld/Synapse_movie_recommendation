// ================= INIT =================
    const modal = document.getElementById('modal');
    modal.querySelector('.close').addEventListener('click', () => modal.close());

    function renderFilters() {
      const wrap = document.getElementById('filters');
      wrap.innerHTML = CONFIG.GENRES.map(g => `<button class="chip" data-id="${g.id}">${g.name}</button>`).join('');
      wrap.addEventListener('click', (e) => {
        const chip = e.target.closest('.chip'); if (!chip) return;
        const id = Number(chip.dataset.id);
        if (state.filters.genres.has(id)) state.filters.genres.delete(id); else state.filters.genres.add(id);
        chip.classList.toggle('active');
        loadRecs(); doSearch($('#q').value.trim());
      });
    }

    function bindEvents() {
      $('#row-trending').addEventListener('click', onRowClick);
      $('#row-recs').addEventListener('click', onRowClick);
      $('#row-search').addEventListener('click', onRowClick);

      $('#q').addEventListener('input', (e) => doSearch(e.target.value.trim()));
      $('#btn-refresh').addEventListener('click', () => { state.cache.clear(); loadTrending(); loadRecs(); doSearch($('#q').value.trim()); });
      $('#btn-surprise').addEventListener('click', async () => {
        try {
          const m = await api(`/surprise?userId=${encodeURIComponent(state.userId)}`);
          if (m?.id) openDetails(m.id); else toast('No surprise available');
        } catch(e) { toast('Failed to surprise', 'error'); }
      });
      $('#btn-watchlist').addEventListener('click', openWatchlist);
      $('#btn-login').addEventListener('click', async () => {
        const newId = prompt('Enter user ID (or email):', state.userId) || state.userId;
        state.userId = newId; localStorage.setItem('cs_user', newId);
        $('#user-label').textContent = newId;
        try {
          // optional: get token for protected routes
          const { token } = await api(`/auth/guest`, { method: 'POST', body: JSON.stringify({ userId: newId }) });
          if (token) { state.token = token; localStorage.setItem('cs_token', token); toast('Signed in ✓'); }
        } catch(_) {}
        loadRecs();
      });

      $('#minRating').addEventListener('input', (e) => {
        state.filters.minRating = Number(e.target.value); $('#minRatingVal').textContent = e.target.value; loadRecs(); doSearch($('#q').value.trim());
      });
    }

    async function start() {
      $('#user-label').textContent = state.userId;
      renderFilters();
      bindEvents();
      loadTrending();
      loadRecs();
    }

    start();