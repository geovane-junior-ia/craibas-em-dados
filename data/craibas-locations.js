/* ============================================================
   CRAÍBAS — BANCO DE COORDENADAS GEOGRÁFICAS
   Fonte central de coordenadas para todas as páginas do site.

   Como usar em qualquer HTML:
     <script src="../data/craibas-locations.js"></script>
     <script>
       const center = window.CRAIBAS_LOCATIONS.centroMunicipal;
       const ubsCoord = window.CRAIBAS_LOCATIONS.findByAddress('Rua São Pedro, 49, Centro');
     </script>

   Última atualização: 09/05/2026
   Fontes:
     - OpenStreetMap (via Nominatim API) — coords verificadas (verified: true)
     - Cliente (Casa Maternal Frei Damião)
     - Aproximação por quadrante (povoados sem GPS público)
     - IBGE (centroides dos municípios vizinhos)
   ============================================================ */

(function () {
  'use strict';

  const CRAIBAS_LOCATIONS = {
    /* === METADADOS === */
    metadata: {
      municipio: 'Craíbas',
      uf: 'AL',
      pais: 'Brasil',
      ibgeCode: '2702306',
      mesorregiao: 'Agreste Alagoano',
      microrregiao: 'Arapiraca',
      bioma: 'Caatinga',
      altitude: 281,
      area_km2: 275,
      atualizado: '2026-05-09'
    },

    /* === CENTRO DO MUNICÍPIO (sede urbana) === */
    centroMunicipal: {
      lat: -9.6168,
      lng: -36.7685,
      source: 'OSM',
      verified: true
    },

    /* === RUAS URBANAS (logradouros geocodificados) === */
    ruas: {
      'Rua Pedro Gama':              { lat: -9.6184, lng: -36.7678, source: 'OSM',          verified: true,  ref: 'Prefeitura Municipal' },
      'Rua São Pedro':               { lat: -9.6192, lng: -36.7691, source: 'OSM',          verified: true,  ref: 'CMEI Arlene Simplício' },
      'Rua Sete de Setembro':        { lat: -9.6159, lng: -36.7649, source: 'OSM',          verified: true,  ref: 'Esc. Alegria do Saber' },
      'Rua Francisco Gama':          { lat: -9.6199, lng: -36.7709, source: 'OSM',          verified: true,  ref: 'Esc. Ten. Cel. José Barros Paes' },
      'Rua Santo Antônio':           { lat: -9.6160, lng: -36.7626, source: 'OSM',          verified: true,  ref: 'UBS Edvaldo Correia (COHAB)' },
      'Rua Manoel Antônio de Jesus': { lat: -9.6165, lng: -36.7645, source: 'OSM',          verified: true,  ref: 'Esc. 21 de Abril' },
      'Rua do Matadouro':            { lat: -9.6229, lng: -36.7739, source: 'OSM',          verified: true,  ref: 'CISP — Centro Integrado de Segurança Pública' },
      'Rua Pau Ferro':               { lat: -9.6235, lng: -36.7713, source: 'OSM',          verified: true },
      'Rua 15 de Novembro':          { lat: -9.6125, lng: -36.7698, source: 'OSM',          verified: true },
      'Rua 23 de Abril':             { lat: -9.6176, lng: -36.7735, source: 'OSM',          verified: true },
      'Rua Santa Rosa':              { lat: -9.6249, lng: -36.7602, source: 'OSM',          verified: true },
      // Ruas não indexadas no OSM — aproximação no Centro
      'Rua Nossa Senhora da Salete':    { lat: -9.6175, lng: -36.7682, source: 'Aproximação', verified: false, ref: 'Maioria das UBS' },
      'Rua Nossa Senhora da Conceição': { lat: -9.6172, lng: -36.7680, source: 'Aproximação', verified: false, ref: 'CREAS' },
      'Rua Pedro Ramos':                { lat: -9.6180, lng: -36.7672, source: 'Aproximação', verified: false, ref: 'CRAS' },
      'Rua Ulisses Paulino':            { lat: -9.6190, lng: -36.7700, source: 'Aproximação', verified: false }
    },

    /* === PRAÇAS E ESPAÇOS PÚBLICOS === */
    pracas: {
      'Praça Manoel Nunes':              { lat: -9.6169, lng: -36.7685, source: 'OSM',          verified: true },
      'Praça Domingos Antônio Teixeira': { lat: -9.6172, lng: -36.7689, source: 'Aproximação', verified: false },
      'Praça da Bíblia':                 { lat: -9.6166, lng: -36.7679, source: 'Aproximação', verified: false },
      'Praça Manoel Ferreira Santos':    { lat: -9.6178, lng: -36.7692, source: 'Aproximação', verified: false },
      'Praça de Alimentação':            { lat: -9.6171, lng: -36.7681, source: 'Aproximação', verified: false }
    },

    /* === ZONAS / ÁREAS GENÉRICAS === */
    zonas: {
      'Centro':                  { lat: -9.6168, lng: -36.7685, source: 'OSM',          verified: true },
      'COHAB':                   { lat: -9.6155, lng: -36.7660, source: 'Aproximação', verified: false },
      'Conjunto Habitacional':   { lat: -9.6178, lng: -36.7680, source: 'Aproximação', verified: false }
    },

    /* === POVOADOS / SÍTIOS RURAIS === */
    povoados: {
      'Folha Miúda':              { lat: -9.7033, lng: -36.7952, source: 'OSM',          verified: true,  quadrante: 'S' },
      'Sítio Ipojuco':            { lat: -9.5870, lng: -36.7940, source: 'Aproximação', verified: false, quadrante: 'NW' },
      'Sítio Serrote':            { lat: -9.5990, lng: -36.7460, source: 'Aproximação', verified: false, quadrante: 'NE' },
      'Sítio Serrote Grande':     { lat: -9.6020, lng: -36.7510, source: 'Aproximação', verified: false, quadrante: 'NE' },
      'Sítio Lagoa Nova':         { lat: -9.6080, lng: -36.7900, source: 'Aproximação', verified: false, quadrante: 'NW' },
      'Sítio Lagoa do Mel':       { lat: -9.6280, lng: -36.7960, source: 'Aproximação', verified: false, quadrante: 'W'  },
      'Sítio Lagoa da Cruz':      { lat: -9.6520, lng: -36.7350, source: 'Aproximação', verified: false, quadrante: 'SE' },
      'Sítio Alto Grande':        { lat: -9.5980, lng: -36.7570, source: 'Aproximação', verified: false, quadrante: 'N'  },
      'Sítio Esporão':            { lat: -9.6080, lng: -36.8100, source: 'Aproximação', verified: false, quadrante: 'W'  },
      'Sítio Areia Branca':       { lat: -9.5980, lng: -36.7300, source: 'Aproximação', verified: false, quadrante: 'NE' },
      'Sítio Pau Ferro':          { lat: -9.6450, lng: -36.7950, source: 'Aproximação', verified: false, quadrante: 'SW' },
      'Sítio Bonito':             { lat: -9.6650, lng: -36.7780, source: 'Aproximação', verified: false, quadrante: 'S'  },
      'Povoado Lagoa da Angélica':{ lat: -9.6500, lng: -36.7950, source: 'Aproximação', verified: false, quadrante: 'S'  },
      'Povoado Lagoa do Algodão': { lat: -9.6500, lng: -36.7400, source: 'Aproximação', verified: false, quadrante: 'SE' },
      'Povoado Santo Antônio':    { lat: -9.6580, lng: -36.7280, source: 'Aproximação', verified: false, quadrante: 'SE' },
      'Povoado Santa Rosa':       { lat: -9.6280, lng: -36.8000, source: 'Aproximação', verified: false, quadrante: 'SW' },
      'Povoado Bom Jesus':        { lat: -9.5800, lng: -36.7150, source: 'Aproximação', verified: false, quadrante: 'NE' },
      'Povoado São João':         { lat: -9.6420, lng: -36.7280, source: 'Aproximação', verified: false, quadrante: 'SE' }
    },

    /* === EQUIPAMENTOS PÚBLICOS COM GPS ESPECÍFICO ===
       Sobrescreve o matching por endereço quando temos coordenada exata.
       Campo `foto` = caminho relativo da foto (a partir de paginas/equipamentos-publicos.html). */
    equipamentos: {
      'Prefeitura Municipal de Craíbas': {
        lat: -9.61819076963784,
        lng: -36.76786567143879,
        source: 'Cliente',
        verified: true,
        categoria: 'governo',
        tipo: 'Prefeitura',
        endereco: 'Rua Pedro Gama, 122, Centro'
      },
      'Casa Maternal Frei Damião': {
        lat: -9.61868048462909,
        lng: -36.768965645507905,
        source: 'Cliente',
        verified: true,
        categoria: 'saude',
        tipo: 'Maternidade 24h'
      }
    },

    /* === FOTOS DOS EQUIPAMENTOS (caminhos relativos) ===
       Mapeia nome do equipamento → arquivo de foto. */
    fotos: {
      'Praça Manoel Nunes':                                    'images/equipamentos/praca-manoel-nunes.jpg',
      'CISP — Centro Integrado de Segurança Pública':          'images/equipamentos/cisp.jpeg'
    },

    /* === MUNICÍPIOS VIZINHOS (centroides oficiais) === */
    vizinhos: {
      'Maj. Isidoro':    { lat: -9.5267, lng: -36.9886, source: 'IBGE', verified: true, distancia_km: 23, direcao: 'O'  },
      'Igaci':           { lat: -9.5358, lng: -36.6386, source: 'IBGE', verified: true, distancia_km: 18, direcao: 'L'  },
      'Arapiraca':       { lat: -9.7522, lng: -36.6614, source: 'IBGE', verified: true, distancia_km: 21, direcao: 'SE' },
      'Lagoa da Canoa':  { lat: -9.8367, lng: -36.7350, source: 'IBGE', verified: true, distancia_km: 25, direcao: 'S'  }
    }
  };

  /* ============================================================
     HELPERS — funções utilitárias para outras páginas
     ============================================================ */

  /**
   * Acha uma coordenada por nome exato em qualquer categoria.
   * @param {string} name — Ex: "Praça Manoel Nunes" ou "Folha Miúda"
   * @returns {{lat,lng,source,verified}|null}
   */
  CRAIBAS_LOCATIONS.find = function (name) {
    const cats = ['equipamentos', 'pracas', 'ruas', 'povoados', 'zonas', 'vizinhos'];
    for (const cat of cats) {
      if (CRAIBAS_LOCATIONS[cat] && CRAIBAS_LOCATIONS[cat][name]) {
        return CRAIBAS_LOCATIONS[cat][name];
      }
    }
    return null;
  };

  /**
   * Acha a melhor coordenada a partir de uma string de endereço livre.
   * Estratégia: procura a chave mais LONGA (mais específica) que aparece no endereço.
   * @param {string} address — Endereço completo, ex: "Rua São Pedro, 49, Centro, Craíbas-AL"
   * @returns {{lat,lng,source,verified,matchedKey}|null}
   */
  CRAIBAS_LOCATIONS.findByAddress = function (address) {
    if (!address) return null;
    const addrLower = address.toLowerCase();

    // Coleta todas chaves de ruas/praças/povoados/zonas com seus tamanhos
    const candidates = [];
    ['ruas', 'pracas', 'povoados', 'zonas'].forEach(cat => {
      const obj = CRAIBAS_LOCATIONS[cat];
      if (obj) Object.keys(obj).forEach(key => candidates.push({ cat, key, length: key.length }));
    });

    // Ordena por tamanho descendente (mais específica primeiro)
    candidates.sort((a, b) => b.length - a.length);

    // Retorna a primeira que aparece no endereço
    for (const c of candidates) {
      if (addrLower.includes(c.key.toLowerCase())) {
        return Object.assign({ matchedKey: c.key }, CRAIBAS_LOCATIONS[c.cat][c.key]);
      }
    }
    return null;
  };

  /**
   * Retorna todas coordenadas verificadas (source = OSM ou Cliente).
   * Útil para listas de "GPS confirmado" no sistema.
   */
  CRAIBAS_LOCATIONS.allVerified = function () {
    const list = [];
    ['ruas', 'pracas', 'povoados', 'zonas', 'equipamentos', 'vizinhos'].forEach(cat => {
      const obj = CRAIBAS_LOCATIONS[cat];
      if (!obj) return;
      Object.keys(obj).forEach(key => {
        if (obj[key].verified) {
          list.push(Object.assign({ name: key, category: cat }, obj[key]));
        }
      });
    });
    return list;
  };

  /**
   * Calcula distância em km entre duas coords (fórmula de Haversine).
   */
  CRAIBAS_LOCATIONS.distance = function (a, b) {
    const R = 6371; // raio da Terra em km
    const toRad = d => d * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(h));
  };

  // Expõe globalmente
  if (typeof window !== 'undefined') {
    window.CRAIBAS_LOCATIONS = CRAIBAS_LOCATIONS;
  }
  // Também exporta para Node/CommonJS (caso seja usado em build tools)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = CRAIBAS_LOCATIONS;
  }
})();
