/* Animations SVG : vapeur, étincelles, traits dessinés, pétales, cloche, drapeaux… */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };

  function svg(markup, cls, viewBox) {
    var el = document.createElementNS(NS, 'svg');
    el.setAttribute('viewBox', viewBox);
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('focusable', 'false');
    if (cls) el.setAttribute('class', cls);
    el.innerHTML = markup;
    return el;
  }
  function rand(a, b) { return a + Math.random() * (b - a); }

  var STAR = 'M0 -10C1.2 -2.6 2.6 -1.2 10 0C2.6 1.2 1.2 2.6 0 10C-1.2 2.6 -2.6 1.2 -10 0C-2.6 -1.2 -1.2 -2.6 0 -10Z';
  function sparkles(host, spots, cls) {
    var box = document.createElement('div');
    box.className = 'sparkles ' + (cls || '');
    box.setAttribute('aria-hidden', 'true');
    spots.forEach(function (p, i) {
      var s = svg('<path class="spark" d="' + STAR + '"/>', '', '-10 -10 20 20');
      s.style.cssText = 'left:' + p[0] + '%;top:' + p[1] + '%;width:' + Math.round(p[2] * 26) + 'px;--sd:' + (i * 0.7).toFixed(2) + 's';
      box.appendChild(s);
    });
    host.appendChild(box);
    return box;
  }

  // ---------- 1. Hero : vapeur, étincelles, soulignés pinceau ----------
  var hv = document.querySelector('.hero-visual');
  if (hv) {
    hv.appendChild(svg(
      '<g fill="none" stroke="#FFF6EC" stroke-width="3" stroke-linecap="round">' +
      '<path class="steam s1" pathLength="1" d="M30 118c-10-14 10-22 0-38s10-24 0-40"/>' +
      '<path class="steam s2" pathLength="1" d="M52 120c-12-16 12-24 0-42s12-26 0-44"/>' +
      '<path class="steam s3" pathLength="1" d="M74 118c-10-14 10-22 0-38s10-24 0-40"/></g>',
      'steam-svg', '0 0 104 124'));
    sparkles(hv, [[8, 12, .9], [92, 8, .7], [96, 52, 1], [4, 58, .6], [60, 4, .55], [44, 96, .75]], 'hero-sparks');
  }
  $$('.hero h1 .script, .page-hero > .wrap > .script').forEach(function (el, i) {
    el.classList.add('brushed');
    var u = svg('<path pathLength="1" d="M4 14C40 6 90 4 150 8s110 6 146-2"/><path pathLength="1" class="b2" d="M40 19c50-5 120-5 200-2"/>', 'brush', '0 0 300 24');
    u.setAttribute('preserveAspectRatio', 'none');
    u.style.setProperty('--bd', (0.5 + i * 0.35) + 's');
    el.appendChild(u);
  });
  $$('.page-hero').forEach(function (ph) {
    sparkles(ph, [[12, 22, .55], [86, 18, .7], [78, 80, .5], [20, 76, .65], [50, 10, .4]], 'page-sparks');
  });

  // ---------- 2. Fleuron doré sous les titres centrés ----------
  $$('.sec-head.center').forEach(function (h) {
    if (h.querySelector('.sunburst')) return;
    var f = svg(
      '<path class="draw" pathLength="1" d="M4 12h46c8 0 10-8 4-9s-8 7 0 9"/>' +
      '<path class="draw" pathLength="1" d="M156 12h-46c-8 0-10-8-4-9s8 7 0 9"/>' +
      '<path class="gem" d="M80 4l8 8-8 8-8-8z"/>', 'flourish', '0 0 160 24');
    var lead = h.querySelector('.lead');
    h.insertBefore(f, lead || null);
  });

  // ---------- 3. Pétales et épices qui flottent dans les bandeaux corail ----------
  var PETAL = 'M0 0C-6 -4 -9 -12 -5 -17C-3 -19 -1 -18 0 -17C1 -18 3 -19 5 -17C9 -12 6 -4 0 0Z';
  $$('.bg-coral').forEach(function (sec) {
    var H = Math.max(20, Math.round(100 * sec.offsetHeight / Math.max(1, sec.offsetWidth)));
    var k = 100 / Math.max(1, sec.offsetWidth); // unités SVG par pixel
    var g = '';
    for (var i = 0; i < 16; i++) {
      var petal = i % 3 !== 0;
      g += '<g class="drift" style="--x:' + rand(2, 98).toFixed(1) + ';--fall:' + (H + 8) + ';--dur:' + rand(12, 22).toFixed(1) + 's;--del:-' + rand(0, 20).toFixed(1) + 's;--rot:' + rand(-220, 220).toFixed(0) + 'deg">' +
        (petal ? '<path d="' + PETAL + '" fill="' + (i % 2 ? '#F6A88A' : '#FFD9C4') + '" transform="scale(' + (rand(14, 24) * k / 18).toFixed(3) + ')"/>'
               : '<circle r="' + (rand(2, 3.6) * k).toFixed(3) + '" fill="#F7D78F"/>') + '</g>';
    }
    var s = svg(g, 'petals', '0 0 100 ' + H);
    s.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    sec.insertBefore(s, sec.firstChild);
  });

  // ---------- 4. Cloche qui se soulève dans les bandeaux d'appel ----------
  $$('.cta-band .wrap > div:first-child').forEach(function (d) {
    d.insertBefore(svg(
      '<g fill="none" stroke="#FFF1DC" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path class="c-steam" d="M30 30c-4-5 4-8 0-13M40 28c-4-5 4-8 0-13M50 30c-4-5 4-8 0-13"/>' +
      '<g class="c-lid"><path d="M12 52a28 28 0 0 1 56 0z" fill="rgba(255,241,220,.12)"/><path d="M36 24h8"/><circle cx="40" cy="22" r="2.4" fill="#FFF1DC"/></g>' +
      '<path d="M6 56h68"/><path d="M14 56c2 4 6 6 10 6h32c4 0 8-2 10-6" opacity=".7"/></g>',
      'cloche', '0 0 80 66'), d.firstChild);
  });

  // ---------- 5. Étapes : chemin pointillé qui relie les numéros ----------
  var steps = document.querySelector('.steps');
  if (steps) {
    var p = svg('<path pathLength="100" d="M0 30C70 -6 130 66 200 30S330 -6 400 30"/>', 'steps-path', '0 0 400 60');
    p.setAttribute('preserveAspectRatio', 'none');
    steps.insertBefore(p, steps.firstChild);
    $$('.num', steps).forEach(function (n) {
      n.appendChild(svg('<circle cx="50" cy="50" r="46" pathLength="1"/>', 'num-ring', '0 0 100 100'));
    });
  }

  // ---------- 6. Bulle de remerciement : coche dessinée ----------
  var merci = document.getElementById('merci');
  if (merci) {
    merci.insertBefore(svg('<circle class="ck-c" cx="40" cy="40" r="34" pathLength="1"/><path class="ck-p" d="M25 41l10 10 21-22" pathLength="1"/>', 'check-anim', '0 0 80 80'), merci.firstChild);
  }

  // ---------- 7. Anneau autour du bouton WhatsApp ----------
  var wa = document.querySelector('.fab .wa');
  if (wa) wa.appendChild(svg('<rect x="1.5" y="1.5" width="97" height="37" rx="18.5" pathLength="1"/>', 'wa-ring', '0 0 100 40'));

  if (reduce) return; // tout ce qui suit ne fait que bouger

  // ---------- 8. Icônes qui se dessinent à l'apparition ----------
  var drawSel = '.values .ring svg, .hero-ticks svg, .regimes svg, .info-ico svg, .sunburst svg, .insp-list li:last-child svg, .flourish';
  var targets = $$(drawSel);
  targets.forEach(function (s, i) {
    $$('path, circle, ellipse, rect, line', s).forEach(function (el) {
      if (el.closest('clipPath') || el.classList.contains('gem')) return;
      var fill = el.getAttribute('fill') || getComputedStyle(el).fill;
      if (el.closest('.regimes') && el.tagName === 'circle') { el.classList.add('pop'); return; }
      el.setAttribute('pathLength', '1');
      el.classList.add('trace');
      if (fill && fill !== 'none') el.classList.add('trace-fill');
    });
    s.style.setProperty('--td', ((i % 5) * 0.12) + 's');
    s.classList.add('to-draw');
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('drawn'); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    targets.forEach(function (t) { io.observe(t); });
    if (steps) {
      var io2 = new IntersectionObserver(function (en) {
        if (en[0].isIntersecting) { steps.classList.add('drawn'); io2.disconnect(); }
      }, { threshold: 0.3 });
      io2.observe(steps);
    }
  } else {
    targets.forEach(function (t) { t.classList.add('drawn'); });
    if (steps) steps.classList.add('drawn');
  }

  // ---------- 9. Drapeaux qui ondulent, globe qui tourne (SMIL) ----------
  $$('.insp-list svg').forEach(function (s, i) {
    var g = s.querySelector('g[clip-path]');
    if (g) {
      var defs = s.querySelector('defs') || s.insertBefore(document.createElementNS(NS, 'defs'), s.firstChild);
      var id = 'wave' + i;
      defs.insertAdjacentHTML('beforeend',
        '<filter id="' + id + '" x="-10%" y="-10%" width="120%" height="120%">' +
        '<feTurbulence type="fractalNoise" baseFrequency="0.02 0.08" numOctaves="1" seed="' + (i + 3) + '" result="n">' +
        '<animate attributeName="baseFrequency" dur="5s" values="0.02 0.08;0.03 0.12;0.02 0.08" repeatCount="indefinite"/></feTurbulence>' +
        '<feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/></filter>');
      var inner = document.createElementNS(NS, 'g');
      inner.setAttribute('filter', 'url(#' + id + ')');
      while (g.firstChild) inner.appendChild(g.firstChild);
      g.appendChild(inner);
    }
    var e = s.querySelector('ellipse');
    if (e) {
      e.insertAdjacentHTML('afterend', '<ellipse cx="32" cy="32" rx="0" ry="18" fill="none" stroke="#1F3D2B" stroke-width="2"><animate attributeName="rx" dur="6s" values="0;18;0" begin="-3s" repeatCount="indefinite"/></ellipse>');
      e.innerHTML = '<animate attributeName="rx" dur="6s" values="18;0;18" repeatCount="indefinite"/>';
    }
  });

  // ---------- 10. Souris : les étincelles du hero suivent légèrement ----------
  if (hv && window.matchMedia('(pointer: fine)').matches) {
    var sp = hv.querySelector('.hero-sparks');
    hv.addEventListener('pointermove', function (ev) {
      var r = hv.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
      sp.style.translate = (x * 14).toFixed(1) + 'px ' + (y * 14).toFixed(1) + 'px';
    });
    hv.addEventListener('pointerleave', function () { sp.style.translate = '0 0'; });
  }
})();
