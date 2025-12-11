// utils/mockData.js
/**
 * Genera horas del día (7am - 6pm)
 */
export const generateHours = () => {
  const hours = [];
  for (let i = 7; i <= 18; i++) {
    hours.push(`${i}:00`);
  }
  return hours;
};

/**
 * Genera días del mes (1-30)
 */
export const generateDays = () => {
  const days = [];
  for (let i = 1; i <= 30; i++) {
    days.push(`${i.toString().padStart(2, '0')}/09`);
  }
  return days;
};

/**
 * Genera meses del año
 */
export const generateMonths = () => {
  return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
};

/**
 * Obtiene datos específicos por año
 */
export const getYearData = (year) => {
  const baseData = {
    '2022': {
      ventas: [800000, 1500000, 2200000, 2800000, 3500000, 4200000, 5000000, 4500000, 3800000, 3200000, 2800000, 3300000],
      compras: [2500000, 4800000, 7200000, 9500000, 8800000, 8200000, 7800000, 7400000, 7000000, 6600000, 6200000, 5800000]
    },
    '2023': {
      ventas: [900000, 1800000, 2700000, 3600000, 4500000, 5400000, 6300000, 5800000, 5000000, 4200000, 3500000, 4000000],
      compras: [2800000, 5500000, 8200000, 10800000, 9900000, 9200000, 8600000, 8200000, 7800000, 7300000, 6800000, 6400000]
    },
    '2024': {
      ventas: [1000000, 2000000, 3000000, 4000000, 5000000, 6000000, 7000000, 6500000, 5500000, 4500000, 3500000, 4000000],
      compras: [3000000, 6000000, 9000000, 12000000, 11000000, 10000000, 9500000, 9000000, 8500000, 8000000, 7500000, 7000000]
    },
    '2025': {
      ventas: [1200000, 2400000, 3600000, 4800000, 6000000, 7200000, 8400000, 7800000, 6600000, 5400000, 4200000, 4800000],
      compras: [3600000, 7200000, 10800000, 14400000, 13200000, 12000000, 11400000, 10800000, 10200000, 9600000, 9000000, 8400000]
    }
  };
  return baseData[year] || baseData['2024'];
};

/**
 * Obtiene datos específicos por mes del año
 */
export const getMonthData = (year, month) => {
  // Datos de días del mes (30 días)
  const monthDays = Array.from({length: 30}, (_, i) => i + 1);
  
  // Datos base para cada año
  const yearData = getYearData(year);
  
  // Genera datos diarios basados en el total mensual
  const totalVentasMes = yearData.ventas[month - 1] || 4000000;
  const totalComprasMes = yearData.compras[month - 1] || 12000000;
  
  // Simula distribución diaria con variación
  const ventasDiarias = monthDays.map((day, index) => {
    const isPeakDay = day % 10 === 5;
    const baseValue = totalVentasMes / 30;
    const variation = isPeakDay ? 1.4 : 0.8 + (Math.sin(day * 0.2) * 0.4);
    return Math.round(baseValue * variation);
  });
  
  const comprasDiarias = monthDays.map((day, index) => {
    const isStartOfMonth = day <= 10;
    const baseValue = totalComprasMes / 30;
    const variation = isStartOfMonth ? 1.3 : 0.9 + (Math.cos(day * 0.15) * 0.2);
    return Math.round(baseValue * variation);
  });
  
  return {
    labels: monthDays.map(day => `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}`),
    ventas: ventasDiarias,
    compras: comprasDiarias
  };
};

/**
 * Obtiene métricas operativas por año
 */
export const getMetricasPorAño = (year) => {
  const metricas = {
    '2022': {
      clientes: 132,
      productosVendidos: 1200,
      citasEfectivas: 95
    },
    '2023': {
      clientes: 144,
      productosVendidos: 1380,
      citasEfectivas: 115
    },
    '2024': {
      clientes: 156,
      productosVendidos: 1536,
      citasEfectivas: 128
    },
    '2025': {
      clientes: 175,
      productosVendidos: 1720,
      citasEfectivas: 145
    }
  };
  return metricas[year] || metricas['2024'];
};

