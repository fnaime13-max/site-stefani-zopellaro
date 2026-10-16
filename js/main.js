/* =========================================================
   Stefani Rafaeli Zopellaro · Nutricionista
   Comportamento da página
   ========================================================= */
(function () {
  'use strict';

  /* ---------- CONFIGURAÇÃO ----------
     WhatsApp da profissional: código do país + DDD + número, só dígitos.
     Exemplo: 5511999999999 */
  var WHATSAPP_NUMBER = '5500000000000';

  /* Duração do preloader: exatamente 3 segundos. */
  var PRELOADER_MS = 3000;

  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  /* =======================================================
     Preloader
     ======================================================= */
  var preloader = document.getElementById('preloader');
  var counter = document.getElementById('preloader-count');
  var t0 = performance.now();

  function tick(now) {
    var p = Math.min(1, (now - t0) / (PRELOADER_MS - 300));
    var eased = 1 - Math.pow(1 - p, 3);
    if (counter) counter.textContent = Math.round(eased * 100) + '%';
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  window.setTimeout(function () {
    body.classList.remove('is-loading');
    if (preloader) {
      preloader.classList.add('is-done');
      window.setTimeout(function () { preloader.remove(); }, 1100);
    }
    startReveal();
    startBotany();
    startLeaves();
  }, PRELOADER_MS);

  /* =======================================================
     Reveal ao rolar
     ======================================================= */
  function startReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    var heroIndex = 0;
    items.forEach(function (el) {
      /* entrada escalonada no hero */
      if (el.closest('.hero')) el.style.transitionDelay = (heroIndex++ * 110) + 'ms';
      io.observe(el);
    });
  }

  /* =======================================================
     Header e menu mobile
     ======================================================= */
  var header = document.getElementById('header');
  function onScroll() { header.classList.toggle('is-stuck', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var brandMark = document.querySelector('.brand__mark');
  var MARK_GREEN = './assets/monograma-verde.png';
  var MARK_PEACH = './assets/monograma-peach.png';

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    body.style.overflow = open ? 'hidden' : '';
    if (brandMark) brandMark.src = open ? MARK_PEACH : MARK_GREEN;
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false);
  });
  window.matchMedia('(min-width: 1100px)').addEventListener('change', function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* =======================================================
     Âncoras suaves (com foco correto para teclado/leitor de tela)
     ======================================================= */
  function goTo(id) {
    var target = document.querySelector(id);
    if (!target) return;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    window.setTimeout(function () { target.focus({ preventScroll: true }); }, 700);
    history.replaceState(null, '', id);
  }
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id.length < 2 || !document.querySelector(id)) return;
      e.preventDefault();
      goTo(id);
    });
  });

  /* =======================================================
     Folhas do hero
     A mesma folha do logo, espalhada em volta da foto.
     · fogem levemente do mouse (mola)
     · ao passar o mouse / tocar, a folha cai e depois brota de novo
     ======================================================= */
  var LEAF_SVG =
    '<svg viewBox="-20 -20 40 40"><path d="M0,-18 C12,-10 13,8 0,18 C-13,8 -12,-10 0,-18Z"/>' +
    '<path class="vein" d="M0,-12 C2,-3 2,6 0,13"/></svg>';

  /* posição relativa à foto (0..1 = dentro da foto), tamanho, rotação e cor */
  var LEAVES = [
    { x: -0.46, y: 0.06, s: 30, r: -30, c: 'var(--peach)' },
    { x: -0.70, y: 0.52, s: 22, r: 60, c: 'var(--lilac)' },
    { x: 1.48, y: 0.18, s: 26, r: -50, c: 'var(--peach)' },
    { x: 1.40, y: 0.62, s: 30, r: 15, c: 'var(--lilac)' },
    { x: 1.56, y: 0.86, s: 18, r: 80, c: 'var(--sun)' },
    { x: -0.30, y: 0.98, s: 16, r: -70, c: 'var(--sun)' }
  ];

  function startLeaves() {
    var layer = document.getElementById('leaves');
    var hero = document.querySelector('.hero');
    var photo = document.querySelector('.hero__photo');
    if (!layer || !photo) return;

    var mouse = { x: -9999, y: -9999 };
    var leaves = LEAVES.map(function (cfg, i) {
      var el = document.createElement('span');
      el.className = 'leaf is-growing';
      el.style.setProperty('--s', cfg.s + 'px');
      el.style.setProperty('--c', cfg.c);
      el.style.setProperty('--v', cfg.c === 'var(--lilac)' ? 'var(--violet)' : 'var(--green)');
      el.style.animationDelay = (i * 80) + 'ms';
      el.innerHTML = '<span class="leaf__in" style="animation-delay:' + (300 + i * 90) + 'ms">' + LEAF_SVG + '</span>';
      layer.appendChild(el);
      var leaf = { el: el, cfg: cfg, bx: 0, by: 0, ox: 0, oy: 0, vx: 0, vy: 0, phase: Math.random() * 6.28, busy: false };
      el.addEventListener('pointerenter', function () { drop(leaf); });
      el.addEventListener('click', function () { drop(leaf); });
      return leaf;
    });

    function drop(leaf) {
      if (leaf.busy) return;
      leaf.busy = true;
      leaf.el.classList.remove('is-growing');
      void leaf.el.offsetWidth;
      leaf.el.classList.add('is-falling');
      window.setTimeout(function () {
        leaf.el.classList.remove('is-falling');
        void leaf.el.offsetWidth;
        leaf.el.classList.add('is-growing');
        leaf.el.querySelector('.leaf__in').style.animationDelay = '0ms';
        window.setTimeout(function () { leaf.busy = false; }, 900);
      }, 3200);
    }

    function layout() {
      var h = hero.getBoundingClientRect();
      var p = photo.getBoundingClientRect();
      var small = window.innerWidth < 640;
      leaves.forEach(function (l) {
        /* no celular, as folhas ficam mais perto da foto */
        var x = small ? 0.5 + (l.cfg.x - 0.5) * 0.72 : l.cfg.x;
        l.bx = p.left - h.left + p.width * x;
        l.by = p.top - h.top + p.height * l.cfg.y;
      });
    }
    layout();
    window.addEventListener('resize', layout);
    window.setTimeout(layout, 1200); /* depois da entrada da foto */

    hero.addEventListener('pointermove', function (e) {
      var h = hero.getBoundingClientRect();
      mouse.x = e.clientX - h.left;
      mouse.y = e.clientY - h.top;
    });
    hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });

    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(hero);
    }

    function frame(t) {
      if (visible) {
        leaves.forEach(function (l) {
          var sway = reduceMotion ? 0 : Math.sin(t / 1300 + l.phase) * 7;
          var bob = reduceMotion ? 0 : Math.cos(t / 1700 + l.phase) * 4;
          if (!reduceMotion) {
            var dx = l.bx + l.ox - mouse.x;
            var dy = l.by + l.oy - mouse.y;
            var d = Math.sqrt(dx * dx + dy * dy) || 1;
            if (d < 130) {
              var f = (130 - d) / 130 * 2.2;
              l.vx += dx / d * f;
              l.vy += dy / d * f;
            }
            l.vx += -l.ox * 0.04; l.vy += -l.oy * 0.04; /* mola de volta */
            l.vx *= 0.86; l.vy *= 0.86;
            l.ox += l.vx; l.oy += l.vy;
          }
          var half = l.cfg.s / 2;
          l.el.style.transform =
            'translate(' + (l.bx + l.ox - half) + 'px,' + (l.by + l.oy + bob - half) + 'px) rotate(' + (l.cfg.r + sway + l.vx * 3) + 'deg)';
        });
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }


  /* =======================================================
     Botânica
     Galhos desenhados em SVG: o caule se traça, as folhas
     brotam ao longo dele e os raminhos de lavanda florescem.
     Cada galho balança sozinho e se inclina com o mouse.
     ======================================================= */
  var NS = 'http://www.w3.org/2000/svg';
  var LEAF_D = 'M0,0 C6,-7 19,-8 30,0 C19,8 6,7 0,0Z';
  var VEIN_D = 'M3,0 C10,-.6 18,-.6 26,0';

  function mk(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  /* gerador simples e determinístico (o desenho é sempre igual) */
  function seeded(seed) {
    return function () { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  }

  function growBranch(svg, o) {
    var rnd = seeded(o.seed || 3);
    var vein = o.vein || 'rgba(255,255,255,.7)';
    var g = mk('g', { 'class': 'branch' }, svg);
    var base = o.d.match(/-?\d+(\.\d+)?/g);
    g.style.transformOrigin = base[0] + 'px ' + base[1] + 'px';
    if (o.stem) g.style.setProperty('--stem', o.stem);
    if (o.sw) g.style.setProperty('--sw', o.sw);

    var stem = mk('path', { d: o.d, 'class': 'branch__stem' }, g);
    var L = stem.getTotalLength();
    stem.style.strokeDasharray = L;
    stem.style.strokeDashoffset = reduceMotion ? 0 : L;
    stem.style.animationDelay = o.delay + 's';

    function at(t) {
      var p = stem.getPointAtLength(L * t);
      var q = stem.getPointAtLength(Math.min(L, L * t + 1.5));
      var b = stem.getPointAtLength(Math.max(0, L * t - 1.5));
      return { x: p.x, y: p.y, a: Math.atan2(q.y - b.y, q.x - b.x) * 180 / Math.PI };
    }

    function leaf(p, angle, size, color, delay) {
      var outer = mk('g', { transform: 'translate(' + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ') rotate(' + angle.toFixed(1) + ') scale(' + (size / 30).toFixed(3) + ')' }, g);
      var inner = mk('g', { 'class': 'branch__leaf' }, outer);
      inner.style.animationDelay = delay + 's';
      mk('path', { d: LEAF_D }, inner).style.fill = color;
      mk('path', { d: VEIN_D, 'class': 'vein' }, inner).style.stroke = vein;
    }

    /* folhas alternadas, menores na ponta */
    for (var i = 0; i < o.n; i++) {
      var t = 0.1 + 0.86 * i / (o.n - 1);
      var p = at(t);
      var side = i % 2 ? 1 : -1;
      var size = o.size * (1.1 - 0.45 * t) * (0.85 + rnd() * 0.3);
      var color = o.colors[Math.floor(rnd() * o.colors.length)];
      leaf(p, p.a + side * (38 + rnd() * 22), size, color, o.delay + 0.25 + t * 1.5);
    }
    /* folha da ponta */
    var tip = at(1);
    leaf(tip, tip.a, o.size * 0.75, o.colors[0], o.delay + 1.9);

    /* raminhos de lavanda: [posição no galho, ângulo, comprimento] */
    (o.lav || []).forEach(function (cfg, k) {
      var p0 = at(cfg[0]);
      var dir = (p0.a + cfg[1]) * Math.PI / 180;
      var len = cfg[2] || 46;
      var x1 = p0.x + Math.cos(dir) * len, y1 = p0.y + Math.sin(dir) * len;
      var mx = (p0.x + x1) / 2 - Math.sin(dir) * 6, my = (p0.y + y1) / 2 + Math.cos(dir) * 6;
      var sprig = mk('path', { d: 'M' + p0.x + ',' + p0.y + ' Q' + mx + ',' + my + ' ' + x1 + ',' + y1, 'class': 'branch__stem' }, g);
      sprig.style.strokeWidth = 1.2;
      var sl = sprig.getTotalLength();
      sprig.style.strokeDasharray = sl;
      sprig.style.strokeDashoffset = reduceMotion ? 0 : sl;
      sprig.style.animationDelay = (o.delay + 0.6 + cfg[0]) + 's';
      sprig.style.animationDuration = '.8s';
      /* botões de flor na metade de cima do raminho */
      for (var b = 0; b < 8; b++) {
        var tt = 0.38 + b * 0.085;
        var bp = sprig.getPointAtLength(sl * tt);
        var bs = b % 2 ? 1 : -1;
        var sz = 1 - (tt - 0.38) * 0.8;
        var nx = Math.cos(dir + Math.PI / 2) * bs * 2.6, ny = Math.sin(dir + Math.PI / 2) * bs * 2.6;
        var bud = mk('ellipse', {
          cx: (bp.x + nx).toFixed(1), cy: (bp.y + ny).toFixed(1),
          rx: (2.4 * sz + 0.6).toFixed(1), ry: (4 * sz + 1).toFixed(1),
          transform: 'rotate(' + ((dir * 180 / Math.PI) + 90 + bs * 25).toFixed(0) + ' ' + (bp.x + nx).toFixed(1) + ' ' + (bp.y + ny).toFixed(1) + ')',
          'class': 'branch__bud'
        }, g);
        bud.style.fill = b % 3 === 0 ? 'var(--violet)' : 'var(--lilac)';
        bud.style.animationDelay = (o.delay + 1.2 + cfg[0] + b * 0.07 + k * 0.1) + 's';
      }
    });
    return g;
  }

  var GREENS = ['var(--green)', 'var(--green-700)', 'var(--sage)'];
  var LIGHTS = ['var(--peach)', 'var(--sage)', 'var(--lilac)'];

  /* coordenadas no viewBox de cada <svg class="botany"> do HTML */
  var BOTANY = {
    'botany-hero': [
      { d: 'M70,560 C10,480 -60,420 -58,320 C-56,230 -8,180 -26,86', n: 12, size: 36, colors: GREENS, delay: 0, seed: 4, lav: [[0.42, -70, 54], [0.74, -60, 44]] },
      { d: 'M420,350 C470,300 476,210 438,140 C410,90 350,60 318,-6', n: 10, size: 32, colors: GREENS, delay: 0.3, seed: 9, lav: [[0.55, 70, 50]] },
      { d: 'M330,548 C380,540 430,520 462,470', n: 5, size: 26, colors: ['var(--sage)', 'var(--green-700)'], delay: 0.6, seed: 2, lav: [[0.6, -60, 40]] }
    ],
    'botany-connect': [
      { d: 'M-10,128 C160,150 320,40 488,92', n: 10, size: 30, colors: GREENS, delay: 0, seed: 5, lav: [[0.3, -75, 44], [0.66, 70, 36]] },
      { d: 'M1010,58 C840,24 690,140 512,92', n: 10, size: 30, colors: GREENS, delay: 0.15, seed: 11, lav: [[0.4, 75, 44]] }
    ],
    'botany-about': [
      { d: 'M330,330 C280,280 262,200 190,160 C140,132 92,118 40,64', n: 11, size: 30, colors: LIGHTS, stem: 'var(--peach)', sw: 1.6, vein: 'rgba(23,83,57,.45)', delay: 0, seed: 6, lav: [[0.35, 70, 44], [0.7, -70, 40]] }
    ],
    'botany-contact': [
      { d: 'M-10,330 C40,280 70,220 140,180 C190,150 240,140 290,88', n: 10, size: 28, colors: LIGHTS, stem: 'var(--peach)', sw: 1.6, vein: 'rgba(23,83,57,.45)', delay: 0, seed: 8, lav: [[0.45, -70, 42]] }
    ]
  };

  var botanyBuilt = {};
  function buildBotany(svg) {
    if (botanyBuilt[svg.id] || !BOTANY[svg.id]) return;
    botanyBuilt[svg.id] = true;
    BOTANY[svg.id].forEach(function (o) { growBranch(svg, o); });
    /* na "conexão", duas folhas se tocam no ponto de encontro dos galhos */
    if (svg.id === 'botany-connect') {
      [['var(--peach)', -58], ['var(--lilac)', -122]].forEach(function (h, i) {
        var outer = mk('g', { transform: 'translate(500 92) rotate(' + h[1] + ') scale(1.5)' }, svg);
        var inner = mk('g', { 'class': 'branch__leaf' }, outer);
        inner.style.animationDelay = (1.9 + i * 0.18) + 's';
        mk('path', { d: LEAF_D }, inner).style.fill = h[0];
        mk('path', { d: VEIN_D, 'class': 'vein' }, inner).style.stroke = 'var(--green)';
      });
    }
    requestAnimationFrame(function () { svg.classList.add('is-on'); });
  }

  function startBotany() {
    var heroSvg = document.getElementById('botany-hero');
    if (heroSvg) buildBotany(heroSvg);
    var others = document.querySelectorAll('.botany:not(#botany-hero)');
    if (!('IntersectionObserver' in window)) { others.forEach(buildBotany); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { buildBotany(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    others.forEach(function (s) { io.observe(s); });

    /* os galhos do hero se inclinam levemente acompanhando o mouse */
    var hero = document.querySelector('.hero');
    if (hero && heroSvg && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
      hero.addEventListener('pointermove', function (e) {
        var k = (e.clientX / window.innerWidth - 0.5) * 2;
        heroSvg.querySelectorAll('.branch').forEach(function (b, i) {
          b.style.rotate = (k * (i % 2 ? -2.4 : 2.4)).toFixed(2) + 'deg';
        });
      });
    }
  }

  /* =======================================================
     Linha da consulta: desenha conforme a rolagem
     ======================================================= */
  var path = document.getElementById('journey-path');
  var track = document.querySelector('.journey__track');
  if (path && track) {
    var len = 0;
    var buildLine = function () {
      /* curva suave que passa pelo centro de cada círculo numerado */
      /* offsetTop/offsetLeft ignoram o transform da animação de entrada */
      var pts = [].map.call(track.querySelectorAll('.step__n'), function (n) {
        var x = n.offsetWidth / 2, y = n.offsetHeight / 2, el = n;
        while (el && el !== track) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
        return [x, y];
      });
      if (pts.length < 2) return;
      var d = 'M' + (pts[0][0] - 70) + ',' + pts[0][1] + ' L' + pts[0][0] + ',' + pts[0][1];
      for (var i = 1; i < pts.length; i++) {
        var a = pts[i - 1], b = pts[i], mx = (a[0] + b[0]) / 2;
        d += ' C' + mx + ',' + a[1] + ' ' + mx + ',' + b[1] + ' ' + b[0] + ',' + b[1];
      }
      path.setAttribute('d', d);
      len = path.getTotalLength();
      path.style.strokeDasharray = len;
      drawLine();
    };
    var drawLine = function () {
      if (reduceMotion) { path.style.strokeDashoffset = 0; return; }
      var r = track.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.25)));
      path.style.strokeDashoffset = len * (1 - p);
    };
    window.addEventListener('scroll', drawLine, { passive: true });
    window.addEventListener('resize', buildLine);
    window.addEventListener('load', buildLine);
    buildLine();
  }

  /* =======================================================
     Formulário → WhatsApp
     ======================================================= */
  var form = document.getElementById('contact-form');
  var errorBox = document.getElementById('form-error');

  function showError(msg, field) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
    if (field) field.focus();
  }

  /* Botões "Perguntar sobre o valor social": marcam a opção no formulário e levam até ele */
  document.querySelectorAll('[data-tipo]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tipo = btn.getAttribute('data-tipo') === 'social' ? 'Valor social' : 'Particular';
      var radio = form && form.querySelector('input[name="tipo"][value="' + tipo + '"]');
      if (radio) radio.checked = true;
      goTo('#contato');
    });
  });

  if (form) {
    /* máscara simples de telefone brasileiro */
    var phone = form.elements['whatsapp'];
    phone.addEventListener('input', function () {
      var d = phone.value.replace(/\D/g, '').slice(0, 11);
      var out = d;
      if (d.length > 6) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
      else if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      phone.value = out;
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorBox.hidden = true;

      var nome = form.elements['nome'].value.trim();
      var tel = phone.value.replace(/\D/g, '');
      var objetivo = form.elements['objetivo'].value.trim();
      var tipoEl = form.querySelector('input[name="tipo"]:checked');
      var tipo = tipoEl ? tipoEl.value : 'Particular';

      if (nome.length < 2) return showError('Por favor, informe seu nome.', form.elements['nome']);
      if (tel.length < 10) return showError('Informe um WhatsApp válido, com DDD.', phone);
      if (objetivo.length < 3) return showError('Conte em poucas palavras o objetivo da consulta.', form.elements['objetivo']);

      var msg =
        'Olá, Stefani! Meu nome é ' + nome + '.\n' +
        'Gostaria de conversar sobre uma consulta.\n' +
        'Tipo de atendimento: ' + tipo + '\n' +
        'Objetivo: ' + objetivo + '\n' +
        'Meu WhatsApp: ' + phone.value;

      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }

  /* ---------- Ano no rodapé ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
