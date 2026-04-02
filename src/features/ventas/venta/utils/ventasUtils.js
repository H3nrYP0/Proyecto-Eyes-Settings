// ============================
// Constantes
// ============================
export const ESTADOS_VENTA = [
  { value: "completada", label: "Completada" },
  { value: "anulada", label: "Anulada" },
  { value: "pendiente_pago", label: "Pendiente de Pago" },
];

export const METODOS_PAGO = ["efectivo", "tarjeta", "transferencia"];
export const METODOS_ENTREGA = ["tienda", "domicilio"];

// ============================
// Formato de moneda
// ============================
export const formatCurrency = (amount) => `$${(amount || 0).toLocaleString("es-CO")}`;

// ============================
// Estado badge
// ============================
export const getEstadoBadge = (estado) => {
  const badges = {
    completada: "success",
    anulada: "error",
    pendiente_pago: "warning",
  };
  return badges[estado] || "default";
};