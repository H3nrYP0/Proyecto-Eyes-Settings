export const ESTADOS_VENTA = [
  { value: "completada", label: "Completada" },
  { value: "anulada",    label: "Anulada"    },
];

export const METODOS_PAGO    = ["efectivo", "transferencia", "tarjeta"];
export const METODOS_ENTREGA = ["tienda", "domicilio"];

export const COLORES_ESTADO_VENTA = {
  completada: { bg: "#dcfce7", color: "#166534" },
  anulada:    { bg: "#fee2e2", color: "#991b1b" },
};

export const getEstadoLabelVenta = (estado) => {
  const labels = { completada: "Completada", anulada: "Anulada" };
  return labels[estado] ?? estado ?? "—";
};

export const formatCurrency = (amount) =>
  `$${(amount || 0).toLocaleString("es-CO")}`;