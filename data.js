// ============================================================
// DATA.JS — Datos de gastos Mayo 2026
// Editá este archivo para agregar/modificar registros.
// Formato de items: ["DD/MM/AAAA", "DESCRIPCIÓN", monto, "url_imagen_o_vacío"]
// ============================================================

window.APP_DATA = {
  titulo: "Gastos Mayo 2026",
  empresa: "SPYnet Valenzuela",

  // ── TRANSFERENCIAS ──────────────────────────────────────────
  // Formato: { fecha, persona, concepto, monto, comprobante }
  transferencias: [
    { fecha: "07/05/2026", persona: "YESSICA ARACELI LOPEZ RAMIREZ", concepto: "Sueldo mayo",        monto: 1800000, comprobante: "", estado: "acreditado" },
    { fecha: "07/05/2026", persona: "CRISTHIAN ALCARAZ",              concepto: "Sueldo mayo",        monto: 1628000, comprobante: "", estado: "acreditado" },
    { fecha: "11/05/2026", persona: "ROBERT LECKIE",                  concepto: "Adelanto mayo",      monto: 300000,  comprobante: "", estado: "acreditado" },
    { fecha: "13/05/2026", persona: "CRISTHIAN ALCARAZ",              concepto: "Adelanto mayo",      monto: 350000,  comprobante: "", estado: "acreditado" },
    { fecha: "16/05/2026", persona: "ROBERT LECKIE",                  concepto: "Adelanto mayo",      monto: 250000,  comprobante: "", estado: "acreditado" },
    { fecha: "08/05/2026", persona: "LINK VALENZUELA",                concepto: "Internet mayo",      monto: 4146000, comprobante: "", estado: "acreditado" },
    { fecha: "08/05/2026", persona: "MARIA GUADALUPE PORTILLO",       concepto: "Limpieza semanal",   monto: 100000,  comprobante: "", estado: "acreditado" },
    { fecha: "16/05/2026", persona: "MARIA GUADALUPE PORTILLO",       concepto: "Limpieza semanal",   monto: 100000,  comprobante: "", estado: "acreditado" }
  ],

  // ── CATEGORÍAS DE GASTOS ────────────────────────────────────
  categorias: [
    {
      nombre: "Adelantos",
      color: "#378ADD",
      items: [
        ["11/05/2026", "ROBERT LECKIE",     300000, "img/HHH.jpg"],
        ["13/05/2026", "CRISTHIAN ALCARAZ", 350000, "img/MNJ.jpg"],
        ["16/05/2026", "ROBERT LECKIE",     250000, ""],
        ["19/05/2026", "YESSICA ARACELI LOPEZ RAMIREZ", 550000, "img/IMG-20260519-WA0073.jpg"],
        ["22/05/2026", "CRISTHIAN ALCARAZ", 400000, "img/11.jpg"],
        ["27/05/2026", "CRISTHIAN ALCARAZ", 100000, "img/DDD.jpg"],
        ["29/05/2026", "CRISTHIAN ALCARAZ", 100000, "img/PPP.jpg"],
        ["29/05/2026", "ROBERT LECKIE", 150000, ""],
        ["31/05/2026", "CRISTHIAN ALCARAZ", 50000, "img/UUU.jpg"],
        ["03/06/2026", "YESSICA ARACELI LOPEZ RAMIREZ", 300000, ""]
      ]
    },
    {
      nombre: "Otros gastos",
      color: "#1D9E75",
      items: [
        ["04/05/2026", "THE GREENS S.A", 707000,  "img/LGH.jpg"],
        ["05/05/2026", "AUTOSERVISE FLORES", 58500,  "img/IMG_20260602_143610.jpg"],
        ["07/05/2026", "DESAYUNO Y MERIENDA FUNCIONARIOS / TORTA",115000, "img/28.jpg"],
        ["09/05/2026", "ALQUILER GENERADOR",              150000, "img/fff.jpg"],
        ["12/05/2026", "DESAYUNO Y MERIENDA FUNCIONARIOS", 70000, "img/gggg.jpg"],
        ["13/05/2026", "SERVIDOR CANALES", 800000, "img/SISI.jpg"],
        ["13/05/2026", "ANDE VALENZUELA", 120500, "img/1780421570197.jpg"],
        ["18/05/2026", "HOSTING", 80000, "img/hosting.jpg"],
        ["19/05/2026", "SALDO,YERBA Y PAPEL HIGIÉNICO/AUTOSERVICE SAN JUAN", 29500, "img/1780335597995.jpg"],
        ["19/05/2026", "DESAYUNO Y MERIENDA FUNCIONARIOS / Día del trabajador", 521000, "img/bbb.jpg"],
        ["19/05/2026", "THE GREENS S.A / DROP", 709000,  "img/DROP.jpg"],
        ["22/05/2026", "SALDO TÉCNICOS", 10000, "img/IMG_20260601_161224.jpg"],
        ["21/05/2026", "FACTURAS", 217500, ""],
        ["23/05/2026", "AGUA (12.000) TRIPLE (7.000)", 19000, "img/13.jpg"],
        ["25/05/2026", "ALEJANDRA CONTADORA", 350000, "img/CONTA.jpg"],
        ["26/05/2026", "DESAYUNO Y MERIENDA FUNCIONARIOS", 33500, "img/IMG_20260602_095413.jpg"],
        ["26/05/2026", "HR FIBER SOCIEDAD ANONIMA / ONU Y ROUTER", 907500, "img/nn.jpg"],
        ["27/05/2026", "LIMPIA VIDRIO 2, DESODORANTE DE AMBIENTE PINO LECHE,FRANELA BRILHUS, BOLSA PARA BAÑO, BOLSA PARA BASURA", 89000, "img/nn.jpg"],
        ["27/05/2026", "GASTOS EXTRAORDINARIOS / SELLO", 280000, "img/LLLL.jpg"],
        ["29/05/2026", "SALDO CELL OFICINA", 20000, ""],
        ["30/05/2026", "ALQUILER GENERADOR / efectivo", 150000, ""],
      ]
    },
    {
      nombre: "Internet",
      color: "#E24B4A",
      items: [
        ["08/05/2026", "LINK VALENZUELA", 4146000, ""]
      ]
    },
    {
      nombre: "Sueldos",
      color: "#BA7517",
      items: [
        ["07/05/2026", "YESSICA ARACELI LOPEZ RAMIREZ", 1800000, "img/26.jpg"],
        ["07/05/2026", "CRISTHIAN ALCARAZ",             1628000, "img/27.jpg"]
      ]
    },
    {
      nombre: "Ferretería",
      color: "#888780",
      items: [
        ["06/05/2026", "COMPRA DE HERRAMEINTA ESPUELIN", 180000, "img/CCC.jpg"],
        ["08/05/2026", "FERRETERÍA SAN MARCOS / WD - 40", 12000, "img/IMG_20260602_145509.jpg"],
        ["08/05/2026", "FERRETERÍA SAN MARCOS / ALICATE (29.000) Y AGUA (15.000)", 44000, "img/1780423342523.jpg"],
        ["11/05/2026", "FERRETERÍA SAN MARCOS / CINTILLO Y CINTA", 20000, "img/1780425687395.jpg"],
        ["11/05/2026", "FERRETERÍA SAN MARCOS / MATA TODO Y GUANTE", 35000, "img/1780424496421.jpg"],
        ["11/05/2026", "FERRETERÍA SAN MARCOS / TRIPLE",  6000, "img/1780424108354.jpg"],
        ["11/05/2026", "FERRETERÍA SAN MARCOS / TRIPLE",  6000, "img/1780424299072.jpg"],
        ["12/05/2026", "FERRETERÍA SAN MARCOS / MECHA", 10000, "img/IMG_20260602_150908_1.jpg"],
        ["13/05/2026", "FERRETERÍA SAN MARCOS / GRAMPA", 20000, "img/IMG_20260602_150643.jpg"],
        ["16/05/2026", "FERRETERÍA SAN MARCOS / CINTA AISLANTE, GOMA Y SALDO", 29000, "img/1780424676797.jpg"],
        ["18/05/2026", "CINTILLO Y CINTA PAPEL/FERRETERÍA SAN MARCOS", 31000, "img/1780335295313.jpg"],
        ["20/05/2026", "GRAMPITA, TARUGO Y TORNILLO/FERRETERÍA SAN MARCOS", 30000, "img/IMG_20260601_150242.jpg"],
        ["21/05/2026", "CINTA, TARUGO Y TORNILLO/FERRETERÍA SAN MARCOS", 29000, "img/IMG_20260601_154708.jpg"],
        ["25/05/2026", "GOMA PARA PORTA ESCALERA/FERRETERÍA SAN MARCOS", 10000, "img/MMM.jpeg"],
        ["26/05/2026", "TARUGO Y TORNILLO/FERRETERÍA SAN MARCOS", 7000, "img/IMG_20260602_094623.jpg"]
      ]
    },
    {
      nombre: "Combustible",
      color: "#7F77DD",
      items: [
        ["01/05/2026", "Móvil 3",100000, "img/KKK.jpg"],
        ["04/05/2026", "Móvil 3",100000, "img/JJJ.jpg"],
        ["07/05/2026", "Móvil 3",100000, "img/HFB.jpg"],
        ["08/05/2026", "Móvil 3 EFECTIVO",100000, ""],
        ["08/05/2026", "MOVIL DIRECTORIO",135000, "img/vvv.jpg"],
        ["09/05/2026", "Móvil 3",100000, "img/COMB.jpg"],
        ["09/05/2026", "Móvil 5",100000, "img/COMB.jpg"],
        ["09/05/2026", "Móvil 5",50000, "img/IMG_20260603_111242.jpg"],
        ["11/05/2026", "Móvil 3",100000, "img/FFDS.jpg"],
        ["13/05/2026", "Móvil 5",100000, "img/BVN.jpg"],
        ["19/05/2026", "Móvil 3",100000, "img/HOLA.jpg"],
        ["21/05/2026", "Móvil 3",100000, "img/combus.jpg"],
        ["22/05/2026", "Móvil 3",100000, "img/22.jpg"],
        ["25/05/2026", "Móvil 3 08:46 hrs (transferencia)",100000, "img/14.jpg"],
        ["25/05/2026", "Móvil 3 16:21 hrs (efectivo)",100000, "img/IMG_20260602_081150.jpg"],
        ["25/05/2026", "MOVIL DIRECTORIO",100000, "img/DIREC.jpg"],
        ["25/05/2026", "MOVIL DIRECTORIO",200000, "img/MOVILD.jpg"],
        ["26/05/2026", "Móvil 3",100000, "img/1780404624547.jpg"],
        ["28/05/2026", "Móvil 3 EFECTIVO",100000, ""],
        ["30/05/2026", "Móvil 3",100000, "img/MYY.jpg"]
      ]
    },
    {
      nombre: "Limpieza",
      color: "#D4537E",
      items: [
        ["08/05/2026", "MARIA GUADALUPE PORTILLO", 100000, "img/IMG_20260602_155220.jpg"],
        ["16/05/2026", "MARIA GUADALUPE PORTILLO", 100000, "img/LIM.jpg"],
        ["22/05/2026", "MARIA GUADALUPE PORTILLO", 100000, "img/IMG_20260602_155147.jpg"],
        ["29/05/2026", "MARIA GUADALUPE PORTILLO", 100000, "img/1780341794290.jpg"],
      ]
    }
  ]
};
