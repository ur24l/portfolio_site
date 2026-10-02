/* ==========================================================================
   main.js — small, dependency-free enhancements.
   The page is fully readable without JavaScript; everything here is extra.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- theme toggle (remembers choice, otherwise follows the OS) ---------- */
  var themeBtn = document.getElementById('themeToggle');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  function currentTheme() {
    return root.dataset.theme || (darkQuery.matches ? 'dark' : 'light');
  }
  function syncThemeMeta() {
    var dark = currentTheme() === 'dark';
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute('content', dark ? '#0f1011' : '#f6f5f1');
    });
    if (themeBtn) themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      function apply() {
        root.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch (e) {}
        syncThemeMeta();
      }
      // circular reveal from the button, where View Transitions are supported
      if (document.startViewTransition && !reduceMotion) {
        var r = themeBtn.getBoundingClientRect();
        root.style.setProperty('--vx', (r.left + r.width / 2) + 'px');
        root.style.setProperty('--vy', (r.top + r.height / 2) + 'px');
        document.startViewTransition(apply);
      } else { apply(); }
    });
  }
  if (darkQuery.addEventListener) darkQuery.addEventListener('change', syncThemeMeta);
  syncThemeMeta();

  /* ---------- header border on scroll ---------- */
  var header = document.getElementById('header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
  }
  if (menuBtn) menuBtn.addEventListener('click', function () {
    setMenu(!document.body.classList.contains('menu-open'));
  });
  if (nav) nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });

  /* ---------- active nav link ---------- */
  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]')) : [];
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var sections = Object.keys(byId).map(function (id) { return document.getElementById(id); }).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove('active'); });
        var link = byId[entry.target.id];
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    // stagger siblings that enter together
    reveals.forEach(function (el) {
      var siblings = el.parentElement ? el.parentElement.querySelectorAll(':scope > .reveal') : [];
      var i = Array.prototype.indexOf.call(siblings, el);
      if (i > 0) el.style.transitionDelay = Math.min(i, 6) * 60 + 'ms';
      io.observe(el);
    });
  }

  /* ---------- local time in Visakhapatnam (IST) ---------- */
  var timeEl = document.getElementById('localTime');
  function tickTime() {
    if (!timeEl) return;
    try {
      timeEl.textContent = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata'
      }).format(new Date()) + ' IST';
    } catch (e) { timeEl.textContent = ''; }
  }
  tickTime();
  setInterval(tickTime, 30000);

  /* ---------- copy email ---------- */
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }

  var copyBtn = document.getElementById('copyEmail');
  if (copyBtn) copyBtn.addEventListener('click', function () {
    var email = copyBtn.getAttribute('data-email');
    var label = copyBtn.querySelector('.copy-label');
    function done() {
      copyBtn.classList.add('copied');
      if (label) label.textContent = 'Copied';
      showToast('Email copied to clipboard');
      setTimeout(function () {
        copyBtn.classList.remove('copied');
        if (label) label.textContent = 'Copy';
      }, 2000);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(done, function () { window.location.href = 'mailto:' + email; });
    } else {
      window.location.href = 'mailto:' + email;
    }
  });

  /* ---------- scroll progress bar ---------- */
  var progress = document.getElementById('progress');
  var ticking = false;
  function updateProgress() {
    ticking = false;
    if (!progress) return;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--p', max > 0 ? Math.min(window.scrollY / max, 1) : 0);
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();

  /* ---------- spotlight that follows the pointer on cards ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- respect reduced motion for the SVG workflow animation ---------- */
  var flow = document.querySelector('.flow-svg');
  if (flow && reduceMotion && flow.pauseAnimations) flow.pauseAnimations();

  /* ---------- "months at PHYTEC" stays correct over time ---------- */
  document.querySelectorAll('[data-months-since]').forEach(function (el) {
    var parts = el.getAttribute('data-months-since').split('-');
    var now = new Date();
    var months = (now.getFullYear() - +parts[0]) * 12 + (now.getMonth() + 1 - +parts[1]) + 1;
    if (months > 0) {
      el.setAttribute('data-count', months);
      el.textContent = months;
      if (months >= 12) {
        var yrs = Math.floor(months / 12);
        el.setAttribute('data-count', yrs);
        el.textContent = yrs;
        var unit = el.nextElementSibling;
        if (unit) unit.textContent = yrs === 1 ? 'year' : 'years';
      }
    }
  });

  /* ---------- count-up numbers when they scroll into view ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target, end = +el.getAttribute('data-count'), start = null;
        cio.unobserve(el);
        if (end <= 1) return;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / 1200, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
        }
        el.textContent = '0';
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---------- "Save CV as PDF" uses the print stylesheet ---------- */
  function printCV() {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    setTimeout(function () { window.print(); }, 50);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-action="print"]');
    if (b) { e.preventDefault(); printCV(); }
  });

  /* ---------- quick menu (Ctrl/⌘ + K) ---------- */
  var cmd = document.getElementById('cmd');
  var cmdInput = document.getElementById('cmdInput');
  var cmdList = document.getElementById('cmdList');
  var cmdOpenBtn = document.getElementById('cmdOpen');
  var lastFocus = null;

  function go(id) { return function () { var el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }; }
  function open(url) { return function () { window.open(url, '_blank', 'noopener'); }; }
  var commands = [
    { group: 'Go to', label: 'What I\'m working on', icon: 'i-erp', run: go('services') },
    { group: 'Go to', label: 'How I learn', icon: 'i-flow', run: go('process') },
    { group: 'Go to', label: 'Learning log (notes)', icon: 'i-spark', run: go('log') },
    { group: 'Go to', label: 'What I\'ve built', icon: 'i-arrow', run: go('work') },
    { group: 'Go to', label: 'AI news briefing project', icon: 'i-spark', run: go('ai-news') },
    { group: 'Go to', label: 'Experience', icon: 'i-arrow', run: go('experience') },
    { group: 'Go to', label: 'About me', icon: 'i-arrow', run: go('about') },
    { group: 'Go to', label: 'Skills', icon: 'i-arrow', run: go('skills') },
    { group: 'Go to', label: 'Learning roadmap', icon: 'i-spark', run: go('roadmap') },
    { group: 'Go to', label: 'Contact', icon: 'i-arrow', run: go('contact') },
    { group: 'Actions', label: 'Copy email address', icon: 'i-copy', hint: 'email', run: function () { if (copyBtn) copyBtn.click(); } },
    { group: 'Actions', label: 'Download CV (PDF)', icon: 'i-file', hint: 'pdf', run: function () { var a = document.createElement('a'); a.href = 'assets/Bhargav-Sai-Bhartu-Resume.pdf'; a.download = ''; document.body.appendChild(a); a.click(); a.remove(); } },
    { group: 'Actions', label: 'Download CV (Word)', icon: 'i-file', hint: 'docx', run: function () { var a = document.createElement('a'); a.href = 'assets/Bhargav-Sai-Bhartu-Resume.docx'; a.download = ''; document.body.appendChild(a); a.click(); a.remove(); } },
    { group: 'Actions', label: 'Switch light / dark theme', icon: 'i-moon', hint: 'theme', run: function () { if (themeBtn) themeBtn.click(); } },
    { group: 'Links', label: 'Open LinkedIn', icon: 'i-linkedin', hint: '↗', run: open('https://www.linkedin.com/in/bhargav-sai-bhartu/') },
    { group: 'Links', label: 'Open GitHub', icon: 'i-github', hint: '↗', run: open('https://github.com/ur24l') }
  ];
  var filtered = commands, active = 0;

  function render() {
    var q = cmdInput.value.trim().toLowerCase();
    filtered = commands.filter(function (c) { return !q || (c.label + ' ' + c.group + ' ' + (c.hint || '')).toLowerCase().indexOf(q) > -1; });
    if (active >= filtered.length) active = 0;
    var html = '', group = '';
    if (!filtered.length) html = '<li class="cmd-empty">Nothing found. Try “email” or “work”.</li>';
    filtered.forEach(function (c, i) {
      if (c.group !== group) { group = c.group; html += '<li class="cmd-group" role="presentation">' + group + '</li>'; }
      html += '<li class="cmd-item" role="option" id="cmd-' + i + '" data-i="' + i + '" aria-selected="' + (i === active) + '">' +
        '<svg class="ico"><use href="#' + c.icon + '"/></svg><span>' + c.label + '</span>' + (c.hint ? '<small>' + c.hint + '</small>' : '') + '</li>';
    });
    cmdList.innerHTML = html;
    cmdInput.setAttribute('aria-activedescendant', filtered.length ? 'cmd-' + active : '');
    var sel = cmdList.querySelector('[aria-selected="true"]');
    if (sel) sel.scrollIntoView({ block: 'nearest' });
  }
  function openCmd() {
    if (!cmd) return;
    lastFocus = document.activeElement;
    cmd.hidden = false; cmdInput.value = ''; active = 0; render();
    setTimeout(function () { cmdInput.focus(); }, 10);
  }
  function closeCmd() {
    if (!cmd || cmd.hidden) return;
    cmd.hidden = true;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function runActive() { var c = filtered[active]; closeCmd(); if (c) c.run(); }

  if (cmd) {
    if (cmdOpenBtn) cmdOpenBtn.addEventListener('click', openCmd);
    cmdInput.addEventListener('input', function () { active = 0; render(); });
    cmdInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); active = (active + 1) % Math.max(filtered.length, 1); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = (active - 1 + filtered.length) % Math.max(filtered.length, 1); render(); }
      else if (e.key === 'Enter') { e.preventDefault(); runActive(); }
      else if (e.key === 'Tab') { e.preventDefault(); }
    });
    cmdList.addEventListener('click', function (e) {
      var item = e.target.closest('.cmd-item'); if (!item) return;
      active = +item.getAttribute('data-i'); runActive();
    });
    cmdList.addEventListener('mousemove', function (e) {
      var item = e.target.closest('.cmd-item'); if (!item) return;
      var i = +item.getAttribute('data-i'); if (i !== active) { active = i; render(); }
    });
    cmd.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closeCmd(); });
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); cmd.hidden ? openCmd() : closeCmd(); }
      else if (e.key === 'Escape') closeCmd();
    });
  }

  /* ---------- show the right shortcut label for Mac vs Windows ---------- */
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  document.querySelectorAll('.kbd-btn kbd').forEach(function (k) { k.textContent = isMac ? '⌘K' : 'Ctrl K'; });
  document.querySelectorAll('.footer-hint').forEach(function (h) { if (isMac) h.innerHTML = 'Tip: press <kbd>⌘</kbd> <kbd>K</kbd> for the quick menu'; });


  /* ---------- "learning now" rotating words ---------- */
  var rot = document.getElementById('learnRotator');
  if (rot) {
    var words = rot.querySelectorAll('span'), wi = 0;
    words[0].classList.add('on');
    if (!reduceMotion && words.length > 1) {
      setInterval(function () {
        var cur = words[wi]; wi = (wi + 1) % words.length; var nxt = words[wi];
        cur.classList.remove('on'); cur.classList.add('off');
        nxt.classList.remove('off'); nxt.classList.add('on');
        setTimeout(function () { cur.classList.remove('off'); }, 650);
      }, 2400);
    }
  }

  /* ---------- learning-log filters ---------- */
  var filterBtns = document.querySelectorAll('.filter');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) { var on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
      document.querySelectorAll('.log-item').forEach(function (item) {
        var show = f === 'all' || item.getAttribute('data-topic') === f;
        item.hidden = !show;
        if (show) item.classList.add('in');
      });
    });
  });

  /* ---------- soft glow that follows the cursor (desktop only) ---------- */
  var glow = document.getElementById('cursorGlow');
  if (glow && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var gx = 0, gy = 0, gt = false;
    window.addEventListener('pointermove', function (e) {
      gx = e.clientX; gy = e.clientY;
      if (!gt) { gt = true; requestAnimationFrame(function () { gt = false; glow.style.setProperty('--cx', gx + 'px'); glow.style.setProperty('--cy', gy + 'px'); }); }
    }, { passive: true });
  } else if (glow) { glow.remove(); }


  /* ---------- hero headline: split into words for the rise-in animation ---------- */
  var title = document.querySelector('.hero-title');
  if (title && !reduceMotion) {
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement('span');
            s.className = 'w'; s.style.setProperty('--i', n++); s.textContent = part;
            frag.appendChild(s);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') { walk(child); }
      });
    })(title);
    title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
    title.classList.add('split');
  }

  /* ---------- avatar <-> real photo flip ---------- */
  var flip = document.getElementById('flip');
  var flipBtn = document.getElementById('flipBtn');
  function setFlip(on) {
    if (!flip || !flipBtn) return;
    flip.classList.toggle('is-flipped', on);
    flipBtn.setAttribute('aria-pressed', String(on));
    flipBtn.querySelector('span').textContent = on ? 'See my illustrated self' : 'See my real photo';
    if (on) { var img = flip.querySelector('.flip-back img'); if (img) img.loading = 'eager'; }
  }
  if (flipBtn) flipBtn.addEventListener('click', function () { setFlip(!flip.classList.contains('is-flipped')); });

  /* ---------- pointer-reactive portrait, magnetic buttons, card tilt (desktop) ---------- */
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reduceMotion) {
    var portrait = document.querySelector('.portrait');
    if (portrait) {
      portrait.addEventListener('pointermove', function (e) {
        var r = portrait.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        portrait.style.setProperty('--ry', (x * 10).toFixed(2) + 'deg');
        portrait.style.setProperty('--rx', (y * -8).toFixed(2) + 'deg');
      });
      portrait.addEventListener('pointerleave', function () {
        portrait.style.setProperty('--ry', '0deg'); portrait.style.setProperty('--rx', '0deg');
      });
    }

    document.querySelectorAll('.magnetic').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + (x * .25).toFixed(1) + 'px,' + (y * .35).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });

    document.querySelectorAll('.proj, .log-item, .step').forEach(function (card) {
      card.classList.add('tilt');
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        card.style.setProperty('--ty', (x * 6).toFixed(2) + 'deg');
        card.style.setProperty('--tx', (y * -6).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', function () { card.style.setProperty('--tx', '0deg'); card.style.setProperty('--ty', '0deg'); });
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
