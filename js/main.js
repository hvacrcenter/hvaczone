/* HVAC Zone — interactions
   theme toggle, mobile nav, scroll header, category filter */

(function () {
  var root = document.documentElement;

  /* ---- Theme ---- */
  var toggle = document.querySelector('[data-theme-toggle]');
  var theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  paintToggle(theme);

  function paintToggle(t) {
    if (!toggle) return;
    toggle.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' mode');
    toggle.innerHTML =
      t === 'dark'
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      paintToggle(theme);
    });
  }

  /* ---- Scroll header ---- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile nav ---- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Category filter + search (hub page) ---- */
  var filterRoot = document.querySelector('[data-filter]');
  if (filterRoot) {
    var pills = filterRoot.querySelectorAll('.pill');
    var cards = document.querySelectorAll('.article-grid [data-cat]');
    var empty = document.querySelector('[data-empty]');
    var input = document.getElementById('hub-search-input');
    var clearBtn = document.querySelector('.hub-search__clear');
    var status = document.querySelector('[data-search-status]');
    var activeCat = 'all';
    var SYN = { 'ac': 'air conditioner', 'a c': 'air conditioner', 'aircon': 'air conditioner', 'minisplit': 'mini split', 'heatpump': 'heat pump', 'iaq': 'indoor air quality', 'erv': 'energy recovery', 'hrv': 'heat recovery' };
    var norm = function (s) { return (s || '').toLowerCase().replace(/[-_/.,()]+/g, ' ').replace(/\s+/g, ' ').trim(); };
    cards.forEach(function (card) {
      var base = card.getAttribute('data-search') || card.textContent;
      card._search = ' ' + norm(base) + ' ' + norm(base).replace(/ /g, '') + ' ';
    });
    var apply = function () {
      var q = input ? norm(input.value) : '';
      var words = q ? q.split(' ') : [];
      var shown = 0;
      cards.forEach(function (card) {
        var catOk = activeCat === 'all' || card.getAttribute('data-cat') === activeCat;
        var textOk = words.every(function (w) {
          var alt = SYN[w];
          var hit = w.length <= 3 ? card._search.indexOf(' ' + w + ' ') !== -1 || card._search.indexOf(' ' + w + 's ') !== -1 : card._search.indexOf(w) !== -1;
          return hit || (alt && card._search.indexOf(alt) !== -1);
        });
        var match = catOk && textOk;
        card.style.display = match ? '' : 'none';
        card.classList.toggle('card--feature', !q && activeCat === 'all' && card === cards[0]);
        if (match) shown++;
      });
      if (empty) empty.style.display = shown === 0 ? '' : 'none';
      if (clearBtn) clearBtn.hidden = !q;
      if (status) status.textContent = q ? (shown + (shown === 1 ? ' article' : ' articles') + ' found for "' + input.value.trim() + '"') : '';
    };
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        activeCat = pill.getAttribute('data-cat');
        pills.forEach(function (p) { p.classList.toggle('is-active', p === pill); });
        apply();
      });
    });
    if (input) {
      input.addEventListener('input', apply);
      var params = new URLSearchParams(window.location.search);
      if (params.get('q')) { input.value = params.get('q'); apply(); }
    }
    if (clearBtn) clearBtn.addEventListener('click', function () { input.value = ''; apply(); input.focus(); });
  }

  /* ---- Newsletter (demo, no backend) ---- */
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button');
      var note = form.querySelector('.newsletter-note');
      if (btn) {
        var orig = btn.textContent;
        btn.textContent = 'Subscribed ✓';
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = orig;
          btn.disabled = false;
        }, 2600);
      }
      if (note) note.textContent = 'This is a preview — email delivery connects once your list/ESP is wired up.';
      form.reset();
    });
  });
})();