/**
 * Obtiene métricas operativas por mes
 */
export const getMetricasPorMes = (year, month) => {
  const metricasAnuales = getMetricasPorAño(year);
  
  // Factores mensuales
  const factoresMensuales = {
    1: 0.85, 2: 0.80, 3: 0.90, 4: 1.00, 5: 1.10, 6: 1.25,
    7: 1.40, 8: 1.35, 9: 1.60, 10: 1.20, 11: 0.95, 12: 1.30
  };
  
  const factorMes = factoresMensuales[month] || 1.0;
  
  return {
    clientes: Math.round(metricasAnuales.clientes / 12 * factorMes),
    productosVendidos: Math.round(metricasAnuales.productosVendidos / 12 * factorMes),
    citasEfectivas: Math.round(metricasAnuales.citasEfectivas / 12 * factorMes)
  };
};

/**
 * Datos completos de productos
 */
export const productosCompletos = {
  dia: [
    { name: "Lentes de Contacto Acuwe", percentage: 35, quantity: 42, top3: true },
    { name: "Montura Ray-Ban Aviator", percentage: 22, quantity: 28, top3: true },
    { name: "Gafas de Sol Oakley", percentage: 18, quantity: 22, top3: true },
    { name: "Lentes Progresivos Essilor", percentage: 12, quantity: 15 },
    { name: "Estuches Premium", percentage: 8, quantity: 10 },
    { name: "Lentes Transition", percentage: 7, quantity: 8 },
    { name: "Montura Gucci", percentage: 6, quantity: 7 },
    { name: "Gafas de Sol Prada", percentage: 5, quantity: 6 },
    { name: "Lentes Anti-reflejo", percentage: 4, quantity: 5 },
    { name: "Accesorios Limpieza", percentage: 3, quantity: 4 }
  ],
  mes: (year, month) => {
    const factoresMes = {
      1: 0.8, 2: 0.7, 3: 0.9, 4: 1.0, 5: 1.1, 6: 1.3,
      7: 1.5, 8: 1.4, 9: 1.6, 10: 1.2, 11: 1.0, 12: 0.9
    };
    
    const factor = factoresMes[month] || 1.0;
    const yearIndex = parseInt(year) - 2022;
    const yearFactor = 1 + (yearIndex * 0.1);
    
    const baseProducts = [
      { name: "Lentes de Contacto Acuwe", percentage: 27, quantity: 125, top3: true },
      { name: "Montura Ray-Ban Aviator", percentage: 18, quantity: 85, top3: true },
      { name: "Gafas de Sol Oakley", percentage: 15, quantity: 72, top3: true },
      { name: "Lentes Progresivos Essilor", percentage: 12, quantity: 58 },
      { name: "Estuches Premium", percentage: 8, quantity: 38 },
      { name: "Lentes Transition", percentage: 7, quantity: 32 },
      { name: "Montura Gucci", percentage: 6, quantity: 28 },
      { name: "Gafas de Sol Prada", percentage: 5, quantity: 24 },
      { name: "Lentes Anti-reflejo", percentage: 4, quantity: 19 },
      { name: "Accesorios Limpieza", percentage: 3, quantity: 14 }
    ];
    
    return baseProducts.map(producto => ({
      ...producto,
      quantity: Math.round(producto.quantity * factor * yearFactor)
    }));
  },
  año: {
    '2022': [
      { name: "Lentes de Contacto Acuwe", percentage: 22, quantity: 264, top3: true },
      { name: "Montura Ray-Ban Aviator", percentage: 18, quantity: 216, top3: true },
      { name: "Gafas de Sol Oakley", percentage: 15, quantity: 180, top3: true },
      { name: "Lentes Progresivos Essilor", percentage: 12, quantity: 144 },
      { name: "Estuches Premium", percentage: 8, quantity: 96 },
      { name: "Lentes Transition", percentage: 7, quantity: 84 },
      { name: "Montura Gucci", percentage: 6, quantity: 72 },
      { name: "Gafas de Sol Prada", percentage: 5, quantity: 60 },
      { name: "Lentes Anti-reflejo", percentage: 4, quantity: 48 },
      { name: "Accesorios Limpieza", percentage: 3, quantity: 36 }
    ],
    '2023': [
      { name: "Lentes de Contacto Acuwe", percentage: 24, quantity: 331, top3: true },
      { name: "Montura Ray-Ban Aviator", percentage: 19, quantity: 262, top3: true },
      { name: "Gafas de Sol Oakley", percentage: 15, quantity: 207, top3: true },
      { name: "Lentes Progresivos Essilor", percentage: 12, quantity: 166 },
      { name: "Estuches Premium", percentage: 8, quantity: 110 },
      { name: "Lentes Transition", percentage: 7, quantity: 96 },
      { name: "Montura Gucci", percentage: 6, quantity: 83 },
      { name: "Gafas de Sol Prada", percentage: 5, quantity: 69 },
      { name: "Lentes Anti-reflejo", percentage: 4, quantity: 55 },
      { name: "Accesorios Limpieza", percentage: 3, quantity: 41 }
    ],
    '2024': [
      { name: "Lentes de Contacto Acuwe", percentage: 25, quantity: 384, top3: true },
      { name: "Montura Ray-Ban Aviator", percentage: 20, quantity: 307, top3: true },
      { name: "Gafas de Sol Oakley", percentage: 15, quantity: 230, top3: true },
      { name: "Lentes Progresivos Essilor", percentage: 12, quantity: 184 },
      { name: "Estuches Premium", percentage: 8, quantity: 123 },
      { name: "Lentes Transition", percentage: 7, quantity: 107 },
      { name: "Montura Gucci", percentage: 6, quantity: 92 },
      { name: "Gafas de Sol Prada", percentage: 5, quantity: 77 },
      { name: "Lentes Anti-reflejo", percentage: 4, quantity: 61 },
      { name: "Accesorios Limpieza", percentage: 3, quantity: 46 }
    ],
    '2025': [
      { name: "Lentes de Contacto Acuwe", percentage: 25, quantity: 430, top3: true },
      { name: "Montura Ray-Ban Aviator", percentage: 20, quantity: 344, top3: true },
      { name: "Gafas de Sol Oakley", percentage: 15, quantity: 258, top3: true },
      { name: "Lentes Progresivos Essilor", percentage: 12, quantity: 206 },
      { name: "Estuches Premium", percentage: 8, quantity: 138 },
      { name: "Lentes Transition", percentage: 7, quantity: 120 },
      { name: "Montura Gucci", percentage: 6, quantity: 103 },
      { name: "Gafas de Sol Prada", percentage: 5, quantity: 86 },
      { name: "Lentes Anti-reflejo", percentage: 4, quantity: 69 },
      { name: "Accesorios Limpieza", percentage: 3, quantity: 52 }
    ]
  }
};

