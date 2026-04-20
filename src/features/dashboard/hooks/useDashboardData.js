import { useState, useEffect, useCallback } from 'react';
import api from '@lib/axios';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const toArray = (settled) => {
  if (settled.status !== 'fulfilled') return [];
  const d = settled.value?.data;
  if (!d) return [];
  if (Array.isArray(d)) return d;
  if (Array.isArray(d.data)) return d.data;
  return [];
};

const matchesPeriod = (fechaStr, timeFilter, yearFilter, monthFilter) => {
  if (!fechaStr) return false;
  const d = new Date(fechaStr);
  if (isNaN(d)) return false;
  const now = new Date();

  if (timeFilter === 'dia') {
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }
  if (timeFilter === 'mes') {
    return (
      d.getFullYear() === parseInt(yearFilter) &&
      (d.getMonth() + 1) === parseInt(monthFilter)
    );
  }
  if (timeFilter === 'año') {
    return d.getFullYear() === parseInt(yearFilter);
  }
  return true;
};

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const groupForChart = (items, fechaField, timeFilter) => {
  const groups = {};

  items.forEach((item) => {
    const d = new Date(item[fechaField]);
    if (isNaN(d)) return;

    let key;
    if (timeFilter === 'dia') key = `${d.getHours()}:00`;
    else if (timeFilter === 'mes') key = d.getDate().toString().padStart(2, '0');
    else key = MESES[d.getMonth()];

    groups[key] = (groups[key] || 0) + parseFloat(item.total || 0);
  });

  let sorted;
  if (timeFilter === 'año') {
    sorted = Object.keys(groups).sort((a, b) => MESES.indexOf(a) - MESES.indexOf(b));
  } else {
    sorted = Object.keys(groups).sort((a, b) => parseInt(a) - parseInt(b));
  }

  const data = sorted.map((k) => Math.round(groups[k]));
  return { labels: sorted, data, lineData: data };
};

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1',
  '#14b8a6', '#f43f5e'
];

const buildCategorias = (ventas, prodIdToCat) => {
  const totals = {};

  ventas.forEach((venta) => {
    (venta.detalles || []).forEach((d) => {
      let cat;
      if (d.servicio_id) cat = 'Servicios';
      else if (d.producto_id) cat = prodIdToCat[d.producto_id] || 'Sin categoría';
      else cat = 'Sin categoría';

      if (!totals[cat]) totals[cat] = { amount: 0 };
      totals[cat].amount += parseFloat(d.subtotal || 0);
    });
  });

  const totalAmount = Object.values(totals).reduce((s, v) => s + v.amount, 0) || 1;

  return Object.entries(totals)
    .map(([name, { amount }], i) => ({
      name,
      value: Math.round((amount / totalAmount) * 100 * 10) / 10,
      amount: Math.round(amount),
      color: COLORS[i % COLORS.length]
    }))
    .sort((a, b) => b.amount - a.amount);
};

const buildTopProductos = (ventas) => {
  const totals = {};

  ventas.forEach((venta) => {
    (venta.detalles || []).forEach((d) => {
      const nombre = d.producto_nombre || d.servicio_nombre || 'Desconocido';
      if (!totals[nombre]) totals[nombre] = { quantity: 0 };
      totals[nombre].quantity += parseFloat(d.cantidad || 1);
    });
  });

  const sorted = Object.entries(totals).sort((a, b) => b[1].quantity - a[1].quantity);
  const totalQty = sorted.reduce((s, [, v]) => s + v.quantity, 0) || 1;

  return sorted.slice(0, 10).map(([name, { quantity }], i) => ({
    name,
    quantity: Math.round(quantity),
    percentage: Math.round((quantity / totalQty) * 100),
    top3: i < 3
  }));
};

