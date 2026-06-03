// ============================================================
// APP.JS — Lógica principal del dashboard
// ============================================================

const App = (() => {

  // ── UTILIDADES ───────────────────────────────────────────────
  const fmt = v => "Gs. " + Math.round(v).toLocaleString("es-PY");

  function parseDate(str) {
    if (!str) return new Date(0);
    const [d, m, y] = str.split("/");
    return new Date(+y, +m - 1, +d);
  }

  function labelFecha(str) {
    const d = parseDate(str);
    return d.toLocaleDateString("es-PY", { day: "2-digit", month: "short" });
  }

  // ── PAGINACIÓN ───────────────────────────────────────────────
  const PER_PAGE = 10;
  const pState = { gastos: 1, trans: 1 };

  function renderPagination(containerId, total, currentPage, onPage) {
    const pages = Math.ceil(total / PER_PAGE);
    const el = document.getElementById(containerId);
    if (!el) return;
    if (pages <= 1) { el.innerHTML = ""; return; }

    let html = `<div class="pag-info">Página ${currentPage} de ${pages}</div><div class="pag-btns">`;
    html += `<button class="pag-btn" ${currentPage === 1 ? "disabled" : ""} onclick="(${onPage})(${currentPage - 1})">&#8592;</button>`;
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - currentPage) <= 1) {
        html += `<button class="pag-btn ${i === currentPage ? "active" : ""}" onclick="(${onPage})(${i})">${i}</button>`;
      } else if (Math.abs(i - currentPage) === 2) {
        html += `<span class="pag-dots">…</span>`;
      }
    }
    html += `<button class="pag-btn" ${currentPage === pages ? "disabled" : ""} onclick="(${onPage})(${currentPage + 1})">&#8594;</button>`;
    html += "</div>";
    el.innerHTML = html;
  }

  // ── NAVEGACIÓN ───────────────────────────────────────────────
  function initNav() {
    document.querySelectorAll(".nav-item").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const sec = link.dataset.section;
        document.querySelectorAll(".nav-item").forEach(l => l.classList.remove("active"));
        document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
        link.classList.add("active");
        document.getElementById(sec)?.classList.add("active");
      });
    });
  }

  // ── DATOS DERIVADOS ──────────────────────────────────────────
  function getAllItems() {
    const arr = [];
    APP_DATA.categorias.forEach(cat => {
      cat.items.forEach(it => {
        arr.push({ fecha: it[0], cat: cat.nombre, color: cat.color, detalle: it[1], monto: it[2], factura: it[3] || "" });
      });
    });
    return arr.sort((a, b) => parseDate(a.fecha) - parseDate(b.fecha));
  }

  function getTotal() {
    return getAllItems().reduce((s, i) => s + i.monto, 0);
  }

  function getTotalesPorCategoria() {
    const map = {};
    APP_DATA.categorias.forEach(cat => {
      map[cat.nombre] = { total: cat.items.reduce((s, i) => s + i[2], 0), color: cat.color };
    });
    return map;
  }

  function getGastosPorFecha() {
    const map = {};
    getAllItems().forEach(i => {
      if (!map[i.fecha]) map[i.fecha] = 0;
      map[i.fecha] += i.monto;
    });
    const fechas = Object.keys(map).sort((a, b) => parseDate(a) - parseDate(b));
    return { fechas, montos: fechas.map(f => map[f]) };
  }

  // ── MÉTRICAS DASHBOARD ───────────────────────────────────────
  function renderMetrics() {
    const total = getTotal();
    const items = getAllItems();
    const cats = getTotalesPorCategoria();
    const maxCat = Object.entries(cats).sort((a, b) => b[1].total - a[1].total)[0];
    const { fechas, montos } = getGastosPorFecha();
    const maxFechaIdx = montos.indexOf(Math.max(...montos));

    // Adelantos por persona
    const adelantos = {};
    APP_DATA.categorias
      .find(c => c.nombre === "Adelantos")
      ?.items.forEach(it => {
        adelantos[it[1]] = (adelantos[it[1]] || 0) + it[2];
      });
    const yessica   = adelantos["YESSICA ARACELI LOPEZ RAMIREZ"] || 0;
    const cristhian = adelantos["CRISTHIAN ALCARAZ"] || 0;
    const robert    = adelantos["ROBERT LECKIE"] || 0;

    document.getElementById("metricsEl").innerHTML = `
      <div class="metric accent">
        <div class="metric-label">Total general</div>
        <div class="metric-val">${fmt(total)}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Mayor categoría</div>
        <div class="metric-val">${maxCat[0]}</div>
        <div class="metric-sub">${Math.round(maxCat[1].total / total * 100)}% del total</div>
      </div>
      <div class="metric">
        <div class="metric-label">Día con más gasto</div>
        <div class="metric-val">${labelFecha(fechas[maxFechaIdx])}</div>
        <div class="metric-sub">${fmt(montos[maxFechaIdx])}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Adelantos Yessica</div>
        <div class="metric-val">${fmt(yessica)}</div>
        <div class="metric-sub">acumulado mayo</div>
      </div>
      <div class="metric">
        <div class="metric-label">Adelantos Cristhian</div>
        <div class="metric-val">${fmt(cristhian)}</div>
        <div class="metric-sub">acumulado mayo</div>
      </div>
      <div class="metric">
        <div class="metric-label">Adelantos Robert</div>
        <div class="metric-val">${fmt(robert)}</div>
        <div class="metric-sub">acumulado mayo</div>
      </div>
    `;
  }

  // ── GRÁFICO DE BARRAS POR FECHA ──────────────────────────────
  let barChartInst = null;
  function renderBarChart() {
    const { fechas, montos } = getGastosPorFecha();
    const labels = fechas.map(labelFecha);
    const maxVal = Math.max(...montos);
    const colors = montos.map(v => v === maxVal ? "#E24B4A" : "#378ADD");

    if (barChartInst) barChartInst.destroy();
    barChartInst = new Chart(document.getElementById("barChart"), {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Gasto del día",
          data: montos,
          backgroundColor: colors,
          borderRadius: 5,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${fmt(ctx.raw)}`,
              title: (items) => { const idx = items[0].dataIndex; return fechas[idx]; }
            }
          }
        },
        scales: {
          x: {
            ticks: { font: { size: 11, family: "'DM Mono', monospace" }, color: "#888", autoSkip: false, maxRotation: 45 },
            grid: { display: false }
          },
          y: {
            ticks: {
              font: { size: 11 }, color: "#888",
              callback: v => v >= 1000000 ? (v / 1000000).toFixed(1) + "M" : (v / 1000).toFixed(0) + "K"
            },
            grid: { color: "rgba(0,0,0,0.05)" }
          }
        }
      }
    });
  }

  // ── GRÁFICO DONA ─────────────────────────────────────────────
  let donutInst = null;
  function renderDonut() {
    const cats = getTotalesPorCategoria();
    const total = getTotal();
    const entries = Object.entries(cats).filter(([, v]) => v.total > 0).sort((a, b) => b[1].total - a[1].total);

    if (donutInst) donutInst.destroy();
    donutInst = new Chart(document.getElementById("donutChart"), {
      type: "doughnut",
      data: {
        labels: entries.map(([n]) => n),
        datasets: [{
          data: entries.map(([, v]) => v.total),
          backgroundColor: entries.map(([, v]) => v.color),
          borderWidth: 2,
          borderColor: "#fff",
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${fmt(ctx.raw)} (${Math.round(ctx.raw / total * 100)}%)` } }
        },
        cutout: "65%"
      }
    });

    document.getElementById("donutLegend").innerHTML = entries.map(([n, v]) =>
      `<span class="leg-item"><span class="leg-dot" style="background:${v.color}"></span>${n} <strong>${Math.round(v.total / total * 100)}%</strong></span>`
    ).join("");
  }

  // ── BAR LIST ─────────────────────────────────────────────────
  function renderBarList() {
    const cats = getTotalesPorCategoria();
    const total = getTotal();
    const sorted = Object.entries(cats).filter(([, v]) => v.total > 0).sort((a, b) => b[1].total - a[1].total);
    const max = sorted[0][1].total;

    document.getElementById("barListEl").innerHTML = sorted.map(([n, v]) => `
      <div class="bl-row">
        <div class="bl-name">${n}</div>
        <div class="bl-bar-wrap"><div class="bl-bar" style="width:${Math.round(v.total / max * 100)}%;background:${v.color}"></div></div>
        <div class="bl-val">${Math.round(v.total / total * 100)}%</div>
      </div>
    `).join("");
  }

  // ── TRANSFERENCIAS ───────────────────────────────────────────
  let transFiltered = [...APP_DATA.transferencias];

  function renderTransMetrics() {
    const trans = APP_DATA.transferencias;
    const totalTrans = trans.reduce((s, t) => s + t.monto, 0);

    const soloTransf = trans.filter(t => (t.medio || "transferencia") === "transferencia");
    const soloEfect  = trans.filter(t => t.medio === "efectivo");

    const byPersona = {};
    trans.forEach(t => { byPersona[t.persona] = (byPersona[t.persona] || 0) + t.monto; });
    const topPersona = Object.entries(byPersona).sort((a, b) => b[1] - a[1])[0];

    document.getElementById("transMetricsEl").innerHTML = `
      <div class="metric accent">
        <div class="metric-label">Total pagos</div>
        <div class="metric-val">${fmt(totalTrans)}</div>
        <div class="metric-sub">${trans.length} registros</div>
      </div>
      <div class="metric">
        <div class="metric-label">Transferencias bancarias</div>
        <div class="metric-val">${fmt(soloTransf.reduce((s,t)=>s+t.monto,0))}</div>
        <div class="metric-sub">${soloTransf.length} pagos</div>
      </div>
      <div class="metric">
        <div class="metric-label">Pagos en efectivo</div>
        <div class="metric-val">${fmt(soloEfect.reduce((s,t)=>s+t.monto,0))}</div>
        <div class="metric-sub">${soloEfect.length} pagos</div>
      </div>
      <div class="metric">
        <div class="metric-label">Mayor receptor</div>
        <div class="metric-val">${topPersona[0].split(" ")[0]} ${topPersona[0].split(" ")[1] || ""}</div>
        <div class="metric-sub">${fmt(topPersona[1])}</div>
      </div>
    `;
  }

  function filtrarTransferencias() {
    const q = document.getElementById("searchTrans")?.value.toLowerCase() || "";
    const medio = document.getElementById("filterMedio")?.value || "";
    transFiltered = APP_DATA.transferencias.filter(t => {
      const matchQ = t.persona.toLowerCase().includes(q) || t.concepto.toLowerCase().includes(q);
      const matchM = !medio || (t.medio || "transferencia") === medio;
      return matchQ && matchM;
    });
    pState.trans = 1;
    renderTransTable();
  }

  function renderTransTable() {
    const tbody = document.getElementById("transTbody");
    const start = (pState.trans - 1) * PER_PAGE;
    const page = transFiltered.slice(start, start + PER_PAGE);

    tbody.innerHTML = page.map((t, i) => {
      const globalIdx = APP_DATA.transferencias.indexOf(t);
      const medio = t.medio || "transferencia";
      const medioBadge = medio === "efectivo"
        ? `<span class="medio-pill efectivo">💵 Efectivo</span>`
        : `<span class="medio-pill transferencia">🏦 Transferencia</span>`;
      return `
      <tr>
        <td class="mono muted">${t.fecha}</td>
        <td><div class="persona-cell"><div class="avatar">${t.persona[0]}</div>${t.persona}</div></td>
        <td>${t.concepto}</td>
        <td class="mono"><strong>${fmt(t.monto)}</strong></td>
        <td>${medioBadge}</td>
        <td>
          ${t.comprobante
            ? `<button class="btn-ver" onclick="App.verImagen('${t.comprobante}','${t.persona}')">Ver</button>`
            : `<label class="btn-attach" title="Adjuntar comprobante">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                Adjuntar
                <input type="file" accept="image/*,.pdf" style="display:none" onchange="App.adjuntarComprobante(${globalIdx}, this)">
              </label>`
          }
        </td>
        <td><span class="status-pill ${t.estado}">${t.estado}</span></td>
        <td>
          <button class="btn-delete-row" onclick="App.confirmarEliminarTransferencia(${globalIdx})" title="Eliminar">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </button>
        </td>
      </tr>
    `}).join("");

    renderPagination("transPag", transFiltered.length, pState.trans, "p => { App._setTransPage(p); App.renderTransTable(); }");
  }

  function _setTransPage(p) { pState.trans = p; }

  function adjuntarComprobante(idx, input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      APP_DATA.transferencias[idx].comprobante = e.target.result;
      transFiltered = [...APP_DATA.transferencias];
      renderTransTable();
    };
    reader.readAsDataURL(file);
  }

  // ── MODAL ELIMINAR ───────────────────────────────────────────
  let _pendingDeleteIdx = null;
  const DELETE_PASSWORD = "SpyNet2026V";

  function confirmarEliminarTransferencia(idx) {
    _pendingDeleteIdx = idx;
    const t = APP_DATA.transferencias[idx];
    document.getElementById("deleteInfoPersona").textContent = t.persona;
    document.getElementById("deleteInfoConcepto").textContent = t.concepto;
    document.getElementById("deleteInfoMonto").textContent = fmt(t.monto);
    document.getElementById("deleteInfoFecha").textContent = t.fecha;
    document.getElementById("deleteInfoMedio").textContent = (t.medio || "transferencia") === "efectivo" ? "💵 Efectivo" : "🏦 Transferencia";
    document.getElementById("deletePassword").value = "";
    document.getElementById("deleteError").style.display = "none";
    document.getElementById("deletePassword").classList.remove("input-error");
    document.getElementById("modalDeleteOverlay").classList.add("show");
    setTimeout(() => document.getElementById("deletePassword").focus(), 100);
  }

  function cerrarModalDelete() {
    document.getElementById("modalDeleteOverlay").classList.remove("show");
    _pendingDeleteIdx = null;
  }

  function ejecutarEliminarTransferencia() {
    const pass = document.getElementById("deletePassword").value;
    const errEl = document.getElementById("deleteError");
    const inputEl = document.getElementById("deletePassword");

    if (pass !== DELETE_PASSWORD) {
      errEl.style.display = "flex";
      inputEl.classList.add("input-error");
      inputEl.focus();
      inputEl.select();
      inputEl.classList.add("shake");
      setTimeout(() => inputEl.classList.remove("shake"), 500);
      return;
    }

    if (_pendingDeleteIdx === null) return;

    // También eliminar de categorias si existe el item
    const t = APP_DATA.transferencias[_pendingDeleteIdx];
    for (const cat of APP_DATA.categorias) {
      const idx = cat.items.findIndex(it => it[0] === t.fecha && it[1] === t.persona && it[2] === t.monto);
      if (idx !== -1) { cat.items.splice(idx, 1); break; }
    }

    APP_DATA.transferencias.splice(_pendingDeleteIdx, 1);
    transFiltered = [...APP_DATA.transferencias];
    cerrarModalDelete();
    renderTransMetrics();
    renderTransTable();
    renderMetrics();
    renderBarChart();
    renderDonut();
    renderBarList();
    gastosFiltered = getAllItems();
    renderGastosTable();
  }

  // ── DETALLE GASTOS ───────────────────────────────────────────
  let gastosFiltered = [];

  function initGastosFilter() {
    const sel = document.getElementById("filterCat");
    APP_DATA.categorias.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.nombre;
      opt.textContent = c.nombre;
      sel.appendChild(opt);
    });
    gastosFiltered = getAllItems();
    renderGastosTable();
  }

  function filtrarGastos() {
    const q = document.getElementById("searchGastos")?.value.toLowerCase() || "";
    const cat = document.getElementById("filterCat")?.value || "";
    gastosFiltered = getAllItems().filter(i =>
      (!cat || i.cat === cat) &&
      (!q || i.detalle.toLowerCase().includes(q) || i.cat.toLowerCase().includes(q))
    );
    pState.gastos = 1;
    renderGastosTable();
  }

  function renderGastosTable() {
    const tbody = document.getElementById("gastosTbody");
    const start = (pState.gastos - 1) * PER_PAGE;
    const page = gastosFiltered.slice(start, start + PER_PAGE);
    const totalFiltrado = gastosFiltered.reduce((s, i) => s + i.monto, 0);

    tbody.innerHTML = page.map((it, i) => `
      <tr>
        <td class="mono muted">${it.fecha}</td>
        <td><span class="cat-pill" style="background:${it.color}22;color:${it.color}">${it.cat}</span></td>
        <td>${it.detalle}</td>
        <td class="mono"><strong>${fmt(it.monto)}</strong></td>
        <td>
          ${it.factura
            ? `<button class="btn-ver" onclick="App.verImagen('${it.factura}','${it.detalle}')">Ver</button>`
            : `<label class="btn-attach">
                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
                Adjuntar
                <input type="file" accept="image/*,.pdf" style="display:none" onchange="App.adjuntarFacturaGasto(${start + i}, this)">
              </label>`
          }
        </td>
      </tr>
    `).join("");

    document.getElementById("gastosTotalFoot").textContent = fmt(totalFiltrado);
    renderPagination("gastosPag", gastosFiltered.length, pState.gastos, "p => { App._setGastosPage(p); App.renderGastosTable(); }");
  }

  function _setGastosPage(p) { pState.gastos = p; }

  function adjuntarFacturaGasto(localIdx, input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const globalIdx = (pState.gastos - 1) * PER_PAGE + localIdx;
      const item = gastosFiltered[globalIdx];
      for (const cat of APP_DATA.categorias) {
        if (cat.nombre !== item.cat) continue;
        for (const it of cat.items) {
          if (it[0] === item.fecha && it[1] === item.detalle && it[2] === item.monto) {
            it[3] = e.target.result;
            break;
          }
        }
      }
      filtrarGastos();
    };
    reader.readAsDataURL(file);
  }

  // ── FACTURAS ─────────────────────────────────────────────────
  let facturas = [];

  function subirFacturas(files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        facturas.push({ nombre: file.name, src: e.target.result, tipo: file.type, fecha: new Date().toLocaleDateString("es-PY") });
        renderFacturas();
      };
      reader.readAsDataURL(file);
    });
  }

  function dropFacturas(e) {
    e.preventDefault();
    subirFacturas(e.dataTransfer.files);
  }

  function renderFacturas() {
    const grid = document.getElementById("facturasGrid");
    const empty = document.getElementById("facturasEmpty");
    if (!facturas.length) { grid.innerHTML = ""; empty.style.display = "flex"; return; }
    empty.style.display = "none";
    grid.innerHTML = facturas.map((f, i) => `
      <div class="factura-card">
        <div class="factura-thumb" onclick="App.verImagen('${f.src}','${f.nombre}')">
          ${f.tipo.includes("pdf")
            ? `<div class="pdf-thumb"><svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/></svg><span>PDF</span></div>`
            : `<img src="${f.src}" alt="${f.nombre}">`
          }
          <div class="factura-overlay"><svg width="18" height="18" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
        </div>
        <div class="factura-info">
          <div class="factura-nombre" title="${f.nombre}">${f.nombre}</div>
          <div class="factura-fecha">${f.fecha}</div>
        </div>
        <button class="factura-delete" onclick="App.eliminarFactura(${i})" title="Eliminar">✕</button>
      </div>
    `).join("");
  }

  function eliminarFactura(i) {
    facturas.splice(i, 1);
    renderFacturas();
  }

  // ── MODAL IMAGEN ─────────────────────────────────────────────
  function verImagen(src, caption) {
    document.getElementById("modalImg").src = src;
    document.getElementById("modalCaption").textContent = caption || "";
    document.getElementById("modalOverlay").classList.add("show");
  }

  function cerrarModal() {
    document.getElementById("modalOverlay").classList.remove("show");
  }

  // ── MODAL PAGO ───────────────────────────────────────────────
  function abrirModalTransferencia() {
    document.getElementById("modalTransOverlay").classList.add("show");
    document.getElementById("tf_medio").value = "transferencia";
  }

  function cerrarModalTrans() {
    document.getElementById("modalTransOverlay").classList.remove("show");
  }

  function guardarTransferencia() {
    const fecha    = document.getElementById("tf_fecha").value;
    const persona  = document.getElementById("tf_persona").value.trim();
    const concepto = document.getElementById("tf_concepto").value.trim();
    const monto    = parseFloat(document.getElementById("tf_monto").value) || 0;
    const medio    = document.getElementById("tf_medio").value;
    const fileEl   = document.getElementById("tf_file");

    if (!fecha || !persona || !monto) { alert("Completá fecha, persona y monto."); return; }

    const [y, m, d] = fecha.split("-");
    const fechaFmt = `${d}/${m}/${y}`;

    function guardar(comprobante) {
      // 1. Agregar a transferencias
      APP_DATA.transferencias.unshift({
        fecha: fechaFmt,
        persona: persona.toUpperCase(),
        concepto,
        monto,
        medio,
        comprobante,
        estado: "acreditado"
      });

      // 2. Agregar también a categorías para reflejar en total general, gráficos y detalle
      //    Mapear el concepto a una categoría existente o usar "Otros gastos" por defecto
      const conceptoLower = concepto.toLowerCase();
      let nombreCat = "Otros gastos";
      if (conceptoLower.includes("sueldo") || conceptoLower.includes("salario")) {
        nombreCat = "Sueldos";
      } else if (conceptoLower.includes("adelanto")) {
        nombreCat = "Adelantos";
      } else if (conceptoLower.includes("internet") || conceptoLower.includes("link")) {
        nombreCat = "Internet";
      } else if (conceptoLower.includes("combustible") || conceptoLower.includes("nafta") || conceptoLower.includes("gasoil")) {
        nombreCat = "Combustible";
      } else if (conceptoLower.includes("limpieza")) {
        nombreCat = "Limpieza";
      } else if (conceptoLower.includes("ferretería") || conceptoLower.includes("ferreteria")) {
        nombreCat = "Ferretería";
      }

      let cat = APP_DATA.categorias.find(c => c.nombre === nombreCat);
      // Si la categoría mapeada no existe, usar "Otros gastos"
      if (!cat) cat = APP_DATA.categorias.find(c => c.nombre === "Otros gastos");
      // Si tampoco existe "Otros gastos", crearla
      if (!cat) {
        cat = { nombre: "Otros gastos", color: "#1D9E75", items: [] };
        APP_DATA.categorias.push(cat);
      }
      cat.items.push([fechaFmt, persona.toUpperCase(), monto, comprobante]);

      // 3. Refrescar todo
      transFiltered = [...APP_DATA.transferencias];
      gastosFiltered = getAllItems();
      renderTransMetrics();
      renderTransTable();
      renderMetrics();
      renderBarChart();
      renderDonut();
      renderBarList();
      renderGastosTable();

      cerrarModalTrans();
      ["tf_fecha", "tf_persona", "tf_concepto", "tf_monto"].forEach(id => document.getElementById(id).value = "");
    }

    if (fileEl.files[0]) {
      const reader = new FileReader();
      reader.onload = e => guardar(e.target.result);
      reader.readAsDataURL(fileEl.files[0]);
    } else {
      guardar("");
    }
  }

  // ── INIT ─────────────────────────────────────────────────────
  function init() {
    initNav();
    renderMetrics();
    renderBarChart();
    renderDonut();
    renderBarList();
    renderTransMetrics();
    filtrarTransferencias();
    initGastosFilter();
    renderFacturas();

    document.getElementById("deletePassword")?.addEventListener("keydown", e => {
      if (e.key === "Enter") ejecutarEliminarTransferencia();
      if (e.key === "Escape") cerrarModalDelete();
    });
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    filtrarTransferencias, renderTransTable, _setTransPage,
    filtrarGastos, renderGastosTable, _setGastosPage,
    subirFacturas, dropFacturas, eliminarFactura,
    verImagen, cerrarModal,
    abrirModalTransferencia, cerrarModalTrans, guardarTransferencia,
    adjuntarComprobante, adjuntarFacturaGasto,
    confirmarEliminarTransferencia, cerrarModalDelete, ejecutarEliminarTransferencia
  };
})();