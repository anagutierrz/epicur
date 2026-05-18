/* ════════════════════════════════════════════════════════
   EPICUR CONCEPT — Google Sheets CMS Connector
   sheets.js  ·  v2.0

   CÓMO CONFIGURAR:
   1. Abre tu Google Sheet
   2. Archivo → Compartir → Publicar en la web
      · Selecciona: "Todo el documento" · Formato: "Valores separados por comas (.csv)"
      · Haz clic en "Publicar"
   3. Copia la URL base (termina en /pub?output=csv)
   4. Pega el SPREADSHEET_ID abajo (el ID largo entre /d/ y /edit)

   ESTRUCTURA DE HOJAS REQUERIDA (pestañas del Sheet):
   ┌─────────────┬──────────────────────────────────────────────┐
   │ Pestaña     │ Columnas                                     │
   ├─────────────┼──────────────────────────────────────────────┤
   │ Config      │ clave | valor                                │
   │ Catalogo    │ id|nombre|categoria|origen|descripcion|      │
   │             │ descripcion_larga|notas|maridaje|imagen|     │
   │             │ precio|disponible|destacado                  │
   │ Blog        │ id|titulo|categoria|extracto|contenido|      │
   │             │ imagen|fecha|lectura_min|activo              │
   │ Frases      │ id|texto|autor|activo                       │
   │ Hero        │ clave | valor                                │
   │ Contacto    │ clave | valor                                │
   └─────────────┴──────────────────────────────────────────────┘
   ════════════════════════════════════════════════════════ */

const SHEETS_CONFIG = {
  // ↓↓ PEGA AQUÍ EL ID DE TU GOOGLE SHEET ↓↓
  SPREADSHEET_ID: 'TU_SPREADSHEET_ID_AQUI',

  // Nombres exactos de cada pestaña en el Sheet
  SHEETS: {
    config:   'Config',
    catalogo: 'Catalogo',
    blog:     'Blog',
    frases:   'Frases',
    hero:     'Hero',
    contacto: 'Contacto'
  },

  // Caché en memoria para no re-fetchar en la misma sesión
  CACHE_MS: 5 * 60 * 1000  // 5 minutos
};

// ── Cache store ──────────────────────────────────────────
const _cache = {};

