// ================= DATA LOADERS =================
    async function loadTrending() {
      skeletonRow('row-trending');
      try {
        const { results } = await api(`/trending`);
        $('#trend-count').textContent = `${results?.length || 0} items`;
        renderRow('row-trending', results || []);
      } catch(e) { $('#trend-count').textContent = 'error'; toast('Failed to load trending', 'error'); }
    }

    async function loadRecs() {
      skeletonRow('row-recs');
      try {
        const params = {
          userId: state.userId,
          genres: [...state.filters.genres].join(','),
          minRating: state.filters.minRating
        };
        const data = await api(`/recommendations?${qs(params)}`);
        $('#rec-hint').textContent = `Using ${state.userId}`;
        renderRow('row-recs', data?.results || []);
      } catch(e) { toast('Failed to load recommendations', 'error'); }
    }

    const doSearch = debounce(async (q) => {
      if (!q) { $('#row-search').innerHTML = ''; $('#search-hint').textContent = 'Try typing above'; return; }
      $('#search-hint').textContent = 'Searching…'; skeletonRow('row-search', 6);
      try {
        const params = { q, genres: [...state.filters.genres].join(',') };
        const data = await api(`/search?${qs(params)}`);
        $('#search-hint').textContent = `${data?.results?.length || 0} found`;
        renderRow('row-search', data?.results || []);
      } catch(e) { $('#search-hint').textContent = 'error'; toast('Search failed', 'error'); }
    }, 350);
