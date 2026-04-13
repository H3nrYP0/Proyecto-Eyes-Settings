export const COLORES_ESTADO_VENTA = {
  completada:    { bg: "#dcfce7", color: "#166534" },
  anulada:       { bg: "#fee2e2", color: "#991b1b" },
  pendiente_pago: { bg: "#fef3c7", color: "#92400e" },
};

export const getEstadoLabelVenta = (estado) => {
  const labels = {
    completada:     "Completada",
    anulada:        "Anulada",
    pendiente_pago: "Pendiente de pago",
  };
  return labels[estado] ?? estado;
};

export const formatCurrency = (amount) =>
  `$${(amount || 0).toLocaleString("es-CO")}`;