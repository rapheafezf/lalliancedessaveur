(function () {
  // Feuillages : sprite SVG partagé, injecté une fois par page
  fetch('sprite.svg').then(function (r) { return r.ok ? r.text() : ''; }).then(function (svg) {
    if (!svg) return;
    var holder = document.createElement('div');
    holder.setAttribute('aria-hidden', 'true');
    holder.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
    holder.innerHTML = svg;
    document.body.insertBefore(holder, document.body.firstChild);
  }).catch(function () {});

  // Menu mobile
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  var scrim = document.querySelector('.nav-scrim');
  function setMenu(open) {
    if (!btn || !nav) return;
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    document.body.classList.toggle('menu-open', open);
    if (scrim) scrim.hidden = !open;
  }
  if (btn && nav) {
    btn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    if (scrim) scrim.addEventListener('click', function () { setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 920) setMenu(false); });
  }

  // En-tête compact + bouton retour en haut
  var header = document.querySelector('.site-header');
  var toTop = document.querySelector('.to-top');
  function onScroll() {
    var y = window.scrollY || 0;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (toTop) toTop.hidden = y < 900;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // Visionneuse photo
  var lb = document.querySelector('.lightbox');
  var lbImg = lb && lb.querySelector('img');
  var lbCap = lb && lb.querySelector('figcaption');
  var lbClose = lb && lb.querySelector('.lb-close');
  var lastFocus = null;
  function openLb(img) {
    if (!lb) return;
    lastFocus = img;
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt;
    lb.hidden = false;
    document.body.classList.add('lb-open');
    lbClose.focus();
  }
  function closeLb() {
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    document.body.classList.remove('lb-open');
    if (lastFocus) lastFocus.focus();
  }
  Array.prototype.forEach.call(document.querySelectorAll('.gallery img, .dish img, .split-img img'), function (img) {
    img.setAttribute('data-zoom', '');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Agrandir la photo : ' + img.alt);
    img.addEventListener('click', function () { openLb(img); });
    img.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(img); } });
  });
  if (lb) {
    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    closeLb();
    if (nav && nav.classList.contains('open')) { setMenu(false); btn.focus(); }
  });

  // Onglets de la carte
  var tabs = Array.prototype.slice.call(document.querySelectorAll('[role="tab"]'));
  function select(id) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('aria-controls') === id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    try { history.replaceState(null, '', '#' + id); } catch (e) {}
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t.getAttribute('aria-controls')); });
    t.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      n.focus(); select(n.getAttribute('aria-controls'));
    });
  });
  var h = (location.hash || '').slice(1);
  if (h && document.getElementById(h) && document.getElementById(h).getAttribute('role') === 'tabpanel') select(h);

  // Formulaire de devis -> message WhatsApp pré-rempli vers le 06 25 37 20 63
  var WA = 'https://wa.me/33625372063';
  var form = document.getElementById('devis');
  var thanks = document.getElementById('merci');
  var send = document.getElementById('wa-send');
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function message() {
    var d = val('f-date');
    if (d) { var p = d.split('-'); if (p.length === 3) d = p[2] + '/' + p[1] + '/' + p[0]; }
    var lines = ['Bonjour, je vous contacte depuis votre site pour une demande de devis.', ''];
    var rows = [['Nom', val('f-nom')], ['E-mail', val('f-mail')], ['Téléphone', val('f-tel')], ['Date', d],
      ["Nombre d'invités", val('f-nb')], ['Prestation', val('f-presta')], ['Occasion', val('f-occ')], ['Envies / régimes', val('f-msg')]];
    rows.forEach(function (r) { if (r[1]) lines.push(r[0] + ' : ' + r[1]); });
    return lines.join('\n');
  }
  function refresh() { if (send) send.href = WA + '?text=' + encodeURIComponent(message()); }
  if (form && send) {
    form.addEventListener('input', refresh);
    form.addEventListener('change', refresh);
    refresh();
    send.addEventListener('click', function (e) {
      refresh();
      if (!form.checkValidity()) { e.preventDefault(); form.reportValidity(); return; }
      setTimeout(function () { form.hidden = true; if (thanks) { thanks.hidden = false; thanks.focus(); } }, 300);
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); send.click(); });
  }
  var again = document.getElementById('edit-again');
  if (again && form && thanks) again.addEventListener('click', function () { thanks.hidden = true; form.hidden = false; });

  // Copier le numéro
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (b) {
    b.addEventListener('click', function () {
      var txt = b.getAttribute('data-copy');
      var done = function () { var o = b.textContent; b.textContent = 'Copié'; setTimeout(function () { b.textContent = o; }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done).catch(function () {});
      }
    });
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  // Apparition au défilement
  if ('IntersectionObserver' in window) {
    var sel = '.sec-head, .card, .dish, .formule, .split-img, .split-text, .insp-list li, .values li, .steps li, .gallery img, .quote, .panel, .faq details, .info-list li';
    var vh = window.innerHeight;
    var groups = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var t = en.target;
          t.classList.add('in');
          io.unobserve(t);
          // rend la main aux effets de survol une fois l'apparition terminée
          setTimeout(function () { t.classList.remove('reveal', 'in'); t.style.removeProperty('--d'); }, 1300);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
      if (el.getBoundingClientRect().top < vh * 0.92) return; // déjà visible : on n'y touche pas
      var parent = el.parentElement;
      var i = groups.get(parent) || 0;
      groups.set(parent, i + 1);
      el.style.setProperty('--d', Math.min(i, 5) * 0.08 + 's');
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // Profondeur des feuillages (hero et bandeaux de page)
  var leaves = Array.prototype.slice.call(document.querySelectorAll('.hero .leaf, .page-hero .leaf'));
  leaves.forEach(function (l, i) { l.setAttribute('data-parallax', String(i % 2 ? 0.12 : -0.08)); });
  var ticking = false;
  function paint() {
    var y = window.scrollY || 0;
    if (y < 1200) leaves.forEach(function (l) { l.style.translate = '0 ' + (y * parseFloat(l.getAttribute('data-parallax'))).toFixed(1) + 'px'; });
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
})();

(function () {
  document.documentElement.lang = 'fr';

  // Toast
  var toast = document.querySelector('.toast');
  var tId;
  window.mmToast = function (msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(tId);
    tId = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  };

  // Barre de progression
  var bar = document.querySelector('.progress span');
  if (bar) {
    var tick = false;
    var upd = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty('--p', h > 0 ? Math.min(1, (window.scrollY || 0) / h).toFixed(3) : 0);
      tick = false;
    };
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  }

  // Fond doré tant que la photo charge
  Array.prototype.forEach.call(document.querySelectorAll('.card img, .dish img, .gallery img, .split-img img, .hero-visual img'), function (img) {
    var done = function () { img.classList.add('loaded'); };
    if (img.complete && img.naturalWidth) done(); else { img.addEventListener('load', done); img.addEventListener('error', done); }
  });

  // Filtre végétarien
  var veg = document.getElementById('veg-only');
  var note = document.getElementById('veg-note');
  if (veg) {
    veg.addEventListener('click', function () {
      var on = veg.getAttribute('aria-pressed') !== 'true';
      veg.setAttribute('aria-pressed', on ? 'true' : 'false');
      var n = 0;
      Array.prototype.forEach.call(document.querySelectorAll('[role="tabpanel"] .dish'), function (d) {
        var keep = !on || !!d.querySelector('.tag');
        d.classList.toggle('is-filtered', !keep);
        if (keep) n++;
      });
      if (note) note.textContent = on ? n + ' plats végétariens · les autres recettes peuvent souvent être adaptées' : '';
    });
  }

  // Confirmations en toast
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function (b) {
    b.addEventListener('click', function () { window.mmToast('Numéro copié : ' + b.getAttribute('data-copy')); });
  });
  var send = document.getElementById('wa-send');
  if (send) send.addEventListener('click', function () {
    var f = document.getElementById('devis');
    if (f && f.checkValidity()) window.mmToast('Votre message est prêt dans WhatsApp');
  });
})();
