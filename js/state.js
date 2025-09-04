// ================= STATE =================
    const state = {
      userId: localStorage.getItem('cs_user') || CONFIG.DEFAULT_USER,
      token: localStorage.getItem('cs_token') || null,
      watchlist: JSON.parse(localStorage.getItem('cs_watchlist') || '[]'),
      filters: { genres: new Set(), minRating: 0 },
      cache: new Map(),
    };