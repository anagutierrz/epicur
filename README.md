# EPICUR CONCEPT — Guía Google Sheets CMS

## Paso 1 — Crear el Google Sheet

Abre este enlace para copiar la plantilla directamente:
(O crea un Sheet nuevo y agrega las pestañas manualmente)

El Sheet necesita **6 pestañas** con estos nombres exactos:

| Pestaña    | Qué controla                          |
|------------|---------------------------------------|
| Config     | Nombre, WhatsApp, Instagram, horario  |
| Hero       | Textos del inicio, títulos, estadísticas |
| Catalogo   | Todos los productos                   |
| Blog       | Todos los artículos                   |
| Frases     | Frases célebres (rotan aleatoriamente)|
| Contacto   | Datos de contacto                     |

---

## Paso 2 — Estructura de cada pestaña

### Pestaña: Config
| clave | valor |
|-------|-------|
| nombre | EPICUR CONCEPT |
| ciudad | Santo Domingo, República Dominicana |
| whatsapp | 18091234567 |
| instagram | @epicurconcept |
| facebook | https://facebook.com/epicurconcept |
| horario | Lun–Sáb: 10:00am – 8:00pm |
| anio | 2026 |

### Pestaña: Hero
| clave | valor |
|-------|-------|
| eyebrow | Santo Domingo · República Dominicana |
| titulo | Un rincón para los sentidos |
| subtitulo | Cigarros, rones, café y más... |
| btn_principal | Explorar catálogo |
| btn_secundario | Conocer la historia |
| concepto_titulo | Cada producto tiene una historia |
| concepto_texto1 | Primer párrafo de la sección concepto |
| concepto_texto2 | Segundo párrafo de la sección concepto |
| stat1_num | 8+ |
| stat1_lbl | Marcas curadas |
| stat2_num | 5 |
| stat2_lbl | Categorías |
| stat3_num | RD |
| stat3_lbl | Santo Domingo |

### Pestaña: Catalogo
Fila 1 = encabezados (exactamente así):
```
id | nombre | categoria | origen | descripcion | descripcion_larga | notas | maridaje | imagen | precio | disponible | destacado
```
- **categoria**: cigarros / rones / cafe / cervezas / frutos / miel
- **imagen**: nombre del archivo (ej: img_most_wanted_2.png) o URL completa
- **precio**: vacío si no tiene precio público
- **disponible**: TRUE o FALSE
- **destacado**: TRUE = aparece primero

### Pestaña: Blog
Fila 1 = encabezados:
```
id | titulo | categoria | extracto | contenido | imagen | fecha | lectura_min | activo
```
- **contenido**: texto con HTML simple: `<p>párrafo</p><h3>título</h3>`
- **fecha**: formato YYYY-MM-DD (ej: 2026-05-20)
- **activo**: TRUE o FALSE

### Pestaña: Frases
```
id | texto | autor | activo
```
Agrega todas las frases que quieras. Se muestran de forma aleatoria.

### Pestaña: Contacto
| clave | valor |
|-------|-------|
| titulo | ¿Buscas una selección especial? |
| ubicacion | Santo Domingo, República Dominicana |
| horario | Lun–Sáb: 10:00am – 8:00pm · Dom: 11:00am – 5:00pm |
| instagram | @epicurconcept |
| whatsapp | 18091234567 |
| maps_url | https://maps.google.com/... |

---

## Paso 3 — Publicar el Sheet

1. En el Sheet: **Archivo → Compartir → Publicar en la web**
2. Selecciona: **"Todo el documento"**
3. Formato: **Valores separados por comas (.csv)**
4. Haz clic en **"Publicar"** → confirma
5. Copia el **ID** del Sheet (es el código largo en la URL entre `/d/` y `/edit`)

Ejemplo de URL:
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit
                                        ↑ este es el ID ↑
```

---

## Paso 4 — Configurar la web

Abre el archivo `/js/sheets.js` y reemplaza en la línea 40:

```js
SPREADSHEET_ID: 'TU_SPREADSHEET_ID_AQUI',
```

Por tu ID real:

```js
SPREADSHEET_ID: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms',
```

---

## Paso 5 — Subir a Vercel

1. Ve a **vercel.com** → New Project
2. Elige **"Deploy without Git"** → arrastra la carpeta `epicur2/`
3. Framework: **Other**
4. Deploy — listo en 30 segundos

---

## Cómo actualizar el contenido después

El cliente solo entra a su Google Sheet y edita.
La web se actualiza automáticamente al recargar la página.

**No se necesita tocar ningún archivo de código.**

### Para agregar un producto:
→ Abre la pestaña **Catalogo** → agrega una fila nueva al final → guarda

### Para publicar un artículo:
→ Abre la pestaña **Blog** → agrega una fila nueva al final → guarda

### Para cambiar el número de WhatsApp:
→ Abre la pestaña **Config** → cambia el valor de `whatsapp` → guarda

### Para agregar una frase célebre:
→ Abre la pestaña **Frases** → agrega una fila → guarda

### Para ocultar un producto sin borrarlo:
→ Cambia `disponible` de `TRUE` a `FALSE`

---

## Estructura de archivos

```
epicur2/
├── index.html              → Página principal
├── css/global.css          → Estilos
├── js/
│   ├── sheets.js           ← CONFIGURAR EL ID AQUÍ
│   └── global.js           → JS compartido
├── images/                 → Imágenes locales
├── catalogo/catalogo.html  → Catálogo completo
└── blog/
    ├── blog.html           → Listado del blog
    └── articulo.html       → Detalle de artículo
```
