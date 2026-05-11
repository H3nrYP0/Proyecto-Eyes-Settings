export const ESTADOS_PEDIDO = [
  { value: "pendiente", label: "Pendiente" },
  { value: "pagado",    label: "Pagado"    },
  { value: "anulado",   label: "Anulado"   },
];

export const METODOS_PAGO    = ["efectivo", "transferencia"];
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