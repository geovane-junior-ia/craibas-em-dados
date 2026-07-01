/* ============================================
   DIAGNÓSTICO PDM CRAÍBAS — JS
   ============================================ */

(function () {
  'use strict';

  /* ===== Header on scroll ===== */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');

  function onScroll() {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    if (window.scrollY > 400) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ===== Mobile nav ===== */
  const navToggle = document.getElementById('nav-toggle');
  const navMain = document.getElementById('nav-main');
  navToggle.addEventListener('click', () => navMain.classList.toggle('open'));
  navMain.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navMain.classList.remove('open'))
  );

  /* ===== Active nav link on scroll =====
     Ordem reflete a estrutura real da página (Início → Sobre → Dados → Eixos → Contato). */
  const sections = ['inicio', 'sobre', 'dados', 'capitulos', 'contato']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  function setActiveNav() {
    const y = window.scrollY + 120;
    let current = sections[0];
    sections.forEach(s => { if (s.offsetTop <= y) current = s; });
    if (!current) return;
    navMain.querySelectorAll('a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', setActiveNav, { passive: true });

  /* ===== Animated counters =====
     Cada [data-count] JÁ contém o valor final renderizado no HTML (fallback estático:
     se o JS não carregar, o usuário ainda vê o número correto). A animação parte do
     zero apenas quando o card entra em viewport. */
  function formatNumber(n) {
    return n.toLocaleString('pt-BR');
  }
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = formatNumber(value) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = formatNumber(target) + suffix;
    }
    requestAnimationFrame(tick);
  }

  const countersStarted = new WeakSet();
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !countersStarted.has(e.target)) {
        countersStarted.add(e.target);
        animateCount(e.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ===== "Sobre" — bloco expansível "Saiba como foi construído" ===== */
  const aboutBtn = document.getElementById('about-expand-btn');
  const aboutWrap = document.getElementById('about-expand');
  const aboutContent = document.getElementById('about-expand-content');
  if (aboutBtn && aboutWrap && aboutContent) {
    aboutBtn.addEventListener('click', () => {
      const opened = aboutWrap.classList.toggle('open');
      aboutBtn.setAttribute('aria-expanded', opened ? 'true' : 'false');
      if (opened) {
        aboutContent.hidden = false;
        aboutBtn.querySelector('span').textContent = 'Ocultar detalhes';
      } else {
        aboutContent.hidden = true;
        aboutBtn.querySelector('span').textContent = 'Saiba como foi construído';
      }
    });
  }

  /* ===== Fade-up reveals ===== */
  const revealEls = document.querySelectorAll(
    '.section-title, .section-lead, .chapter-card, .stat-card, .indicator-card, .map-card, .about-text, .cta-stat'
  );
  revealEls.forEach(el => el.classList.add('fade-up'));

  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        fadeObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => fadeObserver.observe(el));

  /* ===== Charts ===== */
  if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = 'rgba(255,255,255,0.85)';
    Chart.defaults.plugins.legend.labels.color = 'rgba(255,255,255,0.9)';

    const colorPrimary = '#1a6b2a';
    const colorAccent = '#f5a800';
    const colorSecondary = '#7ec8e3';
    const colorWhite = 'rgba(255,255,255,0.9)';

    /* === Population Urban × Rural ===
       Fonte: t005 (IBGE · Censo Demográfico 2022) — 50,6% urbana / 49,4% rural.
       (Versão anterior usava 42/58, valor desatualizado.) */
    const popCtx = document.getElementById('chartPop');
    if (popCtx) {
      new Chart(popCtx, {
        type: 'doughnut',
        data: {
          labels: ['Urbana', 'Rural'],
          datasets: [{
            data: [50.6, 49.4],
            backgroundColor: [colorAccent, colorSecondary],
            borderColor: 'transparent',
            borderWidth: 0,
            hoverOffset: 12
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: { position: 'bottom', labels: { padding: 18, boxWidth: 12, boxHeight: 12, font: { size: 13, weight: '600' } } },
            tooltip: {
              backgroundColor: '#0d3a17',
              padding: 12,
              callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` }
            }
          }
        }
      });
    }

    /* === Population evolution === */
    const evolCtx = document.getElementById('chartEvolucao');
    if (evolCtx) {
      const grad = evolCtx.getContext('2d').createLinearGradient(0, 0, 0, 240);
      grad.addColorStop(0, 'rgba(245, 168, 0, 0.55)');
      grad.addColorStop(1, 'rgba(245, 168, 0, 0)');

      /* Fonte: t003 (IBGE · Censos Demográficos + estimativas FGV/IBGE) */
      new Chart(evolCtx, {
        type: 'line',
        data: {
          labels: ['1991', '2000', '2010', '2022', '2024', '2025*'],
          datasets: [{
            label: 'Habitantes',
            data: [17816, 20789, 22641, 25397, 26115, 26144],
            borderColor: colorAccent,
            backgroundColor: grad,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#fff',
            pointBorderColor: colorAccent,
            pointBorderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0d3a17',
              padding: 12,
              callbacks: { label: ctx => ` ${ctx.parsed.y.toLocaleString('pt-BR')} habitantes` }
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: { color: 'rgba(255,255,255,0.08)' },
              ticks: { color: 'rgba(255,255,255,0.7)', font: { size: 11 }, callback: v => (v / 1000) + 'k' }
            },
            x: {
              grid: { display: false },
              ticks: { color: 'rgba(255,255,255,0.7)', font: { size: 11, weight: '600' } }
            }
          }
        }
      });
    }

    /* === PIB sectors ===
       Fonte: t026 (IBGE · VAB 2021 · R$ 459,2 milhões totais).
       Indústria 32,7% · Adm.Pública 26,3% · Serviços (privados) 23,0% · Agropecuária 18,0%.
       (Versão anterior usava 38/32/22/8, números genéricos não condizentes com os CSVs.) */
    const pibCtx = document.getElementById('chartPIB');
    if (pibCtx) {
      new Chart(pibCtx, {
        type: 'bar',
        data: {
          labels: ['Indústria', 'Adm. Pública', 'Serviços', 'Agropecuária'],
          datasets: [{
            data: [32.7, 26.3, 23.0, 18.0],
            backgroundColor: [colorAccent, colorSecondary, '#46b358', 'rgba(255,255,255,0.7)'],
            borderRadius: 8,
            borderSkipped: false,
            barThickness: 28
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0d3a17',
              padding: 12,
              callbacks: { label: ctx => ` ${ctx.parsed.x}% do PIB municipal` }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              max: 40,
              grid: { color: 'rgba(255,255,255,0.08)' },
              ticks: { color: 'rgba(255,255,255,0.7)', font: { size: 11 }, callback: v => v + '%' }
            },
            y: {
              grid: { display: false },
              ticks: { color: 'rgba(255,255,255,0.85)', font: { size: 12, weight: '600' } }
            }
          }
        }
      });
    }
  }

  /* ===== Smooth scroll w/ offset ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

})();
