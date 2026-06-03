# Dashboard Gastos Mayo 2026 — SPYnet Valenzuela

## Archivos incluidos
- `index.html`  — estructura principal
- `styles.css`  — estilos y diseño
- `app.js`      — lógica del dashboard
- `data.js`     — datos editables de gastos y transferencias

## Cómo usar
1. Descomprimí el ZIP en cualquier carpeta
2. Abrí `index.html` en tu navegador (doble click)
3. No requiere servidor, funciona offline

## Cómo agregar datos
Editá `data.js`:

### Agregar un gasto:
En la categoría correspondiente, agregá una línea al array `items`:
```js
["DD/MM/AAAA", "DESCRIPCIÓN", monto, "url_imagen_opcional"]
```

### Agregar una transferencia:
En el array `transferencias`:
```js
{ fecha: "DD/MM/AAAA", persona: "NOMBRE", concepto: "...", monto: 000000, comprobante: "", estado: "acreditado" }
```

## Facturas
- Desde la sección **Facturas**: arrastrá o subí imágenes/PDF para guardarlas.
- Desde la tabla **Transferencias** o **Gastos**: usá el botón "Adjuntar" fila a fila.
- Las imágenes se guardan en memoria mientras tenés el navegador abierto.

## Secciones
- **Dashboard** — métricas, gráfico de barras por fecha, dona y ranking
- **Transferencias** — listado con búsqueda, paginación y comprobantes
- **Detalle gastos** — todas las transacciones con filtro y paginación
- **Facturas** — galería de comprobantes subibles
