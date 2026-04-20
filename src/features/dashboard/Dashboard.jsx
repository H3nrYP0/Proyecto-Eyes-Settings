import React, { useState } from 'react';
import {
  Box,
  Grid,
  useTheme,
  alpha,
  useMediaQuery,
  Container,
  CircularProgress,
  Alert
} from '@mui/material';

import {
  DashboardHeader,
  VentasChart,
  AnalisisCategorias,
  ProductosMasVendidos
} from './components';

import { useDashboardData } from './hooks/useDashboardData';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile  = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet  = useMediaQuery(theme.breakpoints.between('sm', 'lg'));

  const [timeFilter,  setTimeFilter]  = useState('dia');
  const [yearFilter,  setYearFilter]  = useState(new Date().getFullYear().toString());
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
  const [ventasChartType,  setVentasChartType]  = useState('barras');
  const [comprasChartType, setComprasChartType] = useState('barras');

  const {
    ventasData,
    comprasData,
    productosData,
    categoriasData,
    metrics,
    availableYears,
    loading,
    error
  } = useDashboardData(timeFilter, yearFilter, monthFilter);

  const gridSpacing = isMobile ? 2 : isTablet ? 2.5 : 3;
  const padding     = isMobile ? 1.5 : isTablet ? 2 : 3;

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      p: padding,
      mt: { xs: 7, sm: 8, md: 0 },
      ml: 0,
      position: 'relative',
      zIndex: 1
    }}>
      <Container maxWidth="xl" sx={{ px: isMobile ? 1 : 2, width: '100%' }}>

        {error && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <DashboardHeader
          timeFilter={timeFilter}
          yearFilter={yearFilter}
          monthFilter={monthFilter}
          onTimeFilterChange={setTimeFilter}
          onYearFilterChange={setYearFilter}
          onMonthFilterChange={(m) => setMonthFilter(parseInt(m))}
          metrics={metrics}
          availableYears={availableYears}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
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
                data={categoriasData}
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
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;