// Dashboard principal - Componente contenedor
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  useTheme,
  alpha,
  useMediaQuery,
  Container
} from '@mui/material';

// Importaciones de componentes
import {
  DashboardHeader,
  VentasChart,
  AnalisisCategorias,
  ProductosMasVendidos
} from './components';

// Importar datos
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  
  // Estados
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

  useEffect(() => {
    loadData();
  }, [timeFilter, yearFilter, monthFilter]);

  const loadData = () => {
    switch (timeFilter) {
      case 'dia':
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
        
        const productosMes = typeof productosCompletos.mes === 'function' 
          ? productosCompletos.mes(yearFilter, monthFilter)
          : productosCompletos.mes || [];
        setProductosData(productosMes);
        
        const categoriasMes = typeof categoriasData.mes === 'function'
          ? categoriasData.mes(yearFilter, monthFilter)
          : categoriasData.mes || [];
        setCategoriasData(categoriasMes);
        
        setMetrics(getMetricasPorMes(yearFilter, monthFilter));
        break;
        
      case 'año':
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
        
        const categoriasAno = typeof categoriasData.año === 'function'
          ? categoriasData.año(yearFilter)
          : (categoriasData.año || []);
        setCategoriasData(categoriasAno);
        
        setMetrics(getMetricasPorAño(yearFilter));
        break;
        
      default:
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

  const handleTimeFilterChange = (filter) => setTimeFilter(filter);
  const handleYearFilterChange = (year) => setYearFilter(year);
  const handleMonthFilterChange = (month) => setMonthFilter(parseInt(month));

  // Configuración responsive
  const gridSpacing = isMobile ? 2 : isTablet ? 2.5 : 3;
  const padding = isMobile ? 1.5 : isTablet ? 2 : 3;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.background.default, 0.3)} 50%, ${theme.palette.background.default} 100%)`,
      p: padding,
      // 👇 **SOLUCIÓN PRINCIPAL** - Margen superior para navbar fijo
      mt: { xs: 7, sm: 8, md: 0 }, // 7 = 56px (móvil), 8 = 64px (tablet/desktop)
      ml: 0,
      position: 'relative',
      zIndex: 1
    }}>
      <Container maxWidth="xl" sx={{ 
        px: isMobile ? 1 : 2,
        width: '100%'
      }}>
        <DashboardHeader 
          timeFilter={timeFilter}
          yearFilter={yearFilter}
          monthFilter={monthFilter}
          onTimeFilterChange={handleTimeFilterChange}
          onYearFilterChange={handleYearFilterChange}
          onMonthFilterChange={handleMonthFilterChange}
          metrics={metrics}
        />

        <Grid container spacing={gridSpacing}>
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

          <Grid item xs={12} md={8} lg={8}>
            <AnalisisCategorias 
              data={categoriasDataState} 
              timeFilter={timeFilter}
              yearFilter={yearFilter} 
            />
          </Grid>

          <Grid item xs={12} md={4} lg={4}>
            <ProductosMasVendidos 
              productos={productosData} 
              timeFilter={timeFilter}
              yearFilter={yearFilter}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;