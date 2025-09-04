
    // ================= HELPERS =================
    const $ = sel => document.querySelector(sel);
    const $$ = sel => document.querySelectorAll(sel);
    const toast = (msg, type = 'info') => {
      const el = $('#toast');
      el.textContent = msg;
      el.style.borderColor = type === 'error' ? 'rgba(239,68,68,.5)' : 'rgba(124,58,237,.45)';
      el.style.display = 'block';
      setTimeout(() => el.style.display = 'none', 2200);
    }
    const yearOf = d => d ? (d + '').slice(0,4) : '—';
    const img = path => path ? `${CONFIG.IMG_BASE}${path}` : 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22300%22><rect width=%22200%22 height=%22300%22 fill=%22%23111827%22/><text x=%2250%22 y=%22160%22 fill=%22%2394a3b8%22>no poster</text></svg>';
    const qs = params => Object.entries(params).filter(([,v]) => v !== undefined && v !== null && v !== '').map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');

    function withAuth(headers = {}) {
      if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
      return headers;
    }

    async function api(path, opts = {}) {
      const url = `${CONFIG.API_BASE}${path}`;
      const key = `${opts.method || 'GET'}:${url}:${opts.body || ''}`;
      if (state.cache.has(key)) return state.cache.get(key);
      const res = await fetch(url, { headers: withAuth({ 'Content-Type': 'application/json' }), ...opts });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json().catch(() => ({}));
      state.cache.set(key, data);
      return data;
    }

    