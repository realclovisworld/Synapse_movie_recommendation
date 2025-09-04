 // ================= EVENTS =================
    function onRowClick(e) {
      const btn = e.target.closest('button');
      const cardEl = e.target.closest('.card');
      if (!btn || !cardEl) return;
      const id = cardEl.dataset.id;
      const action = btn.dataset.action;
      if (action === 'details') openDetails(id);
      if (action === 'watch') addToWatchlist(id);
    }

    function setupStars(starEl, onRate) {
      starEl.innerHTML = '';
      for (let i = 1; i <= 5; i++) {
        const b = document.createElement('button');
        b.textContent = '★';
        b.setAttribute('data-val', i);
        b.addEventListener('mouseenter', () => paint(i));
        b.addEventListener('mouseleave', () => paint(current));
        b.addEventListener('click', () => { current = i; paint(i); onRate(i); });
        starEl.appendChild(b);
      }
      let current = 0;
      function paint(v) {
        [...starEl.children].forEach((el, idx) => el.style.opacity = idx < v ? 1 : .35);
      }
      paint(current);
    }

    