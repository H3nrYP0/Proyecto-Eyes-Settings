// Espejo de rolFilters.js — adaptado al dominio de Compras

export const filtrarCompras = (compras, { search = '', estado = '' } = {}) => {
  if (!Array.isArray(compras)) return [];

  const term = (search || '').toString().toLowerCase();

  return compras.filter((compra) => {
    const matchSearch =
      (compra.proveedorNombre || '').toLowerCase().includes(term) ||
      (compra.numeroCompra    || '').toLowerCase().includes(term) ||
      (compra.observaciones   || '').toLowerCase().includes(term) ||
      String(compra.total     || 0).includes(term);

    const matchEstado = !estado || compra.estado === estado;

    return matchSearch && matchEstado;
  });
};