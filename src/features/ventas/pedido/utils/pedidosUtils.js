// src/features/ventas/pedido/utils/pedidosUtils.js

export const ESTADOS_PEDIDO = [
  { value: "pendiente",      label: "Pendiente" },
  { value: "confirmado",     label: "Confirmado" },
  { value: "en_preparacion", label: "En preparación" },
  { value: "enviado",        label: "Enviado" },
  { value: "entregado",      label: "Entregado" },
  { value: "cancelado",      label: "Cancelado" },
];

export const METODOS_PAGO = ["efectivo", "transferencia"];
export const METODOS_ENTREGA = ["tienda", "domicilio"];

export const ESTADOS_ABONABLE = ["pendiente", "confirmado", "en_preparacion", "enviado"];

export const COLORES_ESTADO = {
  pendiente:      { bg: "#fef3c7", color: "#92400e" },
  confirmado:     { bg: "#dbeafe", color: "#1e40af" },
  en_preparacion: { bg: "#ede9fe", color: "#5b21b6" },
  enviado:        { bg: "#d1fae5", color: "#065f46" },
  entregado:      { bg: "#dcfce7", color: "#166534" },
  cancelado:      { bg: "#fee2e2", color: "#991b1b" },
};

export const formatCurrency = (amount) => `$${(amount || 0).toLocaleString("es-CO")}`;

export const getEstadoLabel = (estado) => {
  const found = ESTADOS_PEDIDO.find(e => e.value === estado);
  return found ? found.label : estado;
};

export const getEstadoBadge = (estado) => {
  const badges = {
    pendiente:      "warning",
    confirmado:     "info",
    en_preparacion: "info",
    enviado:        "info",
    entregado:      "success",
    cancelado:      "error",
  };
  return badges[estado] ?? "default";
};