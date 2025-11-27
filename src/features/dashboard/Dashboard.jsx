// Dashboard principal - Componente contenedor que orquesta todos los subcomponentes
// Responsable de: estado global, estructura de layout y comunicación entre componentes

import React, { useState } from 'react';
import { Box, Grid, useTheme, alpha } from '@mui/material';

// Importaciones de componentes modulares
import {
  DashboardHeader,
  VentasChart,
  AnalisisCategorias,
  ProductosMasVendidos
} from './components';

// Hook personalizado para manejo de datos
import { useDashboardData } from './hooks/useDashboardData';

const Dashboard = () => {
  const theme = useTheme();
  
  // Estados globales del dashboard
  const [timeFilter, setTimeFilter] = useState('dia'); // Controla el período de tiempo (día/mes/año)
  const [yearFilter, setYearFilter] = useState('2024'); // Filtro de año específico
  const [ventasChartType, setVentasChartType] = useState('barras'); // Tipo de gráfica para ventas
  const [comprasChartType, setComprasChartType] = useState('barras'); // Tipo de gráfica para compras

  // Hook que proporciona todos los datos del dashboard basado en los filtros
  const dashboardData = useDashboardData(timeFilter, yearFilter);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.3)} 50%, ${theme.palette.background.default} 100%)`,
      p: 3
    }}>
      
      {/* Header con controles de filtro y métricas resumidas */}
      <DashboardHeader 
        timeFilter={timeFilter}
        yearFilter={yearFilter}
        onTimeFilterChange={setTimeFilter}
        onYearFilterChange={setYearFilter}
        metrics={dashboardData.metricas}
      />

      {/* Layout principal con grid responsivo */}
      <Grid container spacing={3}>
        
        {/* Gráfica de Ventas - Muestra tendencias de ingresos */}
        <Grid item xs={12} lg={6}>
          <VentasChart 
            data={dashboardData.ventas} 
            timeFilter={timeFilter} 
            title="Ventas"
            chartType={ventasChartType}
            onChartTypeChange={setVentasChartType}
            chartKey="ventas" // Identificador único para esta gráfica
          />
        </Grid>

        {/* Gráfica de Compras - Muestra tendencias de gastos */}
        <Grid item xs={12} lg={6}>
          <VentasChart 
            data={dashboardData.compras} 
            timeFilter={timeFilter} 
            title="Compras"
            chartType={comprasChartType}
            onChartTypeChange={setComprasChartType}
            chartKey="compras" // Identificador único para esta gráfica
          />
        </Grid>

        {/* Análisis de Categorías - Distribución por categorías de productos */}
        <Grid item xs={12} lg={8}>
          <AnalisisCategorias 
            data={dashboardData.categorias} 
            timeFilter={timeFilter}
            yearFilter={yearFilter} 
          />
        </Grid>

        {/* Productos Más Vendidos - Ranking de productos por volumen */}
        <Grid item xs={12} lg={4}>
          <ProductosMasVendidos 
            productos={dashboardData.productos} 
            timeFilter={timeFilter} 
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;