// Dashboard principal - Componente contenedor que orquesta todos los subcomponentes
// Responsable de: estado global, estructura de layout y comunicación entre componentes

import React, { useState, useEffect } from 'react';
import { Box, Grid, useTheme, alpha } from '@mui/material';

// Importaciones de componentes modulares
import {
  DashboardHeader,
  VentasChart,
  AnalisisCategorias,
  ProductosMasVendidos
} from './components';

// Importar datos mock actualizados
import {
  getYearData,
  getMonthData,
  getMetricasPorAño,
  getMetricasPorMes,
  productosCompletos,
  categoriasData,
  generateHours,
  generateDays,
  generateMonths
} from './utils/dataGenerators';

const Dashboard = () => {
  const theme = useTheme();
  
  // Estados globales del dashboard
  const [timeFilter, setTimeFilter] = useState('dia');
  const [yearFilter, setYearFilter] = useState('2024');
  const [monthFilter, setMonthFilter] = useState(9);
  const [ventasChartType, setVentasChartType] = useState('barras');
  const [comprasChartType, setComprasChartType] = useState('barras');
  
  // Estados para datos
  const [ventasData, setVentasData] = useState({});
  const [comprasData, setComprasData] = useState({});
  const [productosData, setProductosData] = useState([]);
  const [categoriasDataState, setCategoriasData] = useState([]);
  const [metrics, setMetrics] = useState({
    clientes: 0,
    productosVendidos: 0,
    citasEfectivas: 0
  });

  // Efecto para cargar datos cuando cambian los filtros
  useEffect(() => {
    loadData();
  }, [timeFilter, yearFilter, monthFilter]);

  // Función para cargar datos según los filtros
  const loadData = () => {
    switch (timeFilter) {
      case 'dia':
        // Datos para vista diaria
        const hours = generateHours();
        const ventasDiarias = Array.from({length: 12}, () => Math.floor(Math.random() * 10000) + 5000);
        
        setVentasData({
          labels: hours,
          data: ventasDiarias,
          lineData: ventasDiarias
        });
        
        setComprasData({
          labels: hours,
          data: Array.from({length: 12}, () => Math.floor(Math.random() * 15000) + 8000),
          lineData: Array.from({length: 12}, () => Math.floor(Math.random() * 15000) + 8000)
        });
        
        setProductosData(productosCompletos.dia);
        setCategoriasData(categoriasData.dia);
        setMetrics({
          clientes: 42,
          productosVendidos: 156,
          citasEfectivas: 28
        });
        break;
        
      case 'mes':
        // Datos para vista mensual con mes específico
        const monthData = getMonthData(yearFilter, monthFilter);
        
        setVentasData({
          labels: monthData.labels,
          data: monthData.ventas,
          lineData: monthData.ventas
        });
        
        setComprasData({
          labels: monthData.labels,
          data: monthData.compras,
          lineData: monthData.compras
        });
        
        // Obtener productos para el mes específico
        const productosMes = typeof productosCompletos.mes === 'function' 
          ? productosCompletos.mes(yearFilter, monthFilter)
          : productosCompletos.mes || [];
        setProductosData(productosMes);
        
        // Obtener categorías para el mes específico
        const categoriasMes = typeof categoriasData.mes === 'function'
          ? categoriasData.mes(yearFilter, monthFilter)
          : categoriasData.mes || [];
        setCategoriasData(categoriasMes);
        
        setMetrics(getMetricasPorMes(yearFilter, monthFilter));
        break;
        
      case 'año':
        // Datos para vista anual
        const yearData = getYearData(yearFilter);
        const months = generateMonths();
        
        setVentasData({
          labels: months,
          data: yearData.ventas,
          lineData: yearData.ventas
        });
        
        setComprasData({
          labels: months,
          data: yearData.compras,
          lineData: yearData.compras
        });
        
        setProductosData(productosCompletos.año[yearFilter] || productosCompletos.año['2024'] || []);
        
        // Obtener categorías para el año específico
        const categoriasAno = typeof categoriasData.año === 'function'
          ? categoriasData.año(yearFilter)
          : (categoriasData.año || []);
        setCategoriasData(categoriasAno);
        
        setMetrics(getMetricasPorAño(yearFilter));
        break;
        
      default:
        // Datos por defecto (diario)
        const defaultHours = generateHours();
        const defaultVentas = Array.from({length: 12}, () => Math.floor(Math.random() * 10000) + 5000);
        
        setVentasData({
          labels: defaultHours,
          data: defaultVentas,
          lineData: defaultVentas
        });
        
        setProductosData(productosCompletos.dia || []);
        setCategoriasData(categoriasData.dia || []);
        setMetrics({
          clientes: 42,
          productosVendidos: 156,
          citasEfectivas: 28
        });
        break;
    }
  };

  // Manejador para cambio de filtro de tiempo
  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
  };

  // Manejador para cambio de año
  const handleYearFilterChange = (year) => {
    setYearFilter(year);
  };

  // Nuevo manejador para cambio de mes
  const handleMonthFilterChange = (month) => {
    setMonthFilter(parseInt(month));
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.3)} 50%, ${theme.palette.background.default} 100%)`,
      p: 3
    }}>
      
      {/* Header con controles de filtro y métricas resumidas - Actualizado con monthFilter */}
      <DashboardHeader 
        timeFilter={timeFilter}
        yearFilter={yearFilter}
        monthFilter={monthFilter}
        onTimeFilterChange={handleTimeFilterChange}
        onYearFilterChange={handleYearFilterChange}
        onMonthFilterChange={handleMonthFilterChange}
        metrics={metrics}
      />

      {/* Layout principal con grid responsivo */}
      <Grid container spacing={3}>
        
        {/* Gráfica de Ventas - Muestra tendencias de ingresos */}
        <Grid item xs={12} lg={6}>
          <VentasChart 
            data={ventasData} 
            timeFilter={timeFilter} 
            title="Ventas"
            chartType={ventasChartType}
            onChartTypeChange={setVentasChartType}
            chartKey="ventas"
          />
        </Grid>

        {/* Gráfica de Compras - Muestra tendencias de gastos */}
        <Grid item xs={12} lg={6}>
          <VentasChart 
            data={comprasData} 
            timeFilter={timeFilter} 
            title="Compras"
            chartType={comprasChartType}
            onChartTypeChange={setComprasChartType}
            chartKey="compras"
          />
        </Grid>

        {/* Análisis de Categorías (Categorías Más Vendidas) */}
        <Grid item xs={12} lg={8}>
          <AnalisisCategorias 
            data={categoriasDataState} 
            timeFilter={timeFilter}
            yearFilter={yearFilter} 
          />
        </Grid>

        {/* Productos Más Vendidos - Ranking de productos por volumen */}
        <Grid item xs={12} lg={4}>
          <ProductosMasVendidos 
            productos={productosData} 
            timeFilter={timeFilter}
            yearFilter={yearFilter}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;