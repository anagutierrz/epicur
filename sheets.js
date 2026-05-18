// sheets.js
const SHEET_ID = '1HJuO2B_u-KN9T9tUFhYdduiNtqnNjDmDlUNY2LENUx0';

const EpicurCMS = {
  // Función central que lee cualquier pestaña del Sheet
  async fetchSheet(sheetName) {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${sheetName}`;
    try {
      const response = await fetch(url);
      const text = await response.text();
      
      // La API de Google devuelve un string envolvente. Extraemos solo el JSON válido:
      const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
      const data = JSON.parse(jsonString);
      
      // Obtenemos los nombres de las columnas (la Fila 1 de tu Excel)
      const headers = data.table.cols.map(col => col.label ? col.label.trim().toLowerCase() : '');
      
      // Mapeamos las filas a objetos de JavaScript
      return data.table.rows.map(row => {
        const rowData = {};
        row.c.forEach((cell, i) => {
          if (headers[i]) {
            // Extrae el valor y maneja celdas en blanco o nulas
            rowData[headers[i]] = cell ? (cell.v !== null ? cell.v : '') : '';
          }
        });
        return rowData;
      });
    } catch (error) {
      console.error(`[EpicurCMS] Error cargando la pestaña "${sheetName}":`, error);
      return [];
    }
  },

  async getConfig() {
    const data = await this.fetchSheet('Config');
    return data[0] || {};
  },

  async getHero() {
    const data = await this.fetchSheet('Hero');
    return data[0] || {};
  },

  async getContacto() {
    const data = await this.fetchSheet('Contacto');
    return data[0] || {};
  },

  async getFraseAleatoria() {
    const data = await this.fetchSheet('Frases');
    if (!data || data.length === 0) return { texto: '', autor: '' };
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex]; // Elige una frase al azar
  },

  async getCatalogo() {
    return await this.fetchSheet('Catalogo');
  },

  async getBlog() {
    return await this.fetchSheet('Blog');
  },
  
  async getArticulo(id) {
    const articulos = await this.getBlog();
    return articulos.find(a => parseInt(a.id) === parseInt(id));
  }
};