/**
 * Datos para análisis de categorías
 */
export const categoriasData = {
  dia: [
    { name: "Lentes de Contacto", value: 35, amount: 42000, color: '#8884d8' },
    { name: "Monturas", value: 28, amount: 33600, color: '#82ca9d' },
    { name: "Gafas de Sol", value: 22, amount: 26400, color: '#ffc658' },
    { name: "Lentes Progresivos", value: 15, amount: 18000, color: '#0088FE' },
    { name: "Accesorios", value: 10, amount: 12000, color: '#00C49F' },
    { name: "Lentes Transition", value: 8, amount: 9600, color: '#FFBB28' },
    { name: "Lentes Anti-reflejo", value: 6, amount: 7200, color: '#FF8042' },
    { name: "Servicios de Ajuste", value: 5, amount: 6000, color: '#A28DFF' }
  ],
  mes: (year, month) => {
    const factoresMes = {
      1: 0.8, 2: 0.7, 3: 0.9, 4: 1.0, 5: 1.1, 6: 1.3,
      7: 1.5, 8: 1.4, 9: 1.6, 10: 1.2, 11: 1.0, 12: 0.9
    };
    
    const factor = factoresMes[month] || 1.0;
    const yearIndex = parseInt(year) - 2022;
    const yearFactor = 1 + (yearIndex * 0.1);
    
    const baseCategorias = [
      { name: "Lentes de Contacto", value: 32, amount: 384000, color: '#8884d8' },
      { name: "Monturas", value: 25, amount: 300000, color: '#82ca9d' },
      { name: "Gafas de Sol", value: 20, amount: 240000, color: '#ffc658' },
      { name: "Lentes Progresivos", value: 18, amount: 216000, color: '#0088FE' },
      { name: "Accesorios", value: 12, amount: 144000, color: '#00C49F' },
      { name: "Lentes Transition", value: 10, amount: 120000, color: '#FFBB28' },
      { name: "Lentes Anti-reflejo", value: 8, amount: 96000, color: '#FF8042' },
      { name: "Servicios de Ajuste", value: 5, amount: 60000, color: '#A28DFF' },
      { name: "Reparaciones", value: 4, amount: 48000, color: '#FF6B6B' },
      { name: "Filtros Blue Light", value: 3, amount: 36000, color: '#4ECDC4' },
      { name: "Estuches", value: 2, amount: 24000, color: '#FF9F1C' },
      { name: "Líquidos de Limpieza", value: 1, amount: 12000, color: '#2A9D8F' }
    ];
    
    return baseCategorias.map(cat => ({
      ...cat,
      amount: Math.round(cat.amount * factor * yearFactor),
      value: Math.round(cat.value * factor * (1 + yearIndex * 0.05))
    }));
  },
  año: (year) => {
    const yearIndex = parseInt(year) - 2022;
    const factor = 1 + (yearIndex * 0.15);
    
    return [
      { name: "Lentes de Contacto", value: Math.round(30 * factor), amount: Math.round(4608000 * factor), color: '#8884d8' },
      { name: "Monturas", value: Math.round(24 * factor), amount: Math.round(3686400 * factor), color: '#82ca9d' },
      { name: "Gafas de Sol", value: Math.round(19 * factor), amount: Math.round(2764800 * factor), color: '#ffc658' },
      { name: "Lentes Progresivos", value: Math.round(17 * factor), amount: Math.round(2211840 * factor), color: '#0088FE' },
      { name: "Accesorios", value: Math.round(11 * factor), amount: Math.round(1658880 * factor), color: '#00C49F' },
      { name: "Lentes Transition", value: Math.round(9 * factor), amount: Math.round(1382400 * factor), color: '#FFBB28' },
      { name: "Lentes Anti-reflejo", value: Math.round(7 * factor), amount: Math.round(1105920 * factor), color: '#FF8042' },
      { name: "Servicios de Ajuste", value: Math.round(5 * factor), amount: Math.round(921600 * factor), color: '#A28DFF' },
      { name: "Reparaciones", value: Math.round(4 * factor), amount: Math.round(737280 * factor), color: '#FF6B6B' },
      { name: "Filtros Blue Light", value: Math.round(3 * factor), amount: Math.round(552960 * factor), color: '#4ECDC4' },
      { name: "Estuches", value: Math.round(2 * factor), amount: Math.round(368640 * factor), color: '#FF9F1C' },
      { name: "Líquidos de Limpieza", value: Math.round(1 * factor), amount: Math.round(184320 * factor), color: '#2A9D8F' }
    ];
  }
};