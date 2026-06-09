export const ESTADOS_PEDIDO = [
  { value: "pendiente", label: "Pendiente" },
  { value: "pagado",    label: "Pagado"    },
  { value: "anulado",   label: "Anulado"   },
];

export const METODOS_PAGO    = ["efectivo", "transferencia", "tarjeta"];
export const METODOS_ENTREGA = ["tienda", "domicilio"];

export const ESTADOS_ABONABLE = ["pendiente"];

export const COLORES_ESTADO = {
  pendiente: { bg: "#fef3c7", color: "#92400e" },
  pagado:    { bg: "#dcfce7", color: "#166534" },
  anulado:   { bg: "#fee2e2", color: "#991b1b" },
};

export const formatCurrency = (amount) =>
  `$${(amount || 0).toLocaleString("es-CO")}`;

export const getEstadoLabel = (estado) => {
  const found = ESTADOS_PEDIDO.find((e) => e.value === estado);
  return found ? found.label : estado;
};

/**
 * Convierte una fecha ISO (UTC) a la fecha local de Colombia (UTC-5)
 * y la formatea como "d de mes de año".
 * Ejemplo: "2026-06-09T00:00:00.000Z" -> "8 de junio de 2026"
 */
export const formatLocalDateFromISO = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  // Ajustar restando 5 horas (Colombia UTC-5)
  const localDate = new Date(date.getTime() - 5 * 60 * 60 * 1000);
  const day = localDate.getDate();
  const month = localDate.getMonth() + 1;
  const year = localDate.getFullYear();
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  return `${day} de ${meses[month - 1]} de ${year}`;
};