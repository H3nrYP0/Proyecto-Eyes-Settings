// Hook personalizado para manejar los datos del dashboard
// Responsable de: generar datos mock, filtrar por período, manejar cache de datos

import { useMemo } from 'react';
import { 
  generateHours, 
  generateDays, 
  generateMonths, 
  getYearData, 
  productosCompletos,
  getMetricasPorAño
} from '../utils/dataGenerators';

export const useDashboardData = (timeFilter, yearFilter = '2024') => {
  return useMemo(() => {
    // Obtiene datos específicos del año seleccionado
    const yearData = getYearData(yearFilter);
    const metricasAnuales = getMetricasPorAño(yearFilter);

    // Mapa de datos organizado por período de tiempo
    const dataMap = {
      dia: {
        ventas: {
          labels: generateHours(), // Horas del día (7am - 6pm)
          data: [150, 280, 420, 380, 320, 450, 520, 480, 550, 520, 480, 420].map(val => val * 1000),
          lineData: [140, 270, 410, 370, 310, 440, 510, 470, 540, 510, 470, 410].map(val => val * 1000)
        },
        compras: {
          labels: generateHours(),
          data: [2000, 3500, 5000, 4500, 4000, 5500, 6000, 5800, 6200, 5900, 5400, 4800].map(val => val * 1000),
          lineData: [1900, 3400, 4900, 4400, 3900, 5400, 5900, 5700, 6100, 5800, 5300, 4700].map(val => val * 1000)
        },
        categorias: [
          { name: "Lentes", value: 35, amount: 1250, color: '#3b82f6' },
          { name: "Monturas", value: 25, amount: 890, color: '#10b981' },
          { name: "Sol", value: 20, amount: 540, color: '#f59e0b' },
          { name: "Contacto", value: 15, amount: 380, color: '#ef4444' },
          { name: "Accesorios", value: 5, amount: 120, color: '#8b5cf6' }
        ],
        productos: productosCompletos.dia, // Top productos del día
        metricas: {
          clientes: 12,       // Número de clientes atendidos
          productosVendidos: 97, // Total de productos vendidos
          citasEfectivas: 8   // Citas completadas exitosamente
        }
      },
      mes: {
        // ... estructura similar para datos mensuales
        ventas: {
          labels: generateDays(), // Días del mes (1-30)
          data: Array.from({length: 30}, (_, i) => {
            const base = 100000;
            const variation = Math.sin(i / 5) * 200000; // Variación sinusoidal para datos realistas
            const random = Math.random() * 100000; // Ruido aleatorio
            return Math.floor(base + variation + random);
          }),
          lineData: Array.from({length: 30}, (_, i) => {
            const base = 80000;
            const variation = Math.sin(i / 5) * 180000;
            const random = Math.random() * 80000;
            return Math.floor(base + variation + random);
          })
        },
        compras: {
          labels: generateDays(),
          data: Array.from({length: 30}, (_, i) => {
            const base = 2000000;
            const variation = Math.sin(i / 5) * 1000000;
            const random = Math.random() * 500000;
            return Math.floor(base + variation + random);
          }),
          lineData: Array.from({length: 30}, (_, i) => {
            const base = 1800000;
            const variation = Math.sin(i / 5) * 900000;
            const random = Math.random() * 400000;
            return Math.floor(base + variation + random);
          })
        },
        categorias: [
          { name: "Lentes", value: 40, amount: 14800, color: '#3b82f6' },
          { name: "Monturas", value: 30, amount: 11200, color: '#10b981' },
          { name: "Sol", value: 15, amount: 5600, color: '#f59e0b' },
          { name: "Contacto", value: 10, amount: 3750, color: '#ef4444' },
          { name: "Accesorios", value: 5, amount: 1250, color: '#8b5cf6' }
        ],
        productos: productosCompletos.mes,
        metricas: {
          clientes: 47,
          productosVendidos: 378,
          citasEfectivas: 25
        }
      },
        año: {
        ventas: {
            labels: generateMonths(),
            data: yearData.ventas,
            lineData: yearData.ventas.map(val => val * 0.9)
        },
        compras: {
            labels: generateMonths(),
            data: yearData.compras,
            lineData: yearData.compras.map(val => val * 0.9)
        },
        categorias: [
            { name: "Lentes", value: 45, amount: 168000, color: '#3b82f6' },
            { name: "Monturas", value: 25, amount: 93500, color: '#10b981' },
            { name: "Sol", value: 15, amount: 56100, color: '#f59e0b' },
            { name: "Contacto", value: 10, amount: 37400, color: '#ef4444' },
            { name: "Accesorios", value: 5, amount: 18700, color: '#8b5cf6' }
        ],
        productos: productosCompletos.año[yearFilter] || productosCompletos.año['2024'],
        metricas: metricasAnuales
        }
    };

    // Retorna datos del período seleccionado o datos diarios por defecto
    return dataMap[timeFilter] || dataMap.dia;
  }, [timeFilter, yearFilter]); // Recalcula cuando cambian los filtros
};