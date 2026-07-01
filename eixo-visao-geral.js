/* ============================================
   CRAÍBAS: VISÃO GERAL — JS
   Tabs + KPI counters + Chart.js (precipitação, VAB)
   ============================================ */

(function () {
  'use strict';

  /* ===== Header scroll ===== */
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }, { passive: true });
  }

  /* ===== Mobile nav ===== */
  const navToggle = document.getElementById('nav-toggle');
  const navMain = document.getElementById('nav-main');
  if (navToggle && navMain) {
    navToggle.addEventListener('click', () => navMain.classList.toggle('open'));
    navMain.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navMain.classList.remove('open'))
    );
  }

  /* ===== Tabs ===== */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.querySelector(`.tab-panel[data-tab="${target}"]`);
      if (panel) panel.classList.add('active');
      // Scroll suave pro topo do painel
      const tabsNav = document.querySelector('.tabs-nav-wrap');
      if (tabsNav) {
        window.scrollTo({
          top: tabsNav.offsetTop + tabsNav.offsetHeight - 20,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ===== Animated counters =====
     Cada [data-count] JÁ contém o valor final no HTML (fallback estático).
     Anima do 0 até o valor quando entra em viewport. */
  function formatNumber(n, decimals) {
    if (decimals && decimals > 0) {
      return n.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    }
    return Math.floor(n).toLocaleString('pt-BR');
  }

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    if (isNaN(target)) return;
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = formatNumber(value, decimals);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = formatNumber(target, decimals);
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

  /* ===== Back to top ===== */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }, { passive: true });
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== Charts ===== */
  if (typeof Chart === 'undefined') return;

  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = '#5a6b78';

  const colorPrimary = '#1a4a2e';
  const colorPrimaryLight = '#2a8a3d';
  const colorAccent = '#f5a800';
  const colorSecondary = '#7ec8e3';
  const colorMuted = '#e3eae5';

  /* === Precipitação mensal ===
     Fonte: Climatempo · série típica do semiárido alagoano.
     Chuva concentrada entre nov e abril. */
  const precCtx = document.getElementById('chart-precipitacao');
  if (precCtx) {
    const grad = precCtx.getContext('2d').createLinearGradient(0, 0, 0, 260);
    grad.addColorStop(0, 'rgba(126, 200, 227, 0.6)');
    grad.addColorStop(1, 'rgba(126, 200, 227, 0.05)');

    new Chart(precCtx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [{
          label: 'Precipitação (mm)',
          data: [42, 55, 78, 95, 68, 52, 38, 18, 12, 15, 28, 35],
          backgroundColor: (ctx) => {
            const val = ctx.parsed.y;
            return val > 60 ? colorSecondary : val > 30 ? '#a8d8ea' : colorMuted;
          },
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colorPrimary,
            padding: 12,
            titleFont: { size: 13, weight: '700' },
            bodyFont: { size: 13 },
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} mm de chuva`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              font: { size: 11 },
              callback: (v) => v + ' mm'
            }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11, weight: '600' } }
          }
        }
      }
    });
  }

  /* === VAB por setor ===
     Fonte: IBGE Contas Regionais 2021.
     Indústria 32,7% · Adm. Pública 26,3% · Serviços 23,0% · Agropecuária 18,0%. */
  const vabCtx = document.getElementById('chart-vab');
  if (vabCtx) {
    new Chart(vabCtx, {
      type: 'bar',
      data: {
        labels: ['Indústria', 'Administração Pública', 'Serviços', 'Agropecuária'],
        datasets: [{
          data: [32.7, 26.3, 23.0, 18.0],
          backgroundColor: [colorPrimary, colorSecondary, colorPrimaryLight, colorAccent],
          borderRadius: 8,
          borderSkipped: false,
          barThickness: 42
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colorPrimary,
            padding: 12,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.x}% do VAB municipal`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 40,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: {
              font: { size: 12 },
              callback: (v) => v + '%'
            }
          },
          y: {
            grid: { display: false },
            ticks: { font: { size: 13, weight: '700' }, color: '#1a2733' }
          }
        }
      }
    });
  }

})();
