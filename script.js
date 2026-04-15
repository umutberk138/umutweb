// ============================================
// APEX OS V18 — script.js
// umutince.online — Interactive Features Engine
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll Progress Bar ──
  const scrollBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = (window.scrollY / total) * 100;
    scrollBar.style.width = pct + '%';
  });

  // ── Dark / Light Mode ──
  const themeBtn = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('apex-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('apex-theme', next);
    updateThemeIcon(next);
  });
  function updateThemeIcon(t) {
    themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
  }

  // ── Cursor Trail ──
  if (window.matchMedia('(pointer: fine)').matches) {
    const dots = [];
    const N = 8;
    for (let i = 0; i < N; i++) {
      const d = document.createElement('div');
      d.className = 'cursor-dot';
      d.style.opacity = (1 - i / N) * 0.7;
      d.style.width = (8 - i) + 'px';
      d.style.height = (8 - i) + 'px';
      document.body.appendChild(d);
      dots.push({ el: d, x: 0, y: 0 });
    }
    let mx = 0, my = 0;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animDots() {
      let px = mx, py = my;
      dots.forEach((dot, i) => {
        dot.x += (px - dot.x) * (0.5 - i * 0.05);
        dot.y += (py - dot.y) * (0.5 - i * 0.05);
        dot.el.style.left = dot.x + 'px';
        dot.el.style.top = dot.y + 'px';
        px = dot.x; py = dot.y;
      });
      requestAnimationFrame(animDots);
    }
    animDots();
  }

  // ── Rotating Hero Text ──
  const roles = ['E-Ticaret Stratejisti', 'YBS Öğrencisi', 'Sporcu', 'Dijital Maceracı', 'Problem Çözücü'];
  const rotEl = document.getElementById('hero-rotating');
  let ri = 0;
  function rotateRole() {
    rotEl.style.opacity = '0';
    rotEl.style.transform = 'translateY(8px)';
    setTimeout(() => {
      ri = (ri + 1) % roles.length;
      rotEl.textContent = '> ' + roles[ri];
      rotEl.style.opacity = '1';
      rotEl.style.transform = 'translateY(0)';
    }, 400);
  }
  rotEl.style.transition = 'opacity 0.4s, transform 0.4s';
  rotEl.textContent = '> ' + roles[0];
  setInterval(rotateRole, 2500);

  // ── Animated Stat Counters ──
  function animCount(el, target, suffix) {
    let start = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { el.textContent = target + suffix; clearInterval(timer); return; }
      el.textContent = Math.floor(start) + suffix;
    }, 30);
  }

  // ── Back to Top ──
  const btt = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 500);
  });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // ── Hamburger Menu ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  // ── Ripple Effect ──
  document.querySelectorAll('.btn-primary, .btn-outline, .btn-darknet').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = this.getBoundingClientRect();
      r.style.width = r.style.height = Math.max(rect.width, rect.height) + 'px';
      r.style.left = (e.clientX - rect.left - rect.width / 2) + 'px';
      r.style.top = (e.clientY - rect.top - rect.height / 2) + 'px';
      this.appendChild(r);
      setTimeout(() => r.remove(), 600);
    });
  });

  // ── Image Lightbox ──
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const heroImg = document.getElementById('hero-profile-img');
  heroImg.addEventListener('click', () => {
    lightboxImg.src = heroImg.src;
    lightbox.classList.add('active');
  });
  document.getElementById('lightbox-close').addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('active'); });

  // ── FAQ Accordion ──
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ── Command Palette ──
  const cmdOverlay = document.getElementById('cmd-overlay');
  const cmdInput = document.getElementById('cmd-input');
  const cmdResults = document.getElementById('cmd-results');

  const commands = [
    { icon: '🏠', text: 'Ana Sayfa', shortcut: 'H', action: () => window.scrollTo({top:0, behavior:'smooth'}) },
    { icon: '👤', text: 'Hakkımda', shortcut: 'A', action: () => scrollTo('#about') },
    { icon: '⚡', text: 'Yetenekler', shortcut: 'S', action: () => scrollTo('#skills') },
    { icon: '🚀', text: 'Projeler', shortcut: 'P', action: () => scrollTo('#projects') },
    { icon: '📬', text: 'İletişim', shortcut: 'C', action: () => scrollTo('#contact') },
    { icon: '🌙', text: 'Tema Değiştir', shortcut: 'T', action: () => themeBtn.click() },
    { icon: '🕶️', text: 'Darknet Modülü', shortcut: 'D', action: () => window.location.href = 'dark.html' },
    { icon: '🤖', text: 'Admin Panel', shortcut: '', action: () => window.location.href = 'admin.html' },
    { icon: '📄', text: 'CV İndir', shortcut: '', action: () => showToast('info', '📄 CV', 'CV hazırlanıyor...') },
    { icon: '🌐', text: 'GitHub Profili', shortcut: '', action: () => window.open('https://github.com', '_blank') },
  ];

  function scrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  function renderCommands(filter = '') {
    const filtered = commands.filter(c => c.text.toLowerCase().includes(filter.toLowerCase()));
    cmdResults.innerHTML = `<div class="cmd-section-label">Komutlar</div>` +
      filtered.map((c, i) => `
        <div class="cmd-item" data-idx="${i}">
          <span class="cmd-item-icon">${c.icon}</span>
          <span class="cmd-item-text">${c.text}</span>
          ${c.shortcut ? `<span class="cmd-item-shortcut">${c.shortcut}</span>` : ''}
        </div>`).join('');
    cmdResults.querySelectorAll('.cmd-item').forEach((item, i) => {
      item.addEventListener('click', () => {
        filtered[i].action();
        closeCmd();
      });
    });
  }

  function openCmd() { cmdOverlay.classList.add('active'); cmdInput.focus(); renderCommands(); }
  function closeCmd() { cmdOverlay.classList.remove('active'); cmdInput.value = ''; }

  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openCmd(); }
    if (e.key === 'Escape') { closeCmd(); lightbox.classList.remove('active'); }
    if (!cmdOverlay.classList.contains('active')) {
      if (e.key === 'D' || e.key === 'd') { if(!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) window.location.href = 'dark.html'; }
      if (e.key === 'T' || e.key === 't') { if(!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) themeBtn.click(); }
    }
  });

  cmdInput.addEventListener('input', () => renderCommands(cmdInput.value));
  cmdOverlay.addEventListener('click', e => { if (e.target === cmdOverlay) closeCmd(); });

  // ── Toast Notifications ──
  const toastContainer = document.getElementById('toast-container');
  window.showToast = function(type, title, msg) {
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    const icons = { success: '✅', error: '❌', info: 'ℹ️' };
    t.innerHTML = `
      <div class="toast-icon">${icons[type] || 'ℹ️'}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${msg}</div>
      </div>
      <div class="toast-bar"></div>`;
    toastContainer.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(-100%)'; t.style.transition = 'all 0.3s'; setTimeout(() => t.remove(), 300); }, 3200);
  };

  // ── Confetti ──
  window.launchConfetti = function() {
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = [];
    const colors = ['#22d3ee','#a78bfa','#f472b6','#34d399','#fbbf24'];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        w: Math.random() * 10 + 4,
        h: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 4 + 2,
        rot: Math.random() * 360
      });
    }
    let frame = 0;
    function drawConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
        p.x += p.vx; p.y += p.vy; p.rot += 3;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
      });
      frame++;
      if (frame < 180) requestAnimationFrame(drawConfetti);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    drawConfetti();
  };

  // ── Badge System ──
  const badgeContainer = document.getElementById('badge-container');
  const earned = JSON.parse(localStorage.getItem('apex-badges') || '[]');

  function earnBadge(id, icon, name) {
    if (earned.includes(id)) return;
    earned.push(id);
    localStorage.setItem('apex-badges', JSON.stringify(earned));
    const b = document.createElement('div');
    b.className = 'badge-popup';
    b.innerHTML = `<div class="badge-icon">${icon}</div><div class="badge-info"><div class="badge-label">Rozet Kazandın!</div><div class="badge-name">${name}</div></div>`;
    badgeContainer.appendChild(b);
    showToast('success', '🏆 Yeni Rozet!', name);
    launchConfetti();
    setTimeout(() => { b.style.opacity = '0'; b.style.transform = 'translateX(120%)'; b.style.transition = 'all 0.4s'; setTimeout(() => b.remove(), 400); }, 4000);
  }

  // İlk ziyaret
  if (!earned.includes('first-visit')) {
    setTimeout(() => earnBadge('first-visit', '👋', 'İlk Ziyaretçi'), 1500);
  }

  // 5dk kalma
  setTimeout(() => earnBadge('stay-5m', '⏱️', '5 Dakika Gezgin'), 300000);

  // Explorer (scroll to bottom)
  let explorerGiven = false;
  window.addEventListener('scroll', () => {
    if (!explorerGiven && window.scrollY + window.innerHeight >= document.body.scrollHeight - 100) {
      explorerGiven = true;
      earnBadge('explorer', '🗺️', 'Kaşif');
    }
  });

  // ── Cookie Consent ──
  const cookieBar = document.getElementById('cookie-bar');
  if (!localStorage.getItem('apex-cookies')) {
    setTimeout(() => cookieBar.classList.add('show'), 2000);
  }
  document.getElementById('cookie-accept').addEventListener('click', () => {
    localStorage.setItem('apex-cookies', '1');
    cookieBar.classList.remove('show');
    showToast('success', '🍪 Teşekkürler!', 'Çerez tercihiniz kaydedildi.');
  });
  document.getElementById('cookie-deny').addEventListener('click', () => {
    cookieBar.classList.remove('show');
  });

  // ── Online / Offline ──
  const offlineBanner = document.getElementById('offline-banner');
  window.addEventListener('offline', () => {
    offlineBanner.classList.add('show');
    showToast('error', '🚫 Bağlantı Kesildi', 'İnternet bağlantısı yok.');
  });
  window.addEventListener('online', () => {
    offlineBanner.classList.remove('show');
    showToast('success', '✅ Bağlantı Sağlandı', 'İnternet bağlantısı geri geldi.');
  });

  // ── Live Visitor Counter ──
  const counterEl = document.getElementById('live-counter');
  function updateCounter() {
    const base = 5;
    const rand = Math.floor(Math.random() * 8) + base;
    counterEl.textContent = rand;
    setTimeout(updateCounter, 8000 + Math.random() * 5000);
  }
  updateCounter();

  // ── Intersection Observer ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Skill bars
        if (entry.target.classList.contains('skill-item')) {
          const bar = entry.target.querySelector('.skill-bar-fill');
          const pct = bar.dataset.pct;
          setTimeout(() => bar.style.width = pct + '%', 100);
        }

        // Stat counters
        if (entry.target.id === 'hero-stats') {
          document.querySelectorAll('[data-count]').forEach(el => {
            animCount(el, parseInt(el.dataset.count), el.dataset.suffix || '');
          });
        }
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.fade-up, .skill-item, #hero-stats').forEach(el => observer.observe(el));

  // Contact Form
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('success', '📬 Mesaj Gönderildi!', 'En kısa sürede geri dönüş yapılacak.');
    e.target.reset();
  });

  // Admin secret
  document.getElementById('admin-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'admin.html';
  });

  // Welcome toast
  setTimeout(() => showToast('info', '👋 Hoş Geldiniz!', 'Ctrl+K ile komut panelini açabilirsiniz.'), 2500);

  // ── Keyboard Shortcut Hint ──
  document.addEventListener('keydown', function onKey(e) {
    if (e.key === '?' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
      openCmd();
    }
  });

});