const extractAvailableYears = (ventas, compras) => {
  const yearsSet = new Set();
  [...ventas, ...compras].forEach((item) => {
    const fecha = item.fecha_venta || item.fecha;
    if (fecha) {
      const y = new Date(fecha).getFullYear();
      if (!isNaN(y)) yearsSet.add(y);
    }
  });
  const sorted = Array.from(yearsSet).sort((a, b) => a - b);
  const currentYear = new Date().getFullYear();
  if (!yearsSet.has(currentYear)) sorted.push(currentYear);
  return sorted.map(String);
};

// ─── Hook principal ──────────────────────────────────────────────────────────

export const useDashboardData = (timeFilter, yearFilter, monthFilter) => {
  const [state, setState] = useState({
    ventasData: { labels: [], data: [], lineData: [] },
    comprasData: { labels: [], data: [], lineData: [] },
    productosData: [],
    categoriasData: [],
    metrics: { clientes: 0, productosVendidos: 0, citasEfectivas: 0 },
    availableYears: [String(new Date().getFullYear())],
    loading: true,
    error: null
  });

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [ventasRes, comprasRes, clientesRes, citasRes, productosRes, categoriasRes] =
        await Promise.allSettled([
          api.get('/ventas'),
          api.get('/compras'),
          api.get('/admin/clientes'), // ✅ Usando endpoint correcto (solo JWT)
          api.get('/citas'),
          api.get('/productos'),
          api.get('/categorias')
        ]);

      const ventas = toArray(ventasRes);
      const compras = toArray(comprasRes);
      const clientes = toArray(clientesRes);
      const citasRaw = toArray(citasRes);
      const productos = toArray(productosRes);
      const categorias = toArray(categoriasRes);

      // ✅ Contar clientes activos (estado === true)
      const clientesActivos = clientes.filter(c => c.estado === true).length;

      // Mapa categoria_id → nombre
      const catIdToNombre = {};
      categorias.forEach((c) => { catIdToNombre[c.id] = c.nombre; });

      // Mapa producto_id → nombre de categoría
      const prodIdToCat = {};
      productos.forEach((p) => {
        prodIdToCat[p.id] = catIdToNombre[p.categoria_id] || 'Sin categoría';
      });

      // Años disponibles
      const availableYears = extractAvailableYears(ventas, compras);

      // Filtrar por período
      const filteredVentas = ventas.filter((v) => matchesPeriod(v.fecha_venta, timeFilter, yearFilter, monthFilter));
      const filteredCompras = compras.filter((c) => matchesPeriod(c.fecha, timeFilter, yearFilter, monthFilter));

      // Citas del período: solo confirmadas o completadas
      const ESTADOS_VALIDOS = ['confirmada', 'completada'];
      const filteredCitas = citasRaw.filter((c) => {
        const enPeriodo = matchesPeriod(c.fecha, timeFilter, yearFilter, monthFilter);
        const nombreEstado = (c.estado_nombre || c.estado_cita_nombre || '').toLowerCase();
        return enPeriodo && ESTADOS_VALIDOS.includes(nombreEstado);
      });

      // Gráficas
      const ventasChart = groupForChart(filteredVentas, 'fecha_venta', timeFilter);
      const comprasChart = groupForChart(filteredCompras, 'fecha', timeFilter);

      // Categorías y top productos
      const categoriasData = buildCategorias(filteredVentas, prodIdToCat);
      const productosData = buildTopProductos(filteredVentas);

      // Productos vendidos
      const productosVendidos = filteredVentas.reduce(
        (sum, v) => sum + (v.detalles || []).reduce((s, d) => s + parseFloat(d.cantidad || 0), 0), 0
      );

      setState({
        ventasData: ventasChart,
        comprasData: comprasChart,
        productosData,
        categoriasData,
        availableYears,
        metrics: {
          clientes: clientesActivos,
          productosVendidos: Math.round(productosVendidos),
          citasEfectivas: filteredCitas.length
        },
        loading: false,
        error: null
      });

    } catch (err) {
      console.error('Error cargando dashboard:', err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Error al cargar los datos. Por favor, intenta nuevamente.'
      }));
    }
  }, [timeFilter, yearFilter, monthFilter]);

  useEffect(() => {
    load();
  }, [load]);

  return state;
};