// features/dashboard/components/Filters/DashboardHeader.jsx
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  ButtonGroup,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  useMediaQuery
} from '@mui/material';
import { CalendarToday, TrendingUp } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const DashboardHeader = ({ 
  timeFilter, 
  yearFilter, 
  monthFilter,
  onTimeFilterChange, 
  onYearFilterChange,
  onMonthFilterChange,
  metrics 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Meses abreviados para móvil
  const months = isMobile 
    ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
    : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Textos de botones responsivos
  const getButtonText = (text) => {
    if (isMobile) {
      const shortTexts = { 'dia': 'Hoy', 'mes': 'Mes', 'año': 'Año' };
      return shortTexts[text] || text.charAt(0).toUpperCase();
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <Box sx={{ mb: isMobile ? 2 : 3 }}>
      <Grid container spacing={isMobile ? 1.5 : 2} alignItems="center">
        
        {/* Sección izquierda: Título y filtros */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: isMobile ? 1 : 2 }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"}
              fontWeight="bold"
              sx={{ 
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontSize: isMobile ? '1.25rem' : isTablet ? '1.75rem' : '2.125rem'
              }}
            >
              {isMobile ? 'Dashboard' : 'Resumen Operativo'}
            </Typography>
          </Box>
          
          {/* Filtros responsivos */}
          <Stack 
            direction={isMobile ? "column" : "row"} 
            spacing={isMobile ? 1 : 1.5} 
            alignItems={isMobile ? "stretch" : "center"}
            sx={{ flexWrap: 'wrap' }}
          >
            <ButtonGroup 
              variant="outlined" 
              size={isMobile ? "small" : "medium"}
              fullWidth={isMobile}
            >
              {['dia', 'mes', 'año'].map((filter) => (
                <Button 
                  key={filter}
                  onClick={() => onTimeFilterChange(filter)}
                  variant={timeFilter === filter ? 'contained' : 'outlined'}
                  startIcon={isMobile ? null : <CalendarToday />}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    flex: 1,
                    minWidth: isMobile ? '60px' : '80px'
                  }}
                >
                  {getButtonText(filter)}
                </Button>
              ))}
            </ButtonGroup>
            
            {/* Selector de mes */}
            {timeFilter === 'mes' && (
              <FormControl size={isMobile ? "small" : "medium"} sx={{ minWidth: isMobile ? '100%' : 120 }}>
                <InputLabel>Mes</InputLabel>
                <Select
                  value={monthFilter}
                  label="Mes"
                  onChange={(e) => onMonthFilterChange(e.target.value)}
                >
                  {months.map((month, index) => (
                    <MenuItem key={index} value={index + 1}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            
            {/* Selector de año */}
            {(timeFilter === 'año' || timeFilter === 'mes') && (
              <FormControl size={isMobile ? "small" : "medium"} sx={{ minWidth: isMobile ? '100%' : 120 }}>
                <InputLabel>Año</InputLabel>
                <Select
                  value={yearFilter}
                  label="Año"
                  onChange={(e) => onYearFilterChange(e.target.value)}
                >
                  {['2022', '2023', '2024', '2025'].map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Stack>
        </Grid>

        {/* Métricas */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', boxShadow: isMobile ? 1 : 2 }}>
            <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Typography 
                variant={isMobile ? "caption" : "subtitle2"} 
                fontWeight={600} 
                gutterBottom
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  fontSize: isMobile ? '0.75rem' : '0.875rem'
                }}
              >
                <TrendingUp fontSize={isMobile ? "small" : "medium"} />
                {isMobile ? 'Métricas' : 'Métricas operativas'}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                {[
                  { label: 'Clientes', value: metrics.clientes, color: 'primary' },
                  { label: 'Productos', value: metrics.productosVendidos, color: 'secondary' },
                  { label: 'Citas', value: metrics.citasEfectivas, color: 'success.main' }
                ].map((item, index) => (
                  <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography 
                      variant={isMobile ? "body1" : "h6"} 
                      fontWeight="bold" 
                      color={item.color}
                      sx={{ fontSize: isMobile ? '0.875rem' : '1.125rem' }}
                    >
                      {item.value}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardHeader;