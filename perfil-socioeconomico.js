/* ============================================
   PERFIL SOCIOECONÔMICO — Craíbas · JS
   Tabs · Counters · Charts · Accordions · Modais
   ============================================ */

(function () {
  'use strict';

  /* ===== Header / nav (igual ao index) ===== */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('back-to-top');
  function onScroll() {
    if (window.scrollY > 50) header && header.classList.add('scrolled');
    else header && header.classList.remove('scrolled');
    if (backToTop) {
      if (window.scrollY > 400) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  const navToggle = document.getElementById('nav-toggle');
  const navMain = document.getElementById('nav-main');
  if (navToggle && navMain) {
    navToggle.addEventListener('click', () => navMain.classList.toggle('open'));
    navMain.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => navMain.classList.remove('open'))
    );
  }

  /* ===== Counters (animação igual ao index) ===== */
  function formatNumber(n) { return n.toLocaleString('pt-BR'); }
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      const display = decimals > 0
        ? value.toFixed(decimals).replace('.', ',')
        : formatNumber(Math.floor(value));
      el.textContent = prefix + display + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else {
        const final = decimals > 0
          ? target.toFixed(decimals).replace('.', ',')
          : formatNumber(target);
        el.textContent = prefix + final + suffix;
      }
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

  /* ===== Fade-up reveals ===== */
  const revealEls = document.querySelectorAll(
    '.kpi-card, .chart-card, .health-tile, .activity-card, .accordion-section, ' +
    '.highlight-banner, .info-text-card, .idhm-card, .panel-head, .anchor-stat'
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

  /* ============================================
     CHART.JS — defaults + dados reais
     ============================================ */
  const COLORS = {
    primary: '#1a6b2a',
    primaryDark: '#0d3a17',
    primaryLight: '#2a8a3d',
    accent: '#f5a800',
    accentLight: '#ffc548',
    secondary: '#7ec8e3',
    secondaryDark: '#4ca6c8',
    danger: '#b94e3a',
    grid: 'rgba(26,107,42,0.08)',
    text: '#5a6b78'
  };

  if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = COLORS.text;
    Chart.defaults.plugins.tooltip.backgroundColor = COLORS.primaryDark;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 8;
    Chart.defaults.plugins.tooltip.titleFont = { size: 13, weight: '700' };
    Chart.defaults.plugins.tooltip.bodyFont = { size: 13 };
  }

  const chartInstances = {};

  function gradientFill(canvas, color1, color2) {
    // canvas é o elemento <canvas>; pegamos o 2D context dele.
    const g = canvas.getContext('2d').createLinearGradient(0, 0, 0, 320);
    g.addColorStop(0, color1);
    g.addColorStop(1, color2);
    return g;
  }

  /* ===== DEMOGRAFIA ===== */
  function initDemografia() {
    if (chartInstances.popEvol) return;

    // 1. Evolução populacional (line)
    const c1 = document.getElementById('chart-pop-evolucao');
    if (c1) {
      chartInstances.popEvol = new Chart(c1, {
        type: 'line',
        data: {
          labels: ['1991', '2000', '2010', '2022', '2024', '2025*'],
          datasets: [{
            label: 'Habitantes',
            data: [17816, 20789, 22641, 25397, 26115, 26144],
            borderColor: COLORS.primary,
            backgroundColor: gradientFill(c1, 'rgba(26,107,42,0.35)', 'rgba(26,107,42,0)'),
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#fff',
            pointBorderColor: COLORS.accent,
            pointBorderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ' ' + formatNumber(ctx.parsed.y) + ' hab.' } }
          },
          scales: {
            y: { beginAtZero: false, grid: { color: COLORS.grid }, ticks: { callback: v => (v/1000).toFixed(0) + 'k' } },
            x: { grid: { display: false }, ticks: { font: { weight: '600' } } }
          }
        }
      });
    }

    // 2. Distribuição urbano/rural — evolução empilhada (line / area)
    const c2 = document.getElementById('chart-urb-rural');
    if (c2) {
      chartInstances.urbRural = new Chart(c2, {
        type: 'bar',
        data: {
          labels: ['1991', '2000', '2010', '2022'],
          datasets: [
            {
              label: 'Urbana',
              data: [28.4, 31.8, 32.4, 50.6],
              backgroundColor: COLORS.accent,
              borderRadius: 6,
              stack: 's1'
            },
            {
              label: 'Rural',
              data: [71.6, 68.2, 67.6, 49.4],
              backgroundColor: COLORS.primary,
              borderRadius: 6,
              stack: 's1'
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 16, boxWidth: 12, font: { weight: '600' } } },
            tooltip: { callbacks: { label: ctx => ' ' + ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1) + '%' } }
          },
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: { stacked: true, max: 100, grid: { color: COLORS.grid }, ticks: { callback: v => v + '%' } }
          }
        }
      });
    }

    // 3. Pirâmide etária (bar horizontal divergente)
    // Faixas estimadas a partir de t009 (estrutura etária Censo 2022)
    // Total = 25.397; partição 0-14 (22,2%), 15-64 (68,3%), 65+ (9,4%)
    // Distribuição ~equilibrada por sexo (M ligeiramente maior em jovens, F maior em idosos)
    const pyramidLabels = ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80+'];
    const pyramidM = [-2050, -2150, -1980, -1820, -1450, -1100, -780, -400, -180];
    const pyramidF = [1980, 2080, 1920, 1830, 1480, 1180, 870, 480, 240];

    const c3 = document.getElementById('chart-piramide');
    if (c3) {
      chartInstances.piramide = new Chart(c3, {
        type: 'bar',
        data: {
          labels: pyramidLabels,
          datasets: [
            {
              label: 'Homens',
              data: pyramidM,
              backgroundColor: COLORS.primary,
              borderRadius: 4
            },
            {
              label: 'Mulheres',
              data: pyramidF,
              backgroundColor: COLORS.accent,
              borderRadius: 4
            }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 16, boxWidth: 12, font: { weight: '600' } } },
            tooltip: {
              callbacks: {
                label: ctx => ' ' + ctx.dataset.label + ': ' + formatNumber(Math.abs(ctx.parsed.x)) + ' hab.'
              }
            }
          },
          scales: {
            x: {
              stacked: false,
              grid: { color: COLORS.grid },
              ticks: { callback: v => formatNumber(Math.abs(v)) }
            },
            y: { grid: { display: false }, ticks: { font: { weight: '600' } } }
          }
        }
      });
    }

    // 4. Densidade comparativa (bar)
    const c4 = document.getElementById('chart-densidade');
    if (c4) {
      chartInstances.densidade = new Chart(c4, {
        type: 'bar',
        data: {
          labels: ['São M. dos Campos', 'Taquarana', 'Campo Alegre', 'Craíbas', 'Igreja Nova', 'Água Branca'],
          datasets: [{
            label: 'hab/km²',
            data: [154.88, 123.71, 102.66, 91.07, 50.11, 40.60],
            backgroundColor: ctx => ctx.dataIndex === 3 ? COLORS.accent : COLORS.primary,
            borderRadius: 6,
            barThickness: 22
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ' ' + ctx.parsed.x.toFixed(2) + ' hab/km²' } }
          },
          scales: {
            x: { beginAtZero: true, grid: { color: COLORS.grid } },
            y: { grid: { display: false }, ticks: { font: { weight: '600' } } }
          }
        }
      });
    }
  }

  /* ===== ECONOMIA ===== */
  function initEconomia() {
    if (chartInstances.pibEvol) return;

    // 1. Evolução do PIB (line dual axis)
    const c1 = document.getElementById('chart-pib');
    if (c1) {
      chartInstances.pibEvol = new Chart(c1, {
        type: 'line',
        data: {
          labels: ['2010', '2013', '2015', '2017', '2019', '2021', '2022', '2023'],
          datasets: [{
            label: 'PIB Total (R$ milhões)',
            data: [105.6, 119.0, 183.4, 196.6, 248.6, 480.8, 496.5, 450.2],
            borderColor: COLORS.accent,
            backgroundColor: gradientFill(c1, 'rgba(245,168,0,0.45)', 'rgba(245,168,0,0)'),
            fill: true,
            tension: 0.35,
            borderWidth: 3,
            pointBackgroundColor: '#fff',
            pointBorderColor: COLORS.accent,
            pointBorderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ' R$ ' + ctx.parsed.y.toFixed(1).replace('.', ',') + ' milhões' } }
          },
          scales: {
            y: { beginAtZero: false, grid: { color: COLORS.grid }, ticks: { callback: v => 'R$ ' + v + 'M' } },
            x: { grid: { display: false }, ticks: { font: { weight: '600' } } }
          }
        }
      });
    }

    // 2. VAB por setor (doughnut)
    const c2 = document.getElementById('chart-vab');
    if (c2) {
      chartInstances.vab = new Chart(c2, {
        type: 'doughnut',
        data: {
          labels: ['Indústria', 'Adm. Pública', 'Serviços (privados)', 'Agropecuária'],
          datasets: [{
            data: [32.7, 26.3, 23.0, 18.0],
            backgroundColor: [COLORS.accent, COLORS.primary, COLORS.secondary, COLORS.primaryLight],
            borderColor: '#fff',
            borderWidth: 3,
            hoverOffset: 14
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          cutout: '62%',
          plugins: {
            legend: { position: 'bottom', labels: { padding: 14, boxWidth: 12, font: { size: 12, weight: '600' } } },
            tooltip: { callbacks: { label: ctx => ' ' + ctx.label + ': ' + ctx.parsed.toFixed(1).replace('.', ',') + '% do VAB' } }
          }
        }
      });
    }

    // 3. Emprego formal por setor (bar horizontal)
    const c3 = document.getElementById('chart-emprego');
    if (c3) {
      chartInstances.emprego = new Chart(c3, {
        type: 'bar',
        data: {
          labels: ['Indústria', 'Serviços', 'Comércio', 'Agropecuária'],
          datasets: [{
            label: 'Vínculos',
            data: [962, 247, 149, 3],
            backgroundColor: [COLORS.accent, COLORS.primary, COLORS.secondary, COLORS.primaryLight],
            borderRadius: 8,
            barThickness: 32
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ' ' + formatNumber(ctx.parsed.x) + ' vínculos formais' } }
          },
          scales: {
            x: { beginAtZero: true, grid: { color: COLORS.grid } },
            y: { grid: { display: false }, ticks: { font: { weight: '700' } } }
          }
        }
      });
    }

    // 4. Bolsa Família — evolução mensal 2023-2025 (line)
    const c4 = document.getElementById('chart-bolsa-familia');
    if (c4) {
      const labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
      chartInstances.bolsa = new Chart(c4, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: '2023',
              data: [null,null,4944,4972,5034,5033,5038,5079,5078,5132,5086,5094],
              borderColor: COLORS.secondary,
              backgroundColor: 'transparent',
              tension: 0.35, borderWidth: 2.5, pointRadius: 4
            },
            {
              label: '2024',
              data: [5107,5144,5142,5171,5178,5233,5295,5273,5270,5538,5611,5661],
              borderColor: COLORS.primary,
              backgroundColor: 'transparent',
              tension: 0.35, borderWidth: 2.5, pointRadius: 4
            },
            {
              label: '2025*',
              data: [5657,5745,5808,5823,5819,5824,5584,5489,5597,5563,null,null],
              borderColor: COLORS.accent,
              backgroundColor: 'transparent',
              tension: 0.35, borderWidth: 3, pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 16, boxWidth: 14, font: { weight: '600' } } },
            tooltip: { callbacks: { label: ctx => ' ' + ctx.dataset.label + ': ' + (ctx.parsed.y ? formatNumber(ctx.parsed.y) + ' famílias' : '—') } }
          },
          scales: {
            y: { beginAtZero: false, grid: { color: COLORS.grid }, ticks: { callback: v => formatNumber(v) } },
            x: { grid: { display: false }, ticks: { font: { weight: '600' } } }
          }
        }
      });
    }
  }

  /* ===== SOCIAL ===== */
  function initSocial() {
    if (chartInstances.idhm) return;

    // IDHM gauge (half doughnut)
    const c1 = document.getElementById('chart-idhm-gauge');
    if (c1) {
      const idhm = 0.525;
      chartInstances.idhm = new Chart(c1, {
        type: 'doughnut',
        data: {
          datasets: [{
            data: [idhm * 100, 100 - idhm * 100],
            backgroundColor: [COLORS.accent, '#eef5f0'],
            borderWidth: 0,
            circumference: 180,
            rotation: 270
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          cutout: '78%',
          plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
      });
    }

    // IDHM evolução (line)
    const c2 = document.getElementById('chart-idhm-evol');
    if (c2) {
      chartInstances.idhmEvol = new Chart(c2, {
        type: 'line',
        data: {
          labels: ['1991', '2000', '2010'],
          datasets: [
            {
              label: 'Craíbas',
              data: [0.204, 0.344, 0.525],
              borderColor: COLORS.accent,
              backgroundColor: 'transparent',
              tension: 0.4, borderWidth: 3, pointRadius: 6, pointBackgroundColor: '#fff', pointBorderColor: COLORS.accent, pointBorderWidth: 3
            },
            {
              label: 'Alagoas',
              data: [0.370, 0.471, 0.563],
              borderColor: COLORS.primary,
              backgroundColor: 'transparent',
              borderDash: [6, 4],
              tension: 0.4, borderWidth: 2, pointRadius: 4
            },
            {
              label: 'Brasil',
              data: [0.493, 0.612, 0.659],
              borderColor: COLORS.secondaryDark,
              backgroundColor: 'transparent',
              borderDash: [6, 4],
              tension: 0.4, borderWidth: 2, pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 16, boxWidth: 14, font: { weight: '600' } } },
            tooltip: { callbacks: { label: ctx => ' ' + ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(3).replace('.', ',') } }
          },
          scales: {
            y: { beginAtZero: false, min: 0.1, max: 0.8, grid: { color: COLORS.grid }, ticks: { callback: v => v.toFixed(2).replace('.', ',') } },
            x: { grid: { display: false }, ticks: { font: { weight: '600' } } }
          }
        }
      });
    }

    // Educação — matrículas por nível
    const c3 = document.getElementById('chart-educacao');
    if (c3) {
      chartInstances.educacao = new Chart(c3, {
        type: 'line',
        data: {
          labels: ['2012', '2016', '2019', '2022', '2024'],
          datasets: [
            { label: 'Educação Infantil', data: [804, 808, null, 1332, 1578], borderColor: COLORS.accent, backgroundColor: 'transparent', tension: 0.35, borderWidth: 3, pointRadius: 5, spanGaps: true },
            { label: 'Ensino Fundamental', data: [4824, 4363, 4123, 4020, 3903], borderColor: COLORS.primary, backgroundColor: 'transparent', tension: 0.35, borderWidth: 3, pointRadius: 5 },
            { label: 'Ensino Médio', data: [961, 1111, 883, 1005, 1006], borderColor: COLORS.secondaryDark, backgroundColor: 'transparent', tension: 0.35, borderWidth: 3, pointRadius: 5 }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 16, boxWidth: 14, font: { weight: '600' } } },
            tooltip: { callbacks: { label: ctx => ' ' + ctx.dataset.label + ': ' + (ctx.parsed.y ? formatNumber(ctx.parsed.y) : '—') + ' matrículas' } }
          },
          scales: {
            y: { beginAtZero: false, grid: { color: COLORS.grid } },
            x: { grid: { display: false }, ticks: { font: { weight: '600' } } }
          }
        }
      });
    }

    // Vulnerabilidade (bar)
    const c4 = document.getElementById('chart-vulnerab');
    if (c4) {
      chartInstances.vuln = new Chart(c4, {
        type: 'bar',
        data: {
          labels: ['CadÚnico', 'Beneficiários\nProgramas Federais', 'Bolsa Família\n(2025)', 'Domicílios totais'],
          datasets: [{
            label: 'Famílias / Pessoas',
            data: [8200, 6500, 5691, 9768],
            backgroundColor: [COLORS.primary, COLORS.accent, COLORS.secondaryDark, COLORS.primaryLight],
            borderRadius: 8,
            barThickness: 36
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ' ' + formatNumber(ctx.parsed.y) } }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: COLORS.grid }, ticks: { callback: v => formatNumber(v) } },
            x: { grid: { display: false }, ticks: { font: { size: 11, weight: '600' } } }
          }
        }
      });
    }
  }

  /* ===== SAÚDE ===== */
  function initSaude() {
    if (chartInstances.mortInf) return;

    // Mortalidade infantil (Craíbas vs AL vs BR)
    const c1 = document.getElementById('chart-mortalidade');
    if (c1) {
      chartInstances.mortInf = new Chart(c1, {
        type: 'line',
        data: {
          labels: ['2022', '2023', '2024', '2025*'],
          datasets: [
            {
              label: 'Craíbas',
              data: [21.9, 26.51, 22.4, 19.8],
              borderColor: COLORS.danger,
              backgroundColor: 'rgba(185,78,58,0.12)',
              tension: 0.35, borderWidth: 3, pointRadius: 6,
              pointBackgroundColor: '#fff', pointBorderColor: COLORS.danger, pointBorderWidth: 3,
              fill: true
            },
            {
              label: 'Alagoas',
              data: [13.9, 14.3, 13.8, 13.5],
              borderColor: COLORS.primary,
              backgroundColor: 'transparent',
              borderDash: [6, 4],
              tension: 0.35, borderWidth: 2, pointRadius: 4
            },
            {
              label: 'Brasil',
              data: [12.4, 12.8, 12.6, 12.3],
              borderColor: COLORS.secondaryDark,
              backgroundColor: 'transparent',
              borderDash: [6, 4],
              tension: 0.35, borderWidth: 2, pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 16, boxWidth: 14, font: { weight: '600' } } },
            tooltip: { callbacks: { label: ctx => ' ' + ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(2).replace('.', ',') + ' por mil' } }
          },
          scales: {
            y: { beginAtZero: false, grid: { color: COLORS.grid }, title: { display: true, text: 'óbitos por 1.000 nascidos vivos', font: { size: 11, weight: '600' } } },
            x: { grid: { display: false }, ticks: { font: { weight: '600' } } }
          }
        }
      });
    }

    // Expectativa de vida (line)
    const c2 = document.getElementById('chart-expectativa');
    if (c2) {
      chartInstances.expVida = new Chart(c2, {
        type: 'line',
        data: {
          labels: ['1990', '2000', '2010'],
          datasets: [{
            label: 'Anos',
            data: [55, 67, 75],
            borderColor: COLORS.primary,
            backgroundColor: gradientFill(c2, 'rgba(26,107,42,0.4)', 'rgba(26,107,42,0)'),
            fill: true,
            tension: 0.4, borderWidth: 3,
            pointBackgroundColor: '#fff', pointBorderColor: COLORS.accent, pointBorderWidth: 3, pointRadius: 6
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => ' ' + ctx.parsed.y + ' anos (estimativa)' } }
          },
          scales: {
            y: { beginAtZero: false, min: 40, max: 85, grid: { color: COLORS.grid }, ticks: { callback: v => v + ' anos' } },
            x: { grid: { display: false }, ticks: { font: { weight: '600' } } }
          }
        }
      });
    }
  }

  /* ============================================
     TABS
     ============================================ */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function activateTab(name) {
    tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    tabPanels.forEach(p => p.classList.toggle('active', p.dataset.tab === name));

    // lazy init charts
    if (name === 'demografia') initDemografia();
    else if (name === 'economia') initEconomia();
    else if (name === 'social') initSocial();
    else if (name === 'saude') initSaude();
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.tab;
      history.replaceState(null, '', '#' + name);
      activateTab(name);
      // scroll to tabs nav
      const wrap = document.querySelector('.tabs-nav-wrap');
      if (wrap) {
        const top = wrap.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Anchor stat buttons → activate tab
  document.querySelectorAll('.anchor-stat[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.target;
      history.replaceState(null, '', '#' + name);
      activateTab(name);
      const wrap = document.querySelector('.tabs-nav-wrap');
      if (wrap) {
        const top = wrap.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // Deep link
  function readHash() {
    const h = (window.location.hash || '#demografia').replace('#', '');
    const valid = ['demografia', 'economia', 'social', 'saude'];
    return valid.includes(h) ? h : 'demografia';
  }
  activateTab(readHash());

  /* ============================================
     ACCORDIONS
     ============================================ */
  document.querySelectorAll('.accordion-trigger').forEach(trig => {
    trig.addEventListener('click', () => {
      const section = trig.closest('.accordion-section');
      section.classList.toggle('open');
    });
  });

  /* ============================================
     MODAL (atividades econômicas)
     ============================================ */
  const modalOverlay = document.getElementById('modal-overlay');
  const modalContent = document.getElementById('modal-content');

  const modalData = {
    mineracao: {
      img: 'images/mineracao-mapa.jpeg',
      title: 'Mineração — Projeto Serrote',
      body: `<p>A mineração constitui potencial econômico relevante em Craíbas, especialmente em razão da presença
        de substâncias minerais de interesse econômico (cobre, calcário e areia) e da existência de processos minerários e
        empreendimentos associados. O <strong>Projeto Serrote</strong>, voltado à extração de cobre, é o principal
        empreendimento ativo no município.</p>
        <p>O setor industrial — fortemente influenciado pela mineração — responde por <strong>32,7% do VAB municipal</strong>
        (R$ 150,3 milhões em 2021), sendo o setor de maior peso na economia local. O aproveitamento sustentável
        depende de regulação adequada e de articulação com objetivos mais amplos de desenvolvimento.</p>`,
      stats: [
        { num: '32,7%', label: 'do VAB' },
        { num: '962', label: 'vínculos formais' },
        { num: 'R$ 150M', label: 'em VAB (2021)' }
      ]
    },
    fumicultura: {
      img: 'images/fumicultura.png',
      title: 'Fumicultura',
      body: `<p>A fumicultura é uma das atividades agropecuárias mais tradicionais do município, ocupando
        áreas significativas no território rural. O cultivo do fumo está associado à organização familiar
        da produção, com forte presença de pequenos produtores.</p>
        <p>Junto com a mandioca e a bovinocultura/caprinocultura, integra a base agropecuária de Craíbas,
        setor que responde por <strong>18,0% do VAB</strong> municipal (R$ 82,7 milhões em 2021).</p>`,
      stats: [
        { num: '18,0%', label: 'do VAB' },
        { num: 'Tradicional', label: 'cultivo familiar' },
        { num: 'Caatinga', label: 'bioma local' }
      ]
    },
    mandioca: {
      img: 'images/mandioca.jpeg',
      title: 'Mandiocultura',
      body: `<p>A mandiocultura é cultura estratégica para a agricultura familiar de Craíbas, com forte vocação
        para a Caatinga e papel central na soberania alimentar local. A produção alimenta tanto o consumo
        familiar quanto pequenas casas de farinha distribuídas no território.</p>
        <p>O setor agropecuário emprega formalmente apenas 3 trabalhadores em 2024 — a esmagadora maioria da
        produção é informal/familiar, escapando aos registros da RAIS, o que indica desafio relevante para
        políticas de qualificação produtiva.</p>`,
      stats: [
        { num: '3', label: 'vínculos formais' },
        { num: 'Familiar', label: 'organização produtiva' },
        { num: 'Alimentar', label: 'segurança regional' }
      ]
    }
  };

  function openModal(key) {
    const data = modalData[key];
    if (!data) return;
    modalContent.innerHTML = `
      <button class="modal-close" aria-label="Fechar"><i class="fas fa-times"></i></button>
      <img src="${data.img}" alt="${data.title}" class="modal-img"/>
      <div class="modal-body">
        <h2>${data.title}</h2>
        ${data.body}
        <div class="modal-stats">
          ${data.stats.map(s => `<div class="modal-stat"><strong>${s.num}</strong><span>${s.label}</span></div>`).join('')}
        </div>
      </div>
    `;
    modalOverlay.classList.add('open');
    modalContent.querySelector('.modal-close').addEventListener('click', closeModal);
  }
  function closeModal() {
    modalOverlay.classList.remove('open');
    modalContent.innerHTML = '';
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
    });
  }
  document.querySelectorAll('[data-modal]').forEach(el => {
    el.addEventListener('click', () => openModal(el.dataset.modal));
  });

  /* ============================================
     Smooth scroll com offset
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length > 1 && !href.startsWith('#tab-')) {
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
