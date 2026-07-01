# Banco Central de Dados — Craíbas

Pasta com **fonte única de verdade** para dados estruturados do site (coordenadas, indicadores, listas oficiais). Qualquer página nova do site deve consumir desta pasta em vez de hard-codar dados.

## Arquivos

| Arquivo | Formato | Uso |
|---|---|---|
| `craibas-locations.js` | JS module (browser) | Páginas HTML — expõe `window.CRAIBAS_LOCATIONS` |
| `craibas-locations.json` | JSON puro | Ferramentas externas, builds Python, GIS, Excel/Power BI |

## Como usar em uma nova página HTML

```html
<!DOCTYPE html>
<html>
<head>
  <!-- ... seu head normal ... -->
</head>
<body>

  <!-- Seu conteúdo aqui -->

  <!-- IMPORTANTE: incluir o banco ANTES do seu script -->
  <script src="../data/craibas-locations.js"></script>
  <script src="../seu-script-da-pagina.js"></script>
</body>
</html>
```

Depois de incluir, o objeto `window.CRAIBAS_LOCATIONS` fica disponível globalmente.

## Estrutura de dados

```js
window.CRAIBAS_LOCATIONS = {
  metadata: { municipio, uf, ibgeCode, mesorregiao, microrregiao, bioma, area_km2, ... },
  centroMunicipal: { lat, lng, source, verified },

  ruas:        { 'Rua Pedro Gama': { lat, lng, source, verified, ref }, ... },
  pracas:      { 'Praça Manoel Nunes': { lat, lng, source, verified }, ... },
  zonas:       { 'Centro': {...}, 'COHAB': {...}, 'Conjunto Habitacional': {...} },
  povoados:    { 'Folha Miúda': { lat, lng, source, verified, quadrante }, ... },
  equipamentos:{ 'Casa Maternal Frei Damião': { lat, lng, source, verified, categoria, tipo } },
  vizinhos:    { 'Maj. Isidoro': { lat, lng, distancia_km, direcao }, ... }
};
```

### Campos das coordenadas

| Campo | Descrição |
|---|---|
| `lat`, `lng` | Coordenadas decimais (graus) |
| `source` | `'OSM'` (verificado OpenStreetMap), `'IBGE'`, `'Cliente'` ou `'Aproximação'` |
| `verified` | `true` se a coordenada é precisa, `false` se aproximada |
| `ref` | Referência associada (ex: "Prefeitura Municipal" para Rua Pedro Gama) |
| `quadrante` | Direção em relação ao centro: `'N'`, `'S'`, `'L'`, `'O'`, `'NE'`, `'NW'`, `'SE'`, `'SW'` |
| `categoria` / `tipo` | Para equipamentos, classificação |

## API (helpers do módulo JS)

### `find(name)`
Busca por nome exato em qualquer categoria.
```js
const p = window.CRAIBAS_LOCATIONS.find('Praça Manoel Nunes');
// → { lat: -9.6169, lng: -36.7685, source: 'OSM', verified: true }
```

### `findByAddress(address)`
Busca a coord mais específica que casa com um endereço livre. Faz matching pela chave **mais longa** (mais específica) primeiro.
```js
const c = window.CRAIBAS_LOCATIONS.findByAddress('Rua São Pedro, 49, Centro, Craíbas-AL');
// → { lat: -9.6192, lng: -36.7691, source: 'OSM', verified: true, matchedKey: 'Rua São Pedro' }

const c2 = window.CRAIBAS_LOCATIONS.findByAddress('Sítio Lagoa do Mel, Craíbas-AL');
// Bate em 'Sítio Lagoa do Mel' (mais específico) e não em 'Lagoa do Mel'
```

### `allVerified()`
Lista todas as coords cujo `verified === true`. Útil pra debugging ou para listas de "GPS confirmado".
```js
const verified = window.CRAIBAS_LOCATIONS.allVerified();
// → [ { name: 'Rua Pedro Gama', category: 'ruas', lat, lng, ... }, ... ]
```

### `distance(a, b)`
Distância em km entre duas coords (fórmula de Haversine).
```js
const d = window.CRAIBAS_LOCATIONS.distance(
  window.CRAIBAS_LOCATIONS.find('Centro'),
  window.CRAIBAS_LOCATIONS.find('Folha Miúda')
);
// → ~9.7 km
```

## Como ATUALIZAR uma coordenada

### Para mudar uma coord existente
1. Edite `craibas-locations.js` (alterar lat/lng do objeto)
2. **Replique a alteração no `craibas-locations.json`** para manter os dois sincronizados
3. Marque `verified: true` se você obteve do Google Maps/OSM/cliente
4. Marque a `source: 'Cliente'` ou `'Google Maps'` conforme apropriado

### Para adicionar uma coord nova (ex: novo equipamento)
1. Decida a categoria certa: `ruas`, `pracas`, `povoados`, `equipamentos`, etc.
2. Adicione a entrada em **AMBOS** arquivos (`.js` e `.json`)
3. Atualize a data em `metadata.atualizado`

## Geocodificação automática (workflow para adicionar muitas coords)

Para geocodificar lotes de endereços, use a [API Nominatim do OpenStreetMap](https://nominatim.openstreetmap.org/) (gratuita, sem API key):

```bash
# Exemplo: geocodificar uma rua
curl "https://nominatim.openstreetmap.org/search?q=Rua+Pedro+Gama+Craibas+Alagoas&format=json&limit=1"
```

A resposta JSON traz `lat` e `lon`. Se a rua não estiver indexada (povoados rurais pequenos não estão), use o Google Maps manualmente:
1. Abra o local no Google Maps
2. Clique direito → primeira opção é a coord — copia
3. Cola aqui no banco

## Fontes e atualização

- **OpenStreetMap (OSM)** via Nominatim — geocodificação automática de ruas/cidades
- **IBGE** — centroides oficiais de municípios
- **Cliente / Equipe** — coords levantadas manualmente para equipamentos específicos
- **Aproximação** — quadrante geográfico estimado quando não há dado público (povoados pequenos)

Sempre que possível, prefira `verified: true`. Coordenadas com `verified: false` são candidatas a serem aprimoradas conforme novos dados ficam disponíveis.
