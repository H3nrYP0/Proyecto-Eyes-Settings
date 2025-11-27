// Generadores de datos mock para el dashboard

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
    days.push(`${i}/09`);
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
  mes: [
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
  ],
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