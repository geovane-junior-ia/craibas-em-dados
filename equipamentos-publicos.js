/* ============================================
   EQUIPAMENTOS PÚBLICOS — Dashboard Craíbas
   Estado central · filtros cruzados · mapa SVG · charts dinâmicos
   ============================================ */

(function () {
  'use strict';

  /* ============================================
     1. DADOS REAIS (consolidados dos CSVs)
     ============================================ */
  const CATEGORIES = {
    saude:       { label: 'Saúde',         color: '#e74c3c', icon: 'fa-heart-pulse',     class: 'cat-saude' },
    educacao:    { label: 'Educação',      color: '#3498db', icon: 'fa-graduation-cap',  class: 'cat-educacao' },
    assistencia: { label: 'Assistência Social', color: '#9b59b6', icon: 'fa-hands-holding',   class: 'cat-assistencia' },
    seguranca:   { label: 'Segurança',     color: '#34495e', icon: 'fa-user-shield',      class: 'cat-seguranca' },
    esporte:     { label: 'Esporte/Lazer', color: '#2ecc71', icon: 'fa-futbol',          class: 'cat-esporte' },
    outros:      { label: 'Outros',        color: '#f39c12', icon: 'fa-building',        class: 'cat-outros' }
  };

  // Layout de coordenadas SVG aproximadas (não geográficas — espaciais para visualização)
  // viewBox: 0 0 800 600. Centro urbano em (400,300). Povoados rurais espalhados.
  const EQUIPAMENTOS = [
    // ===== SAÚDE — 12 UBS + outros (t111, diagnostico.md) =====
    { id:'s01', cat:'saude', tipo:'UBS', nome:'UBS Craíbas I', endereco:'Rua Nossa Senhora da Salete, Centro', zona:'Urbana', x:395, y:295 },
    { id:'s02', cat:'saude', tipo:'UBS', nome:'UBS Craíbas II', endereco:'Rua Nossa Senhora da Salete, Centro', zona:'Urbana', x:410, y:308 },
    { id:'s03', cat:'saude', tipo:'UBS', nome:'UBS Edvaldo Correia', endereco:'Rua Santo Antônio, COHAB, Craíbas', zona:'Urbana', x:430, y:280 },
    { id:'s04', cat:'saude', tipo:'UBS', nome:'UBS Elenita Mendes', endereco:'Rua Ulisses Paulino, II - 03', zona:'Urbana', x:380, y:330 },
    { id:'s05', cat:'saude', tipo:'UBS', nome:'UBS Expedito Luiz', endereco:'Sítio Ipojuco, Zona Rural', zona:'Rural', x:200, y:200 },
    { id:'s06', cat:'saude', tipo:'UBS', nome:'UBS José Simão', endereco:'Sítio Serrote, Zona Rural', zona:'Rural', x:600, y:180 },
    { id:'s07', cat:'saude', tipo:'UBS', nome:'UBS Lagoa da Angélica', endereco:'Povoado Lagoa da Angélica, Zona Rural', zona:'Rural', x:150, y:380 },
    { id:'s08', cat:'saude', tipo:'UBS', nome:'UBS Nossa Senhora Aparecida', endereco:'Povoado Lagoa do Algodão, Zona Rural', zona:'Rural', x:680, y:420 },
    { id:'s09', cat:'saude', tipo:'UBS', nome:'UBS Rosa Mística', endereco:'Povoado Folha Miúda', zona:'Rural', x:240, y:480 },
    { id:'s10', cat:'saude', tipo:'UBS', nome:'UBS Santo Antônio', endereco:'Povoado Santo Antônio, Zona Rural', zona:'Rural', x:560, y:500 },
    { id:'s11', cat:'saude', tipo:'UBS', nome:'UBS São Cristóvão', endereco:'Povoado Santa Rosa, Zona Rural', zona:'Rural', x:120, y:300 },
    { id:'s12', cat:'saude', tipo:'UBS', nome:'UBS Rozendo José de Farias', endereco:'Rua Nossa Senhora da Salete, Centro', zona:'Urbana', x:420, y:295 },
    { id:'s13', cat:'saude', tipo:'Maternidade 24h', nome:'Casa Maternal Frei Damião', endereco:'Centro, Craíbas — atendimento 24h', zona:'Urbana', x:400, y:270 },
    { id:'s14', cat:'saude', tipo:'CAPS', nome:'CAPS Sebastião Malaquias da Silva', endereco:'Centro, Craíbas — saúde mental', zona:'Urbana', x:370, y:285 },
    { id:'s15', cat:'saude', tipo:'CEO', nome:'Centro de Especialidades Odontológicas', endereco:'Centro, Craíbas', zona:'Urbana', x:445, y:315 },
    { id:'s16', cat:'saude', tipo:'Reabilitação', nome:'Centro de Reabilitação Adilson Abel da Silva', endereco:'Centro, Craíbas', zona:'Urbana', x:455, y:340 },
    { id:'s17', cat:'saude', tipo:'Especialidades', nome:'Centro de Especialidades Médicas de Craíbas', endereco:'Centro, Craíbas', zona:'Urbana', x:360, y:310 },
    { id:'s18', cat:'saude', tipo:'Especialidades', nome:'Centro de Especialidades Alice Rodrigues', endereco:'Centro, Craíbas', zona:'Urbana', x:475, y:300 },
    { id:'s19', cat:'saude', tipo:'Laboratório', nome:'Laboratório de Análises Clínicas de Craíbas', endereco:'Centro, Craíbas', zona:'Urbana', x:390, y:340 },
    { id:'s20', cat:'saude', tipo:'Vigilância', nome:'Núcleo de Vigilância Sanitária', endereco:'Centro, Craíbas', zona:'Urbana', x:425, y:265 },
    { id:'s21', cat:'saude', tipo:'Academia', nome:'Polo de Academia da Saúde de Craíbas', endereco:'Centro, Craíbas', zona:'Urbana', x:355, y:265 },
    { id:'s22', cat:'saude', tipo:'Gestão', nome:'Secretaria Municipal de Saúde', endereco:'Centro, Craíbas — órgão central de gestão', zona:'Urbana', x:415, y:330 },

    // ===== EDUCAÇÃO — 27 escolas municipais (t103) =====
    { id:'e01', cat:'educacao', tipo:'Educação Infantil', nome:'CMEI Arlene Simplício dos Santos', endereco:'Rua São Pedro, 49, Centro', zona:'Urbana', x:400, y:310 },
    { id:'e02', cat:'educacao', tipo:'Educação Infantil', nome:'CMEI Alice Maria de Souza', endereco:'Folha Miúda', zona:'Rural', x:230, y:475 },
    { id:'e03', cat:'educacao', tipo:'Educação Infantil', nome:'Creche Emília Moreira dos Santos', endereco:'Povoado São João', zona:'Rural', x:520, y:440 },
    { id:'e04', cat:'educacao', tipo:'Multietapas', nome:'Esc. Mun. Alonso de Abreu Pereira Filho', endereco:'Sítio Lagoa Nova', zona:'Rural', x:300, y:155 },
    { id:'e05', cat:'educacao', tipo:'Fundamental', nome:'Esc. Mun. Ana Carolina de Queiroz', endereco:'Centro', zona:'Urbana', x:390, y:280 },
    { id:'e06', cat:'educacao', tipo:'Multietapas', nome:'Esc. Mun. Antônio Jovino da Silva', endereco:'Sítio Lagoa do Mel', zona:'Rural', x:160, y:240 },
    { id:'e07', cat:'educacao', tipo:'Multietapas', nome:'Esc. Mun. Delmiro Soares da Silva', endereco:'Sítio Lagoa Da Cruz', zona:'Rural', x:580, y:540 },
    { id:'e08', cat:'educacao', tipo:'Multietapas', nome:'Esc. Mun. Dr. José Pereira Mendes', endereco:'Povoado Bom Jesus', zona:'Rural', x:640, y:230 },
    { id:'e09', cat:'educacao', tipo:'Outras', nome:'Esc. Mun. Edvaldo Correia Barbosa', endereco:'Zona Rural', zona:'Rural', x:710, y:340 },
    { id:'e10', cat:'educacao', tipo:'Outras', nome:'Esc. Mun. Francisco Paulino da Silva', endereco:'Zona Rural', zona:'Rural', x:90, y:430 },
    { id:'e11', cat:'educacao', tipo:'Multietapas', nome:'Esc. Mun. Graciliano Ramos', endereco:'Sítio Alto Grande', zona:'Rural', x:520, y:130 },
    { id:'e12', cat:'educacao', tipo:'Multietapas', nome:'Esc. Mun. João Francisco da Silva', endereco:'Sítio Esporão', zona:'Rural', x:175, y:155 },
    { id:'e13', cat:'educacao', tipo:'Multietapas', nome:'Esc. Mun. Jorge de Lima', endereco:'Sítio Areia Branca', zona:'Rural', x:660, y:130 },
    { id:'e14', cat:'educacao', tipo:'Multietapas', nome:'Esc. Mun. José Aprígio da Silva', endereco:'Sítio Pau Ferro', zona:'Rural', x:80, y:250 },
    { id:'e15', cat:'educacao', tipo:'Outras', nome:'Esc. Mun. Manoel Neres dos Santos Filho', endereco:'Zona Rural', zona:'Rural', x:115, y:355 },
    { id:'e16', cat:'educacao', tipo:'Outras', nome:'Esc. Mun. Manoel Vieira da Silva', endereco:'Zona Rural', zona:'Rural', x:730, y:280 },
    { id:'e17', cat:'educacao', tipo:'Outras', nome:'Esc. Mun. Maria Nunes da Silva', endereco:'Zona Rural', zona:'Rural', x:265, y:115 },
    { id:'e18', cat:'educacao', tipo:'Outras', nome:'Esc. Mun. Odilon Francisco Lima', endereco:'Zona Rural', zona:'Rural', x:680, y:480 },
    { id:'e19', cat:'educacao', tipo:'Multietapas', nome:'Esc. Mun. Olavo Bilac', endereco:'Sítio Bonito', zona:'Rural', x:280, y:540 },
    { id:'e20', cat:'educacao', tipo:'Fundamental + EJA', nome:'Esc. Mun. Padre José Theisen', endereco:'Conjunto Habitacional, Centro', zona:'Urbana', x:445, y:330 },
    { id:'e21', cat:'educacao', tipo:'Outras', nome:'Esc. Mun. Pedro Nunes Sobrinho', endereco:'Centro', zona:'Urbana', x:380, y:295 },
    { id:'e22', cat:'educacao', tipo:'Multietapas', nome:'Esc. Mun. Pedro Ramos Francisco', endereco:'Zona Rural', zona:'Rural', x:610, y:380 },
    { id:'e23', cat:'educacao', tipo:'Multietapas', nome:'Esc. Mun. Profª Hilda Mateus Oliveira', endereco:'Sítio Serrote Grande', zona:'Rural', x:615, y:200 },
    { id:'e24', cat:'educacao', tipo:'Outras', nome:'Esc. Mun. São Sebastião', endereco:'Zona Rural', zona:'Rural', x:495, y:560 },
    { id:'e25', cat:'educacao', tipo:'Fundamental + EJA', nome:'Esc. Mun. Ten. Cel. José Barros Paes', endereco:'Rua Francisco Gama, Centro', zona:'Urbana', x:415, y:285 },
    { id:'e26', cat:'educacao', tipo:'Outras', nome:'Esc. Mun. Ver. Antônio Ventura de Oliveira', endereco:'Zona Rural', zona:'Rural', x:185, y:510 },
    { id:'e27', cat:'educacao', tipo:'Multietapas', nome:'Esc. Mun. José Luiz dos Santos', endereco:'Zona Rural', zona:'Rural', x:725, y:175 },
    // Estaduais (t109)
    { id:'e28', cat:'educacao', tipo:'Ensino Médio', nome:'Escola de Educação Básica 21 de Abril', endereco:'Rua Manoel Antônio de Jesus, 118, Centro', zona:'Urbana', x:425, y:300 },
    { id:'e29', cat:'educacao', tipo:'Multietapas', nome:'Escola de Educação Básica Alegria do Saber', endereco:'Rua Sete de Setembro, 188, Centro', zona:'Urbana', x:405, y:325 },

    // ===== ASSISTÊNCIA SOCIAL =====
    { id:'a01', cat:'assistencia', tipo:'CRAS', nome:'CRAS — Centro de Referência da Assistência Social', endereco:'Rua Pedro Ramos, s/n, Centro — PAIF e CadÚnico', zona:'Urbana', x:385, y:340 },
    { id:'a02', cat:'assistencia', tipo:'CREAS', nome:'CREAS — Centro de Referência Especializado', endereco:'Rua Nossa Senhora da Conceição, Centro — PAEFI', zona:'Urbana', x:445, y:280 },

    // ===== SEGURANÇA =====
    { id:'g01', cat:'seguranca', tipo:'CISP', nome:'CISP — Centro Integrado de Segurança Pública', endereco:'Centro, acesso pela AL-220 (PMAL + PCAL)', zona:'Urbana', x:430, y:255 },
    { id:'g02', cat:'seguranca', tipo:'Guarda Municipal', nome:'Guarda Municipal de Craíbas', endereco:'Centro — proteção de prédios públicos e trânsito', zona:'Urbana', x:355, y:355 },

    // ===== ESPORTE / LAZER (praças e equipamentos) =====
    { id:'l01', cat:'esporte', tipo:'Praça', nome:'Praça Manoel Nunes', endereco:'Centro, Craíbas', zona:'Urbana', x:395, y:265 },
    { id:'l02', cat:'esporte', tipo:'Praça', nome:'Praça Domingos Antônio Teixeira', endereco:'Centro, Craíbas', zona:'Urbana', x:460, y:325 },
    { id:'l03', cat:'esporte', tipo:'Praça', nome:'Praça da Bíblia', endereco:'Centro, Craíbas', zona:'Urbana', x:340, y:300 },
    { id:'l04', cat:'esporte', tipo:'Praça', nome:'Praça Manoel Ferreira Santos', endereco:'Centro, Craíbas', zona:'Urbana', x:475, y:355 },
    { id:'l05', cat:'esporte', tipo:'Praça', nome:'Praça de Alimentação', endereco:'Centro, Craíbas', zona:'Urbana', x:415, y:355 },
    { id:'l06', cat:'esporte', tipo:'Ginásio', nome:'Ginásio Poliesportivo Municipal', endereco:'Centro, Craíbas', zona:'Urbana', x:330, y:340 },
    { id:'l07', cat:'esporte', tipo:'Campo', nome:'Campo de Futebol Municipal', endereco:'Centro, Craíbas', zona:'Urbana', x:485, y:255 }
  ];

  /* ============================================
     2. ESTADO CENTRAL DO DASHBOARD
     ============================================ */
  const state = {
    filters: {
      categoria: 'todas',
      tipo: 'todos',
      zona: 'todas',
      busca: ''
    },
    selectedId: null,
    sort: 'nome'
  };

  function getFiltered() {
    return EQUIPAMENTOS.filter(eq => {
      if (state.filters.categoria !== 'todas' && eq.cat !== state.filters.categoria) return false;
      if (state.filters.tipo !== 'todos' && eq.tipo !== state.filters.tipo) return false;
      if (state.filters.zona !== 'todas' && eq.zona !== state.filters.zona) return false;
      if (state.filters.busca) {
        const q = state.filters.busca.toLowerCase();
        return eq.nome.toLowerCase().includes(q) || eq.endereco.toLowerCase().includes(q);
      }
      return true;
    });
  }

  /* ============================================
     3. RENDERS
     ============================================ */

  // ----- Filter dropdowns populate -----
  function populateFilters() {
    const tipoSelect = document.getElementById('filter-tipo');
    const filteredByCat = state.filters.categoria === 'todas'
      ? EQUIPAMENTOS
      : EQUIPAMENTOS.filter(e => e.cat === state.filters.categoria);
    const tipos = [...new Set(filteredByCat.map(e => e.tipo))].sort();
    const currentValue = tipoSelect.value;
    tipoSelect.innerHTML = '<option value="todos">Todos os tipos</option>' +
      tipos.map(t => `<option value="${t}">${t}</option>`).join('');
    if (tipos.includes(currentValue)) tipoSelect.value = currentValue;
    else { tipoSelect.value = 'todos'; state.filters.tipo = 'todos'; }
  }

  // ----- Summary stats (top) -----
  function renderSummaryStats() {
    const filtered = getFiltered();
    const container = document.getElementById('summary-stats');

    const cats = ['saude', 'educacao', 'assistencia', 'seguranca', 'esporte'];
    const html = `
      ${cats.map(catKey => {
        const c = CATEGORIES[catKey];
        const count = EQUIPAMENTOS.filter(e => e.cat === catKey).length;
        const isActive = state.filters.categoria === catKey;
        return `<button class="summary-stat ${c.class} ${isActive ? 'active' : ''}"
                  data-cat="${catKey}">
          <div class="summary-stat-icon"><i class="fas ${c.icon}"></i></div>
          <div class="summary-stat-num" data-anim>${count}</div>
          <div class="summary-stat-label">${c.label}</div>
        </button>`;
      }).join('')}
    `;
    container.innerHTML = html;
    container.querySelectorAll('.summary-stat').forEach(btn => {
      btn.addEventListener('click', () => {
        state.filters.categoria = btn.dataset.cat;
        document.getElementById('filter-categoria').value = btn.dataset.cat;
        populateFilters();
        renderAll();
      });
    });
  }

  // ----- KPI mini cards -----
  function renderKpis() {
    const filtered = getFiltered();
    const container = document.getElementById('kpi-mini-grid');
    const total = filtered.length;
    const urbano = filtered.filter(e => e.zona === 'Urbana').length;
    const rural = filtered.filter(e => e.zona === 'Rural').length;
    const tiposUnicos = new Set(filtered.map(e => e.tipo)).size;

    container.innerHTML = `
      <div class="kpi-mini" style="--cat-color: var(--primary);">
        <div class="kpi-mini-icon"><i class="fas fa-list-check"></i></div>
        <div class="kpi-mini-text">
          <div class="kpi-mini-num">${total}</div>
          <div class="kpi-mini-label">Equipamentos<br>filtrados</div>
        </div>
      </div>
      <div class="kpi-mini" style="--cat-color: var(--accent);">
        <div class="kpi-mini-icon"><i class="fas fa-city"></i></div>
        <div class="kpi-mini-text">
          <div class="kpi-mini-num">${urbano}</div>
          <div class="kpi-mini-label">Zona<br>urbana</div>
        </div>
      </div>
      <div class="kpi-mini" style="--cat-color: var(--secondary-dark);">
        <div class="kpi-mini-icon"><i class="fas fa-tree"></i></div>
        <div class="kpi-mini-text">
          <div class="kpi-mini-num">${rural}</div>
          <div class="kpi-mini-label">Zona<br>rural</div>
        </div>
      </div>
      <div class="kpi-mini" style="--cat-color: #f39c12;">
        <div class="kpi-mini-icon"><i class="fas fa-tags"></i></div>
        <div class="kpi-mini-text">
          <div class="kpi-mini-num">${tiposUnicos}</div>
          <div class="kpi-mini-label">Tipos<br>distintos</div>
        </div>
      </div>
    `;
  }

  // ----- Charts (mini bar charts dos cards direitos) -----
  let chartCategoria = null;
  let chartZona = null;

  function renderCharts() {
    const filtered = getFiltered();

    // Por categoria
    const cats = Object.keys(CATEGORIES);
    const catCounts = cats.map(c => filtered.filter(e => e.cat === c).length);
    const catLabels = cats.map(c => CATEGORIES[c].label);
    const catColors = cats.map(c => CATEGORIES[c].color);

    const ctxCat = document.getElementById('chart-categoria');
    if (ctxCat) {
      if (chartCategoria) {
        chartCategoria.data.datasets[0].data = catCounts;
        chartCategoria.update('none');
      } else {
        chartCategoria = new Chart(ctxCat, {
          type: 'bar',
          data: {
            labels: catLabels,
            datasets: [{
              data: catCounts,
              backgroundColor: catColors,
              borderRadius: 6,
              barThickness: 18
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true, maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { callbacks: { label: ctx => ' ' + ctx.parsed.x + ' equipamentos' } }
            },
            scales: {
              x: { beginAtZero: true, grid: { color: 'rgba(26,107,42,0.06)' }, ticks: { font: { size: 11 } } },
              y: { grid: { display: false }, ticks: { font: { size: 12, weight: '600' } } }
            },
            onClick: (evt, elements) => {
              if (elements && elements.length > 0) {
                const idx = elements[0].index;
                const catKey = cats[idx];
                state.filters.categoria = catKey === state.filters.categoria ? 'todas' : catKey;
                document.getElementById('filter-categoria').value = state.filters.categoria;
                populateFilters();
                renderAll();
              }
            }
          }
        });
      }
    }

    // Urbana × Rural
    const urb = filtered.filter(e => e.zona === 'Urbana').length;
    const rur = filtered.filter(e => e.zona === 'Rural').length;
    const ctxZona = document.getElementById('chart-zona');
    if (ctxZona) {
      if (chartZona) {
        chartZona.data.datasets[0].data = [urb, rur];
        chartZona.update('none');
      } else {
        chartZona = new Chart(ctxZona, {
          type: 'doughnut',
          data: {
            labels: ['Urbana', 'Rural'],
            datasets: [{
              data: [urb, rur],
              backgroundColor: ['#f5a800', '#7ec8e3'],
              borderColor: '#fff',
              borderWidth: 3,
              hoverOffset: 10
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
              legend: { position: 'bottom', labels: { padding: 10, boxWidth: 10, font: { size: 11, weight: '600' } } },
              tooltip: { callbacks: { label: ctx => ' ' + ctx.label + ': ' + ctx.parsed + ' equipamentos' } }
            },
            onClick: (evt, elements) => {
              if (elements && elements.length > 0) {
                const idx = elements[0].index;
                const z = idx === 0 ? 'Urbana' : 'Rural';
                state.filters.zona = state.filters.zona === z ? 'todas' : z;
                document.getElementById('filter-zona').value = state.filters.zona;
                renderAll();
              }
            }
          }
        });
      }
    }
  }

  // ----- Mapa Leaflet (tiles reais OSM/CartoDB) -----
  let leafletMap = null;
  const markersById = {};

  // Centro do mapa (lat, lng) — Praça Manoel Nunes (referência geográfica do Centro).
  // Coord verificada via OSM, vem do banco central data/craibas-locations.js
  const CRAIBAS_CENTER = (window.CRAIBAS_LOCATIONS && window.CRAIBAS_LOCATIONS.pracas['Praça Manoel Nunes'])
    ? [window.CRAIBAS_LOCATIONS.pracas['Praça Manoel Nunes'].lat,
       window.CRAIBAS_LOCATIONS.pracas['Praça Manoel Nunes'].lng]
    : [-9.6169, -36.7685]; // fallback

  // Coordenadas geocodificadas via Nominatim/OpenStreetMap (✓ = verificado, ~ = aproximado).
  // O matching prefere a chave MAIS LONGA — então 'sítio lagoa do mel' bate antes de 'lagoa do mel'.
  const LOCAL_COORDS = {
    // ===== RUAS URBANAS (✓ Nominatim) =====
    'rua pedro gama':                { lat: -9.6184, lng: -36.7678 }, // ✓ (Prefeitura)
    'rua são pedro':                 { lat: -9.6192, lng: -36.7691 }, // ✓ (CMEI Arlene)
    'rua sao pedro':                 { lat: -9.6192, lng: -36.7691 },
    'rua sete de setembro':          { lat: -9.6159, lng: -36.7649 }, // ✓ (Esc. Alegria)
    'rua francisco gama':            { lat: -9.6199, lng: -36.7709 }, // ✓ (Esc. Ten. Cel.)
    'rua santo antônio':             { lat: -9.6160, lng: -36.7626 }, // ✓ (UBS Edvaldo Correia)
    'rua santo antonio':             { lat: -9.6160, lng: -36.7626 },
    'rua manoel antônio de jesus':   { lat: -9.6165, lng: -36.7645 }, // ✓ (Esc. 21 de Abril)
    'rua manoel antonio de jesus':   { lat: -9.6165, lng: -36.7645 },
    'rua do matadouro':              { lat: -9.6229, lng: -36.7739 }, // ✓ (CISP)
    'al-220':                        { lat: -9.6229, lng: -36.7739 }, // CISP referência
    'rua 15 de novembro':            { lat: -9.6125, lng: -36.7698 }, // ✓
    'rua 23 de abril':               { lat: -9.6176, lng: -36.7735 }, // ✓
    'rua santa rosa':                { lat: -9.6249, lng: -36.7602 }, // ✓
    'rua pau ferro':                 { lat: -9.6235, lng: -36.7713 }, // ✓
    'praça manoel nunes':            { lat: -9.6169, lng: -36.7685 }, // ✓
    'praca manoel nunes':            { lat: -9.6169, lng: -36.7685 },

    // Ruas não indexadas — aproximação no Centro
    'rua nossa senhora da salete':   { lat: -9.6175, lng: -36.7682 }, // ~ Centro
    'rua nossa senhora da conceição':{ lat: -9.6172, lng: -36.7680 }, // ~ Centro (CREAS)
    'rua nossa senhora da conceicao':{ lat: -9.6172, lng: -36.7680 },
    'rua pedro ramos':               { lat: -9.6180, lng: -36.7672 }, // ~ Centro (CRAS)
    'rua ulisses paulino':           { lat: -9.6190, lng: -36.7700 }, // ~ Centro

    // ===== ZONAS GENÉRICAS =====
    'centro':                        { lat: -9.6168, lng: -36.7685 }, // ✓ (centroide cidade)
    'cohab':                         { lat: -9.6155, lng: -36.7660 }, // ~
    'conjunto habitacional':         { lat: -9.6178, lng: -36.7680 }, // ~

    // ===== POVOADOS RURAIS =====
    // Folha Miúda confirmada via OSM (-9.7033, -36.7952 — ao sul do município)
    'sítio folha miúda':             { lat: -9.7033, lng: -36.7952 }, // ✓
    'sitio folha miuda':             { lat: -9.7033, lng: -36.7952 },
    'folha miúda':                   { lat: -9.7033, lng: -36.7952 }, // ✓
    'folha miuda':                   { lat: -9.7033, lng: -36.7952 },

    // Demais povoados — aproximação por quadrante (OSM não indexa rural pequeno)
    'sítio ipojuco':                 { lat: -9.5870, lng: -36.7940 }, // ~ NW
    'sitio ipojuco':                 { lat: -9.5870, lng: -36.7940 },
    'sítio serrote grande':          { lat: -9.6020, lng: -36.7510 }, // ~ NE
    'sitio serrote grande':          { lat: -9.6020, lng: -36.7510 },
    'sítio serrote':                 { lat: -9.5990, lng: -36.7460 }, // ~ NE
    'sitio serrote':                 { lat: -9.5990, lng: -36.7460 },
    'sítio lagoa nova':              { lat: -9.6080, lng: -36.7900 }, // ~ NW
    'sitio lagoa nova':              { lat: -9.6080, lng: -36.7900 },
    'sítio lagoa do mel':            { lat: -9.6280, lng: -36.7960 }, // ~ W
    'sitio lagoa do mel':            { lat: -9.6280, lng: -36.7960 },
    'sítio lagoa da cruz':           { lat: -9.6520, lng: -36.7350 }, // ~ SE
    'sitio lagoa da cruz':           { lat: -9.6520, lng: -36.7350 },
    'sítio alto grande':             { lat: -9.5980, lng: -36.7570 }, // ~ N
    'sitio alto grande':             { lat: -9.5980, lng: -36.7570 },
    'sítio esporão':                 { lat: -9.6080, lng: -36.8100 }, // ~ W
    'sítio esporao':                 { lat: -9.6080, lng: -36.8100 },
    'sitio esporão':                 { lat: -9.6080, lng: -36.8100 },
    'sitio esporao':                 { lat: -9.6080, lng: -36.8100 },
    'sítio areia branca':            { lat: -9.5980, lng: -36.7300 }, // ~ NE
    'sitio areia branca':            { lat: -9.5980, lng: -36.7300 },
    'sítio pau ferro':               { lat: -9.6450, lng: -36.7950 }, // ~ SW (RURAL — não confundir com Rua Pau Ferro urbana)
    'sitio pau ferro':               { lat: -9.6450, lng: -36.7950 },
    'sítio bonito':                  { lat: -9.6650, lng: -36.7780 }, // ~ S
    'sitio bonito':                  { lat: -9.6650, lng: -36.7780 },

    'povoado lagoa da angélica':     { lat: -9.6500, lng: -36.7950 }, // ~ S
    'povoado lagoa da angelica':     { lat: -9.6500, lng: -36.7950 },
    'lagoa da angélica':             { lat: -9.6500, lng: -36.7950 },
    'lagoa da angelica':             { lat: -9.6500, lng: -36.7950 },
    'povoado lagoa do algodão':      { lat: -9.6500, lng: -36.7400 }, // ~ SE
    'povoado lagoa do algodao':      { lat: -9.6500, lng: -36.7400 },
    'lagoa do algodão':              { lat: -9.6500, lng: -36.7400 },
    'lagoa do algodao':              { lat: -9.6500, lng: -36.7400 },
    'povoado santo antônio':         { lat: -9.6580, lng: -36.7280 }, // ~ SE
    'povoado santo antonio':         { lat: -9.6580, lng: -36.7280 },
    'povoado santa rosa':            { lat: -9.6280, lng: -36.8000 }, // ~ SW
    'povoado bom jesus':             { lat: -9.5800, lng: -36.7150 }, // ~ NE
    'povoado são joão':              { lat: -9.6420, lng: -36.7280 }, // ~ SE
    'povoado sao joao':              { lat: -9.6420, lng: -36.7280 },

    'são joão':                      { lat: -9.6420, lng: -36.7280 },
    'sao joao':                      { lat: -9.6420, lng: -36.7280 },
    'bom jesus':                     { lat: -9.5800, lng: -36.7150 },
    'santo antônio':                 { lat: -9.6580, lng: -36.7280 },
    'santo antonio':                 { lat: -9.6580, lng: -36.7280 },
    'santa rosa':                    { lat: -9.6280, lng: -36.8000 }
  };

  // Hash determinístico → mesma "posição aleatória" em cada reload
  function strHash(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return h;
  }
  function detRand(seed) {
    const x = Math.sin(seed) * 10000;
    return (x - Math.floor(x)) * 2 - 1; // [-1, 1]
  }

  // Coordenadas EXATAS conhecidas (pesquisadas individualmente no Google Maps).
  // Quando um equipamento tem coord aqui, ele vai PRECISO no mapa, sem jitter.
  // Chave = id do equipamento.
  const EXACT_COORDS = {
    's13': [-9.61868048462909, -36.768965645507905]  // Casa Maternal Frei Damião
  };

  // Pre-computa as chaves de LOCAL_COORDS (fallback) ordenadas pela mais LONGA primeiro.
  const LOCAL_COORDS_KEYS = Object.keys(LOCAL_COORDS).sort((a, b) => b.length - a.length);

  // Resolve coords para cada equipamento.
  // 1) Se tiver coord exata em EXACT_COORDS → usa direto (sem jitter)
  // 2) Se window.CRAIBAS_LOCATIONS está disponível (data/craibas-locations.js) → usa o helper findByAddress
  // 3) Fallback: busca em LOCAL_COORDS local (compatibilidade)
  function resolveCoords(eq) {
    if (EXACT_COORDS[eq.id]) return EXACT_COORDS[eq.id];

    // Tenta usar o módulo central (data/craibas-locations.js) — fonte de verdade do sistema
    if (window.CRAIBAS_LOCATIONS) {
      // Primeiro: equipamento com nome exato no banco central
      if (window.CRAIBAS_LOCATIONS.equipamentos &&
          window.CRAIBAS_LOCATIONS.equipamentos[eq.nome]) {
        const c = window.CRAIBAS_LOCATIONS.equipamentos[eq.nome];
        return [c.lat, c.lng];
      }
      // Depois: matching por endereço
      const found = window.CRAIBAS_LOCATIONS.findByAddress(eq.endereco);
      if (found) {
        // jitter pequeno pra desempilhar marcadores na mesma rua
        const scale = eq.zona === 'Urbana' ? 0.0004 : 0.004;
        return [
          found.lat + detRand(strHash(eq.id)) * scale,
          found.lng + detRand(strHash(eq.id) * 3) * scale
        ];
      }
    }

    // Fallback (caso o módulo central não tenha carregado)
    const addr = eq.endereco.toLowerCase();
    let base = null;
    for (const key of LOCAL_COORDS_KEYS) {
      if (addr.includes(key)) { base = LOCAL_COORDS[key]; break; }
    }
    if (!base) {
      base = eq.zona === 'Urbana'
        ? { lat: CRAIBAS_CENTER[0], lng: CRAIBAS_CENTER[1] }
        : { lat: CRAIBAS_CENTER[0] + detRand(strHash(eq.id) * 7) * 0.06,
            lng: CRAIBAS_CENTER[1] + detRand(strHash(eq.id) * 13) * 0.06 };
    }
    const scale = eq.zona === 'Urbana' ? 0.0004 : 0.004;
    return [
      base.lat + detRand(strHash(eq.id)) * scale,
      base.lng + detRand(strHash(eq.id) * 3) * scale
    ];
  }

  function makeMarkerIcon(eq, isSelected) {
    const cat = CATEGORIES[eq.cat];
    return L.divIcon({
      className: 'leaflet-marker-eq' + (isSelected ? ' selected' : ''),
      html: `<span class="le-pin" style="--c:${cat.color};"></span>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      popupAnchor: [0, -8]
    });
  }

  function makePopupHTML(eq) {
    const cat = CATEGORIES[eq.cat];
    const coords = resolveCoords(eq);

    // Verifica se temos foto cadastrada para esse equipamento
    const fotoSrc = (window.CRAIBAS_LOCATIONS && window.CRAIBAS_LOCATIONS.fotos)
      ? window.CRAIBAS_LOCATIONS.fotos[eq.nome]
      : null;

    // Hero: foto se disponível, senão container vazio (Leaflet aerial map é injetado no popupopen)
    const hero = fotoSrc
      ? `<div class="popup-eq-hero photo">
           <img src="${fotoSrc}" alt="${eq.nome}" loading="lazy"/>
           <span class="popup-eq-photo-tag"><i class="fas fa-camera"></i> Foto real</span>
         </div>`
      : `<div class="popup-eq-hero aerial">
           <div id="aerial-${eq.id}" class="popup-aerial-map"></div>
           <span class="popup-eq-photo-tag"><i class="fas fa-satellite"></i> Vista aérea</span>
         </div>`;

    const directionsURL = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`;

    return `
      <div class="popup-eq">
        ${hero}
        <div class="popup-eq-body">
          <span class="popup-eq-cat" style="background:${cat.color};">
            <i class="fas ${cat.icon}"></i> ${cat.label} · ${eq.tipo}
          </span>
          <h3 class="popup-eq-title">${eq.nome}</h3>
          <div class="popup-eq-rows">
            <div class="popup-eq-row">
              <i class="fas fa-map-marker-alt" style="color:${cat.color};"></i>
              <span>${eq.endereco}</span>
            </div>
            <div class="popup-eq-row">
              <i class="fas fa-location-arrow" style="color:${cat.color};"></i>
              <span>Zona ${eq.zona}</span>
            </div>
          </div>
          <div class="popup-eq-actions">
            <a href="${directionsURL}" target="_blank" rel="noopener noreferrer" class="popup-btn primary">
              <i class="fas fa-directions"></i> Como chegar
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Quando o popup abre e NÃO tem foto, injeta um mini-mapa Leaflet com vista
   * aérea (ESRI World Imagery, gratuito, sem API key) centrado nas coordenadas
   * do equipamento. Cria uma única instância por popup, com cleanup ao fechar.
   */
  function ensureAerialMap(eq) {
    const containerId = 'aerial-' + eq.id;
    const container = document.getElementById(containerId);
    if (!container || container._aerialReady) return;
    container._aerialReady = true;

    const coords = resolveCoords(eq);
    const cat = CATEGORIES[eq.cat];

    // Mapa estático (todos os controles desativados)
    const miniMap = L.map(container, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      touchZoom: false,
      tap: false
    }).setView(coords, 18);

    // Tile satélite ESRI World Imagery (sem API key, gratuito)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri'
    }).addTo(miniMap);

    // Marcador colorido no centro
    L.circleMarker(coords, {
      radius: 9,
      fillColor: cat.color,
      color: 'white',
      weight: 3,
      opacity: 1,
      fillOpacity: 1
    }).addTo(miniMap);

    // Re-render correto após o popup abrir
    setTimeout(() => miniMap.invalidateSize(), 50);
  }

  function initLeafletMap() {
    if (leafletMap) return;
    if (typeof L === 'undefined') {
      console.warn('Leaflet não carregou. Verifique a conexão.');
      return;
    }

    leafletMap = L.map('leaflet-map', {
      center: CRAIBAS_CENTER,
      zoom: 18,                   // zoom 18 = nível de telhados / endereço específico
      minZoom: 10,                // permite afastar até ver o município todo (caso queira)
      maxZoom: 19,                // máximo de aproximação (ainda mais perto se precisar)
      // Scroll-zoom é ativado quando o usuário CLICA no mapa (hover/foco)
      // e desativado ao clicar fora — assim a rolagem da página continua
      // funcionando normalmente quando o usuário só está passando o cursor.
      scrollWheelZoom: false,
      zoomControl: true
    });

    // Habilita scroll-zoom só quando o mapa está "ativo" (após clique do usuário)
    const hint = document.getElementById('map-hint');
    leafletMap.on('focus click', () => {
      leafletMap.scrollWheelZoom.enable();
      if (hint) hint.classList.add('hidden');
    });
    leafletMap.on('blur', () => {
      leafletMap.scrollWheelZoom.disable();
    });
    // Fallback: clicar fora do mapa desativa o scroll-zoom e mostra a dica novamente
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#leaflet-map') && leafletMap.scrollWheelZoom.enabled()) {
        leafletMap.scrollWheelZoom.disable();
        if (hint) hint.classList.remove('hidden');
      }
    });

    // Tiles CartoDB Voyager — visual familiar tipo Google Maps (ruas brancas,
    // quadras claras, vegetação em verde, água em azul). Sem API key.
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(leafletMap);

    // Cria todos os markers uma vez e armazena em markersById
    EQUIPAMENTOS.forEach(eq => {
      const coords = resolveCoords(eq);
      const marker = L.marker(coords, { icon: makeMarkerIcon(eq, false) })
        .bindPopup(makePopupHTML(eq), {
          maxWidth: 340,
          minWidth: 320,
          className: 'leaflet-popup-equip',
          autoPanPadding: [40, 40]
        });

      marker.eqData = eq;
      marker.on('click', () => {
        state.selectedId = eq.id;
        renderMap();
        renderList();
      });
      // Quando o popup abre, injeta o mini-mapa aéreo (se não tiver foto)
      marker.on('popupopen', () => ensureAerialMap(eq));

      markersById[eq.id] = marker;
    });

    // Resize fix — recalcula tamanho e mantém o centro fixo definido em CRAIBAS_CENTER
    setTimeout(() => {
      leafletMap.invalidateSize();
      leafletMap.setView(CRAIBAS_CENTER, 18, { animate: false });
    }, 100);
    window.addEventListener('resize', () => {
      leafletMap.invalidateSize();
      leafletMap.setView(CRAIBAS_CENTER, 18, { animate: false });
    });
  }

  // ----- Mapa render: mostra/esconde markers conforme filtros -----
  function renderMap() {
    if (!leafletMap) return;
    const filtered = getFiltered();
    const visibleIds = new Set(filtered.map(e => e.id));

    EQUIPAMENTOS.forEach(eq => {
      const m = markersById[eq.id];
      if (!m) return;

      const isVisible = visibleIds.has(eq.id);
      const isSelected = state.selectedId === eq.id;

      // Atualiza ícone se selection mudou
      m.setIcon(makeMarkerIcon(eq, isSelected));

      if (isVisible) {
        if (!leafletMap.hasLayer(m)) m.addTo(leafletMap);
      } else {
        if (leafletMap.hasLayer(m)) leafletMap.removeLayer(m);
      }
    });

    // Se há um selecionado e está visível, abrir popup
    if (state.selectedId && visibleIds.has(state.selectedId)) {
      const m = markersById[state.selectedId];
      if (m && !m.isPopupOpen()) m.openPopup();
    }
  }

  // ----- Equip list -----
  function renderList() {
    let filtered = getFiltered();

    // sort
    const sortKey = state.sort;
    filtered.sort((a, b) => {
      if (sortKey === 'nome') return a.nome.localeCompare(b.nome);
      if (sortKey === 'categoria') return CATEGORIES[a.cat].label.localeCompare(CATEGORIES[b.cat].label) || a.nome.localeCompare(b.nome);
      if (sortKey === 'zona') return a.zona.localeCompare(b.zona) || a.nome.localeCompare(b.nome);
      return 0;
    });

    const container = document.getElementById('equip-list');
    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <p>Nenhum equipamento encontrado para os filtros aplicados.</p>
        </div>
      `;
    } else {
      container.innerHTML = filtered.map(eq => {
        const cat = CATEGORIES[eq.cat];
        return `
          <div class="equip-item ${cat.class} ${state.selectedId === eq.id ? 'selected' : ''}"
               data-id="${eq.id}">
            <div class="equip-item-head">
              <div class="equip-item-name">${eq.nome}</div>
              <span class="equip-cat-pill" style="background:${cat.color};">${cat.label}</span>
            </div>
            <div class="equip-item-addr"><i class="fas fa-map-marker-alt" style="color:${cat.color};margin-right:6px;"></i>${eq.endereco}</div>
            <div class="equip-item-meta">
              <span class="equip-zona-tag ${eq.zona === 'Urbana' ? 'urbana' : 'rural'}">${eq.zona}</span>
              <span><i class="fas fa-tag"></i> ${eq.tipo}</span>
            </div>
          </div>
        `;
      }).join('');

      container.querySelectorAll('.equip-item').forEach(item => {
        item.addEventListener('click', () => {
          const eq = EQUIPAMENTOS.find(e => e.id === item.dataset.id);
          if (eq) {
            state.selectedId = eq.id;
            openModal(eq);
            // Aproxima o mapa do marker selecionado
            if (leafletMap && markersById[eq.id]) {
              const m = markersById[eq.id];
              leafletMap.flyTo(m.getLatLng(), 15, { duration: 0.7 });
            }
            renderMap();
            renderList();
          }
        });
      });
    }

    // Update count
    const countEl = document.getElementById('result-count');
    if (countEl) countEl.textContent = filtered.length;
  }

  // ----- Active filter chips -----
  function renderActiveFilters() {
    const chipsContainer = document.getElementById('active-filters-chips');
    if (!chipsContainer) return;

    const chips = [];
    if (state.filters.categoria !== 'todas') {
      chips.push({ key: 'categoria', label: CATEGORIES[state.filters.categoria].label });
    }
    if (state.filters.tipo !== 'todos') {
      chips.push({ key: 'tipo', label: state.filters.tipo });
    }
    if (state.filters.zona !== 'todas') {
      chips.push({ key: 'zona', label: 'Zona ' + state.filters.zona });
    }
    if (state.filters.busca) {
      chips.push({ key: 'busca', label: '"' + state.filters.busca + '"' });
    }

    chipsContainer.innerHTML = chips.length === 0
      ? '<span style="color:var(--text-light); font-style:italic; font-size:12px;">Nenhum filtro ativo</span>'
      : chips.map(c => `
          <span class="active-filter-chip" data-clear-key="${c.key}">
            ${c.label} <i class="fas fa-times"></i>
          </span>
        `).join('');

    chipsContainer.querySelectorAll('.active-filter-chip').forEach(chip => {
      chip.querySelector('i').addEventListener('click', e => {
        e.stopPropagation();
        const key = chip.dataset.clearKey;
        if (key === 'categoria') state.filters.categoria = 'todas';
        if (key === 'tipo') state.filters.tipo = 'todos';
        if (key === 'zona') state.filters.zona = 'todas';
        if (key === 'busca') {
          state.filters.busca = '';
          document.getElementById('list-search').value = '';
        }
        ['filter-categoria','filter-tipo','filter-zona'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.value = state.filters[id.replace('filter-', '')] || (id === 'filter-tipo' ? 'todos' : 'todas');
        });
        populateFilters();
        renderAll();
      });
    });
  }

  // ----- Modal (mesma estrutura visual do popup, em tamanho maior) -----
  let modalAerialMap = null;

  function openModal(eq) {
    const overlay = document.getElementById('modal-overlay-equip');
    const container = document.getElementById('modal-equip-content');
    const cat = CATEGORIES[eq.cat];
    const coords = resolveCoords(eq);

    // Foto cadastrada?
    const fotoSrc = (window.CRAIBAS_LOCATIONS && window.CRAIBAS_LOCATIONS.fotos)
      ? window.CRAIBAS_LOCATIONS.fotos[eq.nome]
      : null;

    const hero = fotoSrc
      ? `<div class="modal-eq-hero photo">
           <img src="${fotoSrc}" alt="${eq.nome}" loading="lazy"/>
           <span class="modal-eq-hero-tag"><i class="fas fa-camera"></i> Foto real</span>
         </div>`
      : `<div class="modal-eq-hero aerial">
           <div id="modal-aerial-map" class="modal-aerial-canvas"></div>
           <span class="modal-eq-hero-tag"><i class="fas fa-satellite"></i> Vista aérea</span>
         </div>`;

    const directionsURL = `https://www.google.com/maps/dir/?api=1&destination=${coords[0]},${coords[1]}`;
    const gmapsURL      = `https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}`;

    container.style.borderTopColor = cat.color;
    container.style.setProperty('--cat-color', cat.color);
    container.innerHTML = `
      <button class="modal-equip-close" aria-label="Fechar"><i class="fas fa-times"></i></button>
      ${hero}
      <div class="modal-eq-body">
        <span class="modal-eq-cat" style="background:${cat.color};">
          <i class="fas ${cat.icon}"></i> ${cat.label} · ${eq.tipo}
        </span>
        <h2 class="modal-eq-title">${eq.nome}</h2>
        <div class="modal-eq-rows">
          <div class="modal-eq-row">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <strong>Endereço</strong>
              <span>${eq.endereco}</span>
            </div>
          </div>
          <div class="modal-eq-row">
            <i class="fas fa-tag"></i>
            <div>
              <strong>Tipo</strong>
              <span>${eq.tipo}</span>
            </div>
          </div>
          <div class="modal-eq-row">
            <i class="fas fa-location-arrow"></i>
            <div>
              <strong>Zona</strong>
              <span>Zona ${eq.zona}</span>
            </div>
          </div>
        </div>
        <div class="modal-eq-actions">
          <a href="${directionsURL}" target="_blank" rel="noopener noreferrer" class="modal-btn primary">
            <i class="fas fa-directions"></i> Como chegar
          </a>
          <a href="${gmapsURL}" target="_blank" rel="noopener noreferrer" class="modal-btn ghost">
            <i class="fas fa-up-right-from-square"></i> Abrir no Google Maps
          </a>
        </div>
      </div>
    `;

    overlay.classList.add('open');

    // Re-attach close button listener (HTML foi reescrito)
    container.querySelector('.modal-equip-close').addEventListener('click', closeModal);

    // Se for aérea, injeta mini-mapa Leaflet com tile satélite ESRI
    if (!fotoSrc) {
      // Cleanup do mapa anterior se existir
      if (modalAerialMap) {
        modalAerialMap.remove();
        modalAerialMap = null;
      }
      const aerialEl = document.getElementById('modal-aerial-map');
      if (aerialEl && typeof L !== 'undefined') {
        modalAerialMap = L.map(aerialEl, {
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
          scrollWheelZoom: false,
          touchZoom: false,
          tap: false
        }).setView(coords, 18);

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19,
          attribution: 'Tiles &copy; Esri'
        }).addTo(modalAerialMap);

        L.circleMarker(coords, {
          radius: 11,
          fillColor: cat.color,
          color: 'white',
          weight: 3,
          opacity: 1,
          fillOpacity: 1
        }).addTo(modalAerialMap);

        setTimeout(() => modalAerialMap && modalAerialMap.invalidateSize(), 80);
      }
    }
  }

  function closeModal() {
    document.getElementById('modal-overlay-equip').classList.remove('open');
    if (modalAerialMap) {
      modalAerialMap.remove();
      modalAerialMap = null;
    }
    state.selectedId = null;
    renderMap();
    renderList();
  }

  // ----- Master render -----
  function renderAll() {
    renderSummaryStats();
    renderKpis();
    renderCharts();
    renderMap();
    renderList();
    renderActiveFilters();
  }

  /* ============================================
     4. EVENTS
     ============================================ */
  function init() {
    // Header / nav comum
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMain = document.getElementById('nav-main');
    if (navToggle && navMain) {
      navToggle.addEventListener('click', () => navMain.classList.toggle('open'));
    }
    window.addEventListener('scroll', () => {
      if (header) {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      }
      const btt = document.getElementById('back-to-top');
      if (btt) {
        if (window.scrollY > 400) btt.classList.add('visible');
        else btt.classList.remove('visible');
      }
    }, { passive: true });

    // Chart.js defaults
    if (typeof Chart !== 'undefined') {
      Chart.defaults.font.family = "'Inter', sans-serif";
      Chart.defaults.color = '#5a6b78';
      Chart.defaults.plugins.tooltip.backgroundColor = '#0d3a17';
      Chart.defaults.plugins.tooltip.padding = 10;
      Chart.defaults.plugins.tooltip.cornerRadius = 8;
    }

    // Populate filter dropdowns
    const catSelect = document.getElementById('filter-categoria');
    catSelect.innerHTML = '<option value="todas">Todas as categorias</option>' +
      Object.entries(CATEGORIES).map(([k,c]) => `<option value="${k}">${c.label}</option>`).join('');

    populateFilters();

    // Filter listeners
    catSelect.addEventListener('change', e => {
      state.filters.categoria = e.target.value;
      populateFilters();
      renderAll();
    });
    document.getElementById('filter-tipo').addEventListener('change', e => {
      state.filters.tipo = e.target.value;
      renderAll();
    });
    document.getElementById('filter-zona').addEventListener('change', e => {
      state.filters.zona = e.target.value;
      renderAll();
    });
    document.getElementById('list-search').addEventListener('input', e => {
      state.filters.busca = e.target.value.trim();
      renderAll();
    });
    document.getElementById('list-sort').addEventListener('change', e => {
      state.sort = e.target.value;
      renderList();
    });
    document.getElementById('filter-clear').addEventListener('click', () => {
      state.filters = { categoria:'todas', tipo:'todos', zona:'todas', busca:'' };
      state.selectedId = null;
      document.getElementById('filter-categoria').value = 'todas';
      document.getElementById('filter-tipo').value = 'todos';
      document.getElementById('filter-zona').value = 'todas';
      document.getElementById('list-search').value = '';
      populateFilters();
      renderAll();
    });

    // Modal close
    const overlay = document.getElementById('modal-overlay-equip');
    overlay.addEventListener('click', e => {
      if (e.target === overlay || e.target.closest('.modal-equip-close')) closeModal();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });

    // Map legend (toggle category visibility)
    document.querySelectorAll('.map-legend-item').forEach(item => {
      item.addEventListener('click', () => {
        const cat = item.dataset.cat;
        state.filters.categoria = state.filters.categoria === cat ? 'todas' : cat;
        document.getElementById('filter-categoria').value = state.filters.categoria;
        populateFilters();
        renderAll();
      });
    });

    // Inicializa o Leaflet map antes do primeiro render
    initLeafletMap();

    // Initial render
    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