// ── Core fetch: CSV → array de objetos ──────────────────
async function fetchSheet(sheetName) {
  const cacheKey = sheetName;
  const now = Date.now();

  if (_cache[cacheKey] && (now - _cache[cacheKey].ts) < SHEETS_CONFIG.CACHE_MS) {
    return _cache[cacheKey].data;
  }

  const url = `https://docs.google.com/spreadsheets/d/${SHEETS_CONFIG.SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const parsed = csvToObjects(text);
    _cache[cacheKey] = { data: parsed, ts: now };
    return parsed;
  } catch (err) {
    console.warn(`[Epicur CMS] Error cargando hoja "${sheetName}":`, err.message);
    return [];
  }
}

// ── CSV parser robusto (maneja comas dentro de comillas) ─
function csvToObjects(csv) {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]).map(h =>
    h.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')
  );

  return lines.slice(1)
    .map(line => {
      const vals = parseCSVLine(line);
      const obj = {};
      headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
      return obj;
    })
    .filter(row => Object.values(row).some(v => v !== ''));
}

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i+1] === '"') { cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(cur); cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

// ── Helper: key-value sheet → plain object ───────────────
function kvToObject(rows) {
  const obj = {};
  rows.forEach(r => {
    const key = (r.clave || r.key || '').trim();
    const val = (r.valor || r.value || '').trim();
    if (key) obj[key] = val;
  });
  return obj;
}

// ── Helper: boolean normalization ───────────────────────
function toBool(v) {
  return String(v).trim().toLowerCase() === 'true' || v === '1' || v === 'si' || v === 'sí' || v === 'yes';
}

/* ════════════════════════════════════════════════════════
   API PÚBLICA — métodos que usan las páginas
   ════════════════════════════════════════════════════════ */

const EpicurCMS = {

  // CONFIG GENERAL ────────────────────────────────────────
  async getConfig() {
    const rows = await fetchSheet(SHEETS_CONFIG.SHEETS.config);
    const cfg  = kvToObject(rows);
    return {
      nombre:    cfg.nombre    || 'EPICUR CONCEPT',
      ciudad:    cfg.ciudad    || 'Santo Domingo, República Dominicana',
      whatsapp:  cfg.whatsapp  || '18091234567',
      instagram: cfg.instagram || '@epicurconcept',
      facebook:  cfg.facebook  || '',
      horario:   cfg.horario   || 'Lun–Sáb: 10:00am – 8:00pm',
      anio:      cfg.anio      || new Date().getFullYear().toString()
    };
  },

  // HERO / TEXTOS PRINCIPALES ─────────────────────────────
  async getHero() {
    const rows = await fetchSheet(SHEETS_CONFIG.SHEETS.hero);
    const h    = kvToObject(rows);
    return {
      eyebrow:  h.eyebrow  || 'Santo Domingo · República Dominicana',
      titulo:   h.titulo   || 'Un rincón para los sentidos',
      subtitulo:h.subtitulo|| 'Cigarros, rones, café y más, reunidos en una experiencia pensada para disfrutar con calma.',
      btn_principal: h.btn_principal || 'Explorar catálogo',
      btn_secundario: h.btn_secundario || 'Conocer la historia',
      concepto_titulo: h.concepto_titulo || 'Cada producto tiene una historia',
      concepto_texto1: h.concepto_texto1 || '',
      concepto_texto2: h.concepto_texto2 || '',
      stat1_num:  h.stat1_num   || '8+',
      stat1_lbl:  h.stat1_lbl  || 'Marcas curadas',
      stat2_num:  h.stat2_num  || '5',
      stat2_lbl:  h.stat2_lbl  || 'Categorías',
      stat3_num:  h.stat3_num  || 'RD',
      stat3_lbl:  h.stat3_lbl  || 'Santo Domingo'
    };
  },

  // CATÁLOGO ───────────────────────────────────────────────
  async getCatalogo({ soloDisponibles = true, categoria = null } = {}) {
    const rows = await fetchSheet(SHEETS_CONFIG.SHEETS.catalogo);
    let productos = rows.map(r => ({
      id:                parseInt(r.id) || 0,
      nombre:            r.nombre            || '',
      categoria:         r.categoria         || '',
      origen:            r.origen            || '',
      descripcion:       r.descripcion       || '',
      descripcion_larga: r.descripcion_larga || r.descripcion || '',
      notas:             r.notas             || '',
      maridaje:          r.maridaje          || '',
      imagen:            r.imagen            || '',
      precio:            r.precio            || null,
      disponible:        toBool(r.disponible !== undefined ? r.disponible : 'true'),
      destacado:         toBool(r.destacado)
    })).filter(p => p.id && p.nombre);

    if (soloDisponibles) productos = productos.filter(p => p.disponible);
    if (categoria)       productos = productos.filter(p => p.categoria === categoria);
    productos.sort((a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0));
    return productos;
  },

  async getProducto(id) {
    const todos = await this.getCatalogo({ soloDisponibles: false });
    return todos.find(p => p.id === parseInt(id)) || null;
  },

  // BLOG ───────────────────────────────────────────────────
  async getBlog({ soloActivos = true, categoria = null } = {}) {
    const rows = await fetchSheet(SHEETS_CONFIG.SHEETS.blog);
    let articulos = rows.map(r => ({
      id:          parseInt(r.id) || 0,
      titulo:      r.titulo      || '',
      categoria:   r.categoria   || '',
      extracto:    r.extracto    || '',
      contenido:   r.contenido   || '',
      imagen:      r.imagen      || '',
      fecha:       r.fecha       || '',
      lectura_min: parseInt(r.lectura_min) || 3,
      activo:      toBool(r.activo !== undefined ? r.activo : 'true')
    })).filter(a => a.id && a.titulo);

    if (soloActivos) articulos = articulos.filter(a => a.activo);
    if (categoria)   articulos = articulos.filter(a => a.categoria === categoria);
    articulos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    return articulos;
  },

  async getArticulo(id) {
    const todos = await this.getBlog({ soloActivos: false });
    return todos.find(a => a.id === parseInt(id)) || null;
  },

  // FRASES CÉLEBRES ───────────────────────────────────────
  async getFrases() {
    const rows = await fetchSheet(SHEETS_CONFIG.SHEETS.frases);
    return rows
      .map(r => ({
        id:     parseInt(r.id) || 0,
        texto:  r.texto  || '',
        autor:  r.autor  || '',
        activo: toBool(r.activo !== undefined ? r.activo : 'true')
      }))
      .filter(f => f.id && f.texto && f.activo);
  },

  // FRASE ALEATORIA (para el hero quote) ──────────────────
  async getFraseAleatoria() {
    const frases = await this.getFrases();
    if (!frases.length) return { texto: 'Nadie puede hacerte sentir inferior sin tu consentimiento.', autor: 'Eleanor Roosevelt' };
    return frases[Math.floor(Math.random() * frases.length)];
  },

  // CONTACTO ───────────────────────────────────────────────
  async getContacto() {
    const rows = await fetchSheet(SHEETS_CONFIG.SHEETS.contacto);
    const c    = kvToObject(rows);
    return {
      titulo:    c.titulo    || '¿Buscas una selección especial?',
      ubicacion: c.ubicacion || 'Santo Domingo, República Dominicana',
      horario:   c.horario   || 'Lun–Sáb: 10:00am – 8:00pm · Dom: 11:00am – 5:00pm',
      instagram: c.instagram || '@epicurconcept',
      whatsapp:  c.whatsapp  || '18091234567',
      maps_url:  c.maps_url  || ''
    };
  },

  // CATEGORÍAS DISPONIBLES en catálogo ────────────────────
  async getCategorias() {
    const productos = await this.getCatalogo();
    return [...new Set(productos.map(p => p.categoria).filter(Boolean))];
  },

  // CATEGORÍAS DISPONIBLES en blog ─────────────────────────
  async getCategoriasBlog() {
    const articulos = await this.getBlog();
    return [...new Set(articulos.map(a => a.categoria).filter(Boolean))];
  }
};

// Exportar globalmente
window.EpicurCMS = EpicurCMS;
window.SHEETS_CONFIG = SHEETS_CONFIG;
